import Order from '#models/order'
import { createOrderValidator } from '#validators/order'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Customer order endpoints (authenticated):
 * - POST /api/orders  place an order (snapshot of the client cart)
 * - GET  /api/orders  own order history
 *
 * Orders do NOT touch stock - billing is the stock-aware flow.
 */
export default class OrdersController {
  async store({ request, response, auth }: HttpContext) {
    const data = await request.validateUsing(createOrderValidator)
    const user = auth.user!

    // Total is recomputed server-side from the submitted line prices.
    const total = data.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
      userId: user.id,
      fullName: data.fullName,
      phone: data.phone,
      email: data.email,
      address: data.address,
      deliveryDate: data.deliveryDate ?? null,
      deliveryTime: data.deliveryTime ?? null,
      notes: data.notes ?? null,
      items: data.items,
      total: Math.round(total * 100) / 100,
      status: 'pending',
    })

    return response.created({ order })
  }

  async index({ response, auth }: HttpContext) {
    const user = auth.user!

    const query = Order.query().orderBy('createdAt', 'desc')
    if (user.role !== 'admin') {
      query.where('userId', user.id)
    }

    const orders = await query.limit(500)
    return response.ok({ orders })
  }
}
