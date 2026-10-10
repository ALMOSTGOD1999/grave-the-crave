import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bill_items'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('bill_id').unsigned().notNullable().references('id').inTable('bills').onDelete('CASCADE')
      table.integer('product_id').unsigned().nullable().references('id').inTable('products').onDelete('SET NULL')
      table.string('product_name').notNullable()
      table.integer('quantity').notNullable().defaultTo(1)
      table.decimal('unit_price', 10, 2).notNullable().defaultTo(0)
      table.decimal('line_total', 12, 2).notNullable().defaultTo(0)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
