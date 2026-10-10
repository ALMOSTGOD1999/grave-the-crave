import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable().unique()
      table.decimal('buying_price', 10, 2).notNullable().defaultTo(0)
      table.decimal('profit_percent', 10, 2).notNullable().defaultTo(0)
      table.integer('stock_qty').notNullable().defaultTo(0)
      table.integer('low_stock_limit').notNullable().defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(true)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
