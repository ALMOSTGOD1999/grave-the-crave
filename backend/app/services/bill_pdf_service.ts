import app from '@adonisjs/core/services/app'
import { existsSync } from 'node:fs'
import PDFDocument from 'pdfkit'
import type { DateTime } from 'luxon'
import type Bill from '#models/bill'
import type BillItem from '#models/bill_item'

const PAGE_MARGIN = 48
const ITEMS_PER_PAGE = 5
const ROW_HEIGHT = 26

const BRAND = {
  name: 'Grave the Crave',
  tagline: 'Handcrafted bakes, delivered with love',
  email: 'gravethecrave@gmail.com',
  facebook: 'https://www.facebook.com/profile.php?id=61552625923857',
}

const AMBER = '#d97706'
const DARK = '#292524'
const MUTED = '#78716c'
const LIGHT_BG = '#fffbeb'
const BORDER = '#e7e5e4'

const money = (value: unknown) =>
  `Rs ${Number(value || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }`

const formatDate = (date: DateTime | Date | null | undefined) => {
  if (!date) return ''
  const jsDate = date instanceof Date ? date : date.toJSDate()
  return jsDate.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
}

/**
 * Builds the invoice PDF for a bill.
 *
 * - First page carries the branded header, customer block and table head.
 * - Every page holds at most 5 product rows; extra rows spill to new pages
 *   with a compact continuation header.
 * - The logo is drawn as a faint watermark behind the content on every page.
 */
