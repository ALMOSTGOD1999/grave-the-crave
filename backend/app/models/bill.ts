import { BillSchema } from '#database/schema'
import { hasMany } from '@adonisjs/lucid/orm'
import type { HasMany } from '@adonisjs/lucid/types/relations'
import BillItem from '#models/bill_item'

export default class Bill extends BillSchema {
  @hasMany(() => BillItem)
  declare items: HasMany<typeof BillItem>
}
