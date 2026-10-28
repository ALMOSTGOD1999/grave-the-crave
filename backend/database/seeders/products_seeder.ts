import Product from '#models/product'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

const NAMES = [
  'BENTO BOX',
  '24pcs nozzle box',
  'TROPOLITE white sugar paste (250g)',
  'Sparkle candle (6pcs)',
  'Spiral candle (6ps)',
  'Kitchen scale',
  'FAUX BALL',
  'Paper butterfly',
  'golden HBD cake topper(Regular)',
  'Aniversary topper ',
  'COCOA POWDER PREMIUM',
  'TURN TABLE',
  'MALAS CRUSH MANGO 250ML',
  'MALAS CRUSH STRAWBERRY 250ML',
  'MALAS CRUSH BUTTER SCOCH 250ML',
  'MALAS CRUSH PINEAPPLE 250ML',
  'Dark chocochips 100g',
  'White chocochips 100g',
  'Morde butterscotch nuts 100g',
  'Tropolite premium CREAM',
  'All time vanilla pemix',
  'All time chocolate pemix',
  '2m dark compound',
  '2m white compound',
  '2m milk compound',
  'Silicon spatula Big',
  'PLATE KNIFE',
  '8 8 white base (MDF)',
  '10 10 white base (MDF)',
  '8x8x5 special box',
  '10x10x5 special box',
  'Premium icing gel colour',
  'WOODEN KNIFE',
]

/**
 * Seeds the 33 supplier products with zeroed prices/stock. Idempotent:
 * products that already exist are never overwritten, so admin-set
 * prices, stock and low-stock limits survive re-seeding.
 */
export default class ProductsSeeder extends BaseSeeder {
  async run() {
    for (const name of NAMES) {
      await Product.firstOrCreate(
        { name },
        {
          name,
          stockQty: 0,
          lowStockLimit: 0,
          buyingPrice: 0,
          profitPercent: 0,
          isActive: true,
        }
      )
    }
  }
}
