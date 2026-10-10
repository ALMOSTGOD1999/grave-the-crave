import { OrderSchema } from '#database/schema'
import { column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'

const jsonHooks = {
  prepare: (value: any) => (value === undefined || value === null ? value : JSON.stringify(value)),
  consume: (value: any) => {
    if (typeof value !== 'string') return value
    try {
      return JSON.parse(value)
    } catch {
      return value
    }
  },
}

export default class Order extends OrderSchema {
  /**
   * Cart snapshot (JSON column). The generated schema uses a plain
   * `@column()` which cannot bind an object on SQLite, so override
   * with explicit prepare/consume JSON hooks.
   */
  @column(jsonHooks)
  declare items: any

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
