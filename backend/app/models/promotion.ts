import { PromotionSchema } from '#database/schema'
import { column } from '@adonisjs/lucid/orm'

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

export default class Promotion extends PromotionSchema {
  /**
   * Recipient list - either the literal `'all'` or an array of
   * addresses. See Order model for why the hooks are needed.
   */
  @column(jsonHooks)
  declare recipients: any
}
