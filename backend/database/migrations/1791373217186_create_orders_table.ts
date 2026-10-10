import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE')
      table.json('items').notNullable()
      table.string('full_name').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.text('address').nullable()
      table.date('delivery_date').nullable()
      table.string('delivery_time').nullable()
      table.text('notes').nullable()
      table.decimal('total', 12, 2).notNullable().defaultTo(0)
      table.string('status', 20).notNullable().defaultTo('pending')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
