import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'bills'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('bill_number').notNullable().unique()
      table.string('customer_name').notNullable()
      table.text('customer_address').nullable()
      table.string('customer_phone').nullable()
      table.string('customer_email').nullable()
      table.decimal('subtotal', 12, 2).notNullable().defaultTo(0)
      table.decimal('total', 12, 2).notNullable().defaultTo(0)
      table.boolean('emailed').notNullable().defaultTo(false)

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
