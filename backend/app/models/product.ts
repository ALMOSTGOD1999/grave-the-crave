import { ProductSchema } from '#database/schema'
import { computed } from '@adonisjs/lucid/orm'

export default class Product extends ProductSchema {
  /**
   * Selling price derived from buying price + profit percentage.
   */
  @computed()
  get sellingPrice(): number {
    const buying = Number(this.buyingPrice) || 0
    const percent = Number(this.profitPercent) || 0
    return Math.round(buying * (1 + percent / 100) * 100) / 100
  }

  /**
   * True when stock has reached the admin-defined low stock limit.
   */
  @computed()
  get isLowStock(): boolean {
    return Number(this.stockQty) <= Number(this.lowStockLimit)
  }
}
