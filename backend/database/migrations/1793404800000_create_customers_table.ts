import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'customers'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name').notNullable()
      table.string('phone').nullable()
      /**
       * Digits-only copy of phone. Lets the bill screen recognise the same
       * customer when the number is re-entered in a different shape
       * (+91 98765 43210 vs 098765-43210) — plain string equality cannot.
       */
      table.string('phone_digits').nullable()
      table.string('email').nullable()
      table.text('address').nullable()
      table.integer('total_bills').notNullable().defaultTo(0)
      table.decimal('total_spent', 12, 2).notNullable().defaultTo(0)
      table.timestamp('last_bill_at').nullable()

      table.index('email')
      table.index('phone_digits')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })

    /**
     * Backfill from bills that predate this table so the admin sees the
     * same faces after deploying. Best-effort dedupe on
     * (lower(name), lower(email), digits-only phone). The replace() chain
     * (not regexp_replace) keeps the SQL valid on BOTH sqlite and
     * postgres — this file runs against dev sqlite and prod Neon alike.
     */
    const digits = `replace(replace(replace(replace(replace(coalesce(b.customer_phone, ''), '+', ''), ' ', ''), '-', ''), '(', ''), ')', '')`

    this.schema.raw(`
      insert into customers
        (name, phone, phone_digits, email, address, total_bills, total_spent, last_bill_at, created_at, updated_at)
      select
        max(b.customer_name),
        max(b.customer_phone),
        ${digits},
        max(b.customer_email),
        max(b.customer_address),
        count(*),
        sum(b.total),
        max(b.created_at),
        min(b.created_at),
        max(b.created_at)
      from bills b
      group by lower(trim(b.customer_name)), lower(trim(coalesce(b.customer_email, ''))), ${digits}
    `)
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
