import { BillItemSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import Bill from '#models/bill'

export default class BillItem extends BillItemSchema {
  @belongsTo(() => Bill)
  declare bill: BelongsTo<typeof Bill>
}
