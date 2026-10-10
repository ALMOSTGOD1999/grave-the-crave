import db from '@adonisjs/lucid/services/db'
import Bill from '#models/bill'
import BillItem from '#models/bill_item'
import Product from '#models/product'
import { createBillValidator } from '#validators/bill'
import type { HttpContext } from '@adonisjs/core/http'
import { generateBillPdf } from '#services/bill_pdf_service'
import { sendEmail } from '#services/mail_service'

const PDF_FILENAME = (billNumber: string) => `invoice-${billNumber}.pdf`

const billEmailHtml = (bill: Bill, items: BillItem[]) => {
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #fde68a;">${item.productName}</td>
        <td style="padding:8px;border-bottom:1px solid #fde68a;text-align:right;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #fde68a;text-align:right;">Rs ${Number(item.unitPrice).toFixed(2)}</td>
        <td style="padding:8px;border-bottom:1px solid #fde68a;text-align:right;">Rs ${Number(item.lineTotal).toFixed(2)}</td>
      </tr>`
    )
    .join('')

  return `
  <div style="font-family:Helvetica,Arial,sans-serif;max-width:600px;margin:0 auto;color:#292524;">
    <div style="background:#d97706;padding:20px 24px;border-radius:10px 10px 0 0;">
      <h1 style="margin:0;color:#fff;font-size:20px;">Grave the Crave</h1>
      <p style="margin:4px 0 0;color:#fef3c7;font-size:13px;">Invoice ${bill.billNumber}</p>
    </div>
    <div style="border:1px solid #fde68a;border-top:none;padding:24px;background:#fffbeb;border-radius:0 0 10px 10px;">
      <p style="margin:0 0 4px;">Dear <strong>${bill.customerName}</strong>,</p>
      <p style="margin:0 0 16px;">Thank you for your order. Your invoice is attached as a PDF.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;background:#fff;">
        <thead>
          <tr style="background:#d97706;color:#fff;">
            <th style="padding:8px;text-align:left;">Product</th>
            <th style="padding:8px;text-align:right;">Qty</th>
            <th style="padding:8px;text-align:right;">Rate</th>
            <th style="padding:8px;text-align:right;">Amount</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
      <p style="text-align:right;font-size:18px;margin:16px 0 0;">
        Total: <strong>Rs ${Number(bill.total).toFixed(2)}</strong>
      </p>
      <p style="color:#78716c;font-size:12px;margin-top:24px;">
        Follow us on Facebook for offers and updates.<br/>gravethecrave@gmail.com
      </p>
    </div>
  </div>`
}

/**
 * Billing endpoints (admin only):
 * - POST   /api/bills          create bill, decrement stock, PDF + email
 * - GET    /api/bills          history (paginated)
 * - GET    /api/bills/:id      single bill with items
 * - GET    /api/bills/:id/pdf  regenerate + download the invoice PDF
 */
export default class BillsController {
  async index({ request, response }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const limit = Math.min(100, Math.max(1, Number(request.input('limit', 20)) || 20))

    const bills = await Bill.query()
      .preload('items')
      .orderBy('createdAt', 'desc')
      .paginate(page, limit)

    return response.ok({ bills })
  }

  async show({ params, response }: HttpContext) {
    const bill = await Bill.findOrFail(params.id)
    await bill.load('items')
    return response.ok({ bill })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createBillValidator)

    // Aggregate quantities per product (same product may appear twice).
    const wanted = new Map<number, number>()
    for (const item of data.items) {
      wanted.set(item.productId, (wanted.get(item.productId) ?? 0) + item.quantity)
    }

    const products = await Product.query().whereIn('id', [...wanted.keys()])
    const byId = new Map(products.map((p) => [p.id, p]))

    const missing = [...wanted.keys()].filter((id) => !byId.has(id))
    if (missing.length > 0) {
      return response.badRequest({ error: `Unknown product id(s): ${missing.join(', ')}` })
    }

    // Stock guard — refuse to bill more than what is in stock.
    const shortages = products
      .filter((p) => Number(p.stockQty) < wanted.get(p.id)!)
      .map((p) => `${p.name} (available: ${p.stockQty}, requested: ${wanted.get(p.id)})`)
    if (shortages.length > 0) {
      return response.conflict({
        error: `Insufficient stock for: ${shortages.join('; ')}`,
      })
    }

    // Sequential per-day bill number. In Lucid 22 the aggregate alias is
    // exposed as a direct property on the row (`row.total`), NOT under
    // `$extras` — reading `$extras.total` returned undefined and produced
    // bill numbers like `GTC-20261010-0NaN`.
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const todayCount = await Bill.query().where('createdAt', '>=', startOfDay).count('* as total')
    const countRow = todayCount[0] as unknown as {
      total?: string | number
      $extras?: Record<string, unknown>
    }
    const rawTotal = countRow.total ?? countRow.$extras?.total ?? 0
    const parsedTotal = Number(rawTotal)
    const seq = (Number.isFinite(parsedTotal) ? parsedTotal : 0) + 1
    const stamp = new Date().toISOString().slice(0, 10).replaceAll('-', '')
    const billNumber = `GTC-${stamp}-${String(seq).padStart(4, '0')}`

    let bill: Bill
    let items: BillItem[]

    try {
      bill = await db.transaction(async (trx) => {
        const subtotal = products.reduce((sum, p) => {
          const qty = wanted.get(p.id)!
          return sum + p.sellingPrice * qty
        }, 0)

        const created = await Bill.create(
          {
            billNumber,
            customerName: data.customerName,
            customerAddress: data.customerAddress,
            customerPhone: data.customerPhone,
            customerEmail: data.customerEmail,
            subtotal: Math.round(subtotal * 100) / 100,
            total: Math.round(subtotal * 100) / 100,
          },
          { client: trx }
        )

        for (const product of products) {
          const qty = wanted.get(product.id)!
          await BillItem.create(
            {
              billId: created.id,
              productId: product.id,
              productName: product.name,
              quantity: qty,
              unitPrice: product.sellingPrice,
              lineTotal: Math.round(product.sellingPrice * qty * 100) / 100,
            },
            { client: trx }
          )

          // Atomic decrement inside the transaction. `save()` cannot be
          // bound to a transaction client, but the query builder can.
          await Product.query({ client: trx }).where('id', product.id).decrement('stockQty', qty)
        }

        return created
      })

      items = await BillItem.query().where('billId', bill.id)
    } catch (error) {
      console.error('[bills] transaction failed', error)
      return response.internalServerError({ error: 'Failed to create bill' })
    }

    // PDF + email are best-effort after the bill is safely stored.
    let emailed = false
    let emailWarning: string | undefined

    if (bill.customerEmail) {
      try {
        const pdf = await generateBillPdf(bill, items)
        const result = await sendEmail({
          to: bill.customerEmail,
          subject: `Invoice ${bill.billNumber} — Grave the Crave`,
          html: billEmailHtml(bill, items),
          attachments: [{ filename: PDF_FILENAME(bill.billNumber), contentBase64: pdf.toString('base64') }],
        })

        if (result.sent) {
          emailed = true
          await bill.merge({ emailed: true }).save()
        } else if (result.skipped) {
          emailWarning = `Email not sent: ${result.error}`
        } else {
          emailWarning = `Email failed: ${result.error}`
        }
      } catch (error) {
        console.error('[bills] email/pdf failed', error)
        emailWarning = 'Email failed unexpectedly'
      }
    }

    await bill.load('items')

    return response.created({
      bill,
      emailed,
      emailWarning,
      pdfUrl: `/api/bills/${bill.id}/pdf`,
    })
  }

  async pdf({ params, response }: HttpContext) {
    const bill = await Bill.findOrFail(params.id)
    await bill.load('items')
    const pdf = await generateBillPdf(bill, bill.items)

    return response
      .header('Content-Type', 'application/pdf')
      .header('Content-Disposition', `attachment; filename="${PDF_FILENAME(bill.billNumber)}"`)
      .send(pdf)
  }
}
