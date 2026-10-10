import Product from '#models/product'
import { createProductValidator, updateProductValidator } from '#validators/product'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Product catalog endpoints (admin only):
 * - list with computed sellingPrice + isLowStock
 * - billing autocomplete (suggest)
 * - low stock view
 * - create / partial update / delete
 */
export default class ProductsController {
  async index({ response }: HttpContext) {
    const products = await Product.query().orderBy('name', 'asc')
    return response.ok({ products })
  }

  async suggest({ request, response }: HttpContext) {
    const q = (request.input('q') as string | undefined)?.trim() ?? ''
    let query = Product.query().where('isActive', true)

    if (q) {
      query = query.where((builder) => {
        builder.whereILike('name', `%${q}%`)
      })
    }

    const products = await query
      .orderBy('name', 'asc')
      .limit(15)
      .select(['id', 'name', 'stockQty', 'buyingPrice', 'profitPercent'])

    return response.ok({ products })
  }

  async lowStock({ response }: HttpContext) {
    // Raw comparison: whereColumn's right-hand reference does not pass
    // through the model key resolver, so use actual column names.
    const products = await Product.query()
      .whereRaw('stock_qty <= low_stock_limit')
      .orderBy('name', 'asc')
    return response.ok({ products })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createProductValidator)
    const product = await Product.create(data)
    return response.created({ product })
  }

  async update({ params, request, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    const data = await request.validateUsing(updateProductValidator)

    // Name uniqueness (excluding this row) - cannot use the DB unique
    // rule here because it would compare the row against itself.
    if (data.name !== undefined && data.name !== product.name) {
      const clash = await Product.query()
        .where('name', data.name)
        .where('id', '!=', product.id)
        .first()
      if (clash) {
        return response.badRequest({ error: 'Another product already uses this name' })
      }
    }

    product.merge(data)
    await product.save()
    return response.ok({ product })
  }

  async destroy({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()
    return response.ok({ message: 'Product deleted' })
  }
}
