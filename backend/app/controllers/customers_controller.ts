import Customer from '#models/customer'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Customer directory (admin only):
 * - GET /api/customers  paginated list, optional `?q=` free-text search
 *   over name / phone / email. Customers are added automatically when a
 *   bill is created (see bills_controller.store) — there is no create
 *   endpoint by design.
 */
export default class CustomersController {
  async index({ request, response }: HttpContext) {
    const page = Math.max(1, Number(request.input('page', 1)) || 1)
    const limit = Math.min(100, Math.max(1, Number(request.input('limit', 20)) || 20))
    const q = String(request.input('q', '') ?? '').trim()

    // Most recent buyer first; id breaks ties deterministically.
    const query = Customer.query().orderBy('lastBillAt', 'desc').orderBy('id', 'desc')

    if (q) {
      const like = `%${q}%`
      query.where((builder) => {
        builder.whereILike('name', like).orWhereILike('phone', like).orWhereILike('email', like)
      })
    }

    const customers = await query.paginate(page, limit)
    return response.ok({ customers })
  }
}