export function generateBillPdf(bill: Bill, items: BillItem[]): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margin: PAGE_MARGIN,
      info: { Title: `Bill ${bill.billNumber}`, Author: BRAND.name },
      bufferPages: true,
    })

    const chunks: Buffer[] = []
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    const logoPath = app.makePath('assets', 'logo.jpeg')
    const hasLogo = existsSync(logoPath)
    if (!hasLogo) {
      console.error('[pdf] logo not found at', logoPath)
    }
    const pageWidth = doc.page.width - PAGE_MARGIN * 2

    const watermark = () => {
      if (!hasLogo) return
      const size = 260
      doc.save()
      try {
        doc.opacity(0.07)
        doc.image(logoPath, (doc.page.width - size) / 2, (doc.page.height - size) / 2, { width: size })
      } catch (error) {
        // Decorative only — log it, never fail the invoice over it.
        console.error('[pdf] watermark failed', error)
      } finally {
        // CRITICAL: this must run even when image() throws. If it is skipped,
        // the page stays at 0.07 opacity and the WHOLE invoice renders
        // unreadably faint.
        doc.restore()
        doc.opacity(1)
      }
    }

    const footer = (pageNo: number, totalPages: number) => {
      const y = doc.page.height - PAGE_MARGIN - 18
      doc.save()
      doc.strokeColor(BORDER).lineWidth(1).moveTo(PAGE_MARGIN, y - 8).lineTo(doc.page.width - PAGE_MARGIN, y - 8).stroke()
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
      doc.text(`${BRAND.name}  •  ${BRAND.email}`, PAGE_MARGIN, y, { continued: true, width: pageWidth / 2 })
      doc.text(`Page ${pageNo} of ${totalPages}`, doc.page.width - PAGE_MARGIN - 80, y, { width: 80, align: 'right' })
      doc.restore()
    }

    const brandedHeader = () => {
      if (hasLogo) {
        try {
          doc.image(logoPath, PAGE_MARGIN, PAGE_MARGIN, { width: 54 })
        } catch (error) {
          console.error('[pdf] header logo failed', error)
        }
      }
      doc.font('Helvetica-Bold').fontSize(22).fillColor(DARK)
      doc.text(BRAND.name, PAGE_MARGIN + 66, PAGE_MARGIN - 4)
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
      doc.text(BRAND.tagline, PAGE_MARGIN + 66, PAGE_MARGIN + 24)
      doc.text(BRAND.email, PAGE_MARGIN + 66, PAGE_MARGIN + 36)

      // Invoice label, right aligned
      doc.font('Helvetica-Bold').fontSize(16).fillColor(AMBER)
      doc.text('INVOICE', doc.page.width - PAGE_MARGIN - 120, PAGE_MARGIN - 2, { width: 120, align: 'right' })
      doc.font('Helvetica').fontSize(9).fillColor(DARK)
      doc.text(bill.billNumber, doc.page.width - PAGE_MARGIN - 160, PAGE_MARGIN + 20, {
        width: 160,
        align: 'right',
      })
      doc.text(formatDate(bill.createdAt), doc.page.width - PAGE_MARGIN - 160, PAGE_MARGIN + 34, {
        width: 160,
        align: 'right',
      })

      let y = PAGE_MARGIN + 58
      doc.strokeColor(AMBER).lineWidth(2).moveTo(PAGE_MARGIN, y).lineTo(doc.page.width - PAGE_MARGIN, y).stroke()
      return y + 16
    }

    const compactHeader = () => {
      doc.font('Helvetica-Bold').fontSize(12).fillColor(DARK)
      doc.text(`${BRAND.name} — Invoice ${bill.billNumber} (continued)`, PAGE_MARGIN, PAGE_MARGIN - 6)
      let y = PAGE_MARGIN + 14
      doc.strokeColor(BORDER).lineWidth(1).moveTo(PAGE_MARGIN, y).lineTo(doc.page.width - PAGE_MARGIN, y).stroke()
      return y + 14
    }

    const customerBlock = (startY: number) => {
      doc.font('Helvetica-Bold').fontSize(8).fillColor(AMBER)
      doc.text('BILL TO', PAGE_MARGIN, startY)
      doc.font('Helvetica').fontSize(10).fillColor(DARK)
      let y = startY + 14
      doc.text(bill.customerName, PAGE_MARGIN, y)
      y += 14
      if (bill.customerAddress) {
        doc.fontSize(9).fillColor(MUTED)
        doc.text(bill.customerAddress, PAGE_MARGIN, y, { width: pageWidth / 2 })
        y = doc.y + 6
      }
      const contact = [bill.customerPhone, bill.customerEmail].filter(Boolean).join('  •  ')
      if (contact) {
        doc.fontSize(9).fillColor(MUTED)
        doc.text(contact, PAGE_MARGIN, y)
        y = doc.y + 4
      }
      return y + 10
    }

    const tableHead = (startY: number) => {
      doc.rect(PAGE_MARGIN, startY, pageWidth, 22).fill(AMBER)
      doc.font('Helvetica-Bold').fontSize(9).fillColor('#ffffff')
      doc.text('#', PAGE_MARGIN + 8, startY + 7, { width: 28 })
      doc.text('PRODUCT', PAGE_MARGIN + 40, startY + 7, { width: pageWidth - 240 })
      doc.text('QTY', PAGE_MARGIN + pageWidth - 190, startY + 7, { width: 50, align: 'right' })
      doc.text('RATE', PAGE_MARGIN + pageWidth - 130, startY + 7, { width: 60, align: 'right' })
      doc.text('AMOUNT', PAGE_MARGIN + pageWidth - 62, startY + 7, { width: 54, align: 'right' })
      return startY + 22
    }

    const tableRow = (index: number, item: BillItem, startY: number) => {
      if (index % 2 === 1) {
        doc.rect(PAGE_MARGIN, startY, pageWidth, ROW_HEIGHT).fill(LIGHT_BG)
      }
      doc.font('Helvetica').fontSize(9).fillColor(DARK)
      doc.text(String(index + 1), PAGE_MARGIN + 8, startY + 8, { width: 28 })
      doc.text(item.productName, PAGE_MARGIN + 40, startY + 8, {
        width: pageWidth - 250,
        height: 12,
        ellipsis: true,
      })
      doc.text(String(item.quantity), PAGE_MARGIN + pageWidth - 190, startY + 8, { width: 50, align: 'right' })
      doc.text(money(item.unitPrice), PAGE_MARGIN + pageWidth - 130, startY + 8, { width: 60, align: 'right' })
      doc.text(money(item.lineTotal), PAGE_MARGIN + pageWidth - 62, startY + 8, { width: 54, align: 'right' })
      doc
        .strokeColor(BORDER)
        .lineWidth(0.5)
        .moveTo(PAGE_MARGIN, startY + ROW_HEIGHT)
        .lineTo(PAGE_MARGIN + pageWidth, startY + ROW_HEIGHT)
        .stroke()
      return startY + ROW_HEIGHT
    }

    const totalsBlock = (startY: number) => {
      const boxWidth = 240
      const x = PAGE_MARGIN + pageWidth - boxWidth
      doc.rect(x, startY, boxWidth, 34).fill(LIGHT_BG)
      doc.font('Helvetica-Bold').fontSize(11).fillColor(DARK)
      doc.text('TOTAL', x + 10, startY + 11, { width: 100 })
      doc.text(money(bill.total), x + boxWidth - 130, startY + 11, { width: 120, align: 'right' })
      let y = startY + 48
      doc.font('Helvetica-Bold').fontSize(8).fillColor(AMBER)
      doc.text('TERMS & CONDITIONS', PAGE_MARGIN, y)
      doc.font('Helvetica').fontSize(8).fillColor(MUTED)
      doc.text(
        'Goods once sold are subject to the shop policy. Please retain this invoice for reference. ' +
          `Follow us on Facebook for offers: ${BRAND.facebook}`,
        PAGE_MARGIN,
        y + 12,
        { width: pageWidth - boxWidth - 20, lineGap: 2 }
      )
      doc.font('Helvetica-Bold').fontSize(10).fillColor(DARK)
      doc.text('Thank you for your order!', PAGE_MARGIN, doc.y + 14, { width: pageWidth, align: 'center' })
      return doc.y
    }

    // ---- Layout ------------------------------------------------------------

    watermark()
    let y = brandedHeader()
    y = customerBlock(y)

    let rowStart = 0
    let firstPage = true

    while (rowStart < items.length) {
      if (!firstPage) {
        doc.addPage()
        watermark()
        y = compactHeader()
      }

      y = tableHead(y)
      const slice = items.slice(rowStart, rowStart + ITEMS_PER_PAGE)
      for (const [i, item] of slice.entries()) {
        y = tableRow(rowStart + i, item, y)
      }
      rowStart += ITEMS_PER_PAGE
      firstPage = false
    }

    // Edge case: bill with zero printable rows still gets totals.
    if (items.length === 0) {
      doc.font('Helvetica').fontSize(10).fillColor(MUTED)
      doc.text('No line items', PAGE_MARGIN, y + 10)
      y += 30
    }

    totalsBlock(y + 16)

    // Footers on every buffered page.
    const range = doc.bufferedPageRange()
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i)
      footer(i - range.start + 1, range.count)
    }

    doc.end()
  })
}
