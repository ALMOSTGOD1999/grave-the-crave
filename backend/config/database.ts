import app from '@adonisjs/core/services/app'
import env from '#start/env'
import { defineConfig } from '@adonisjs/lucid'
import pg from 'pg'

/**
 * node-postgres returns NUMERIC/DECIMAL (OID 1700) and BIGINT (OID 20)
 * as strings. Money columns (bills.total, product prices, quantities)
 * must arrive as JSON numbers, so override the default parsers.
 * Registered globally - knex loads the same `pg` module instance.
 */
pg.types.setTypeParser(1700, (value: string) => parseFloat(value))
pg.types.setTypeParser(20, (value: string) => Number(value))

const dbConfig = defineConfig({
  /**
   * Local development falls back to SQLite. Production (Coolify)
   * provides DATABASE_URL pointing at Neon Postgres.
   */
  connection: env.get('DATABASE_URL') ? 'pg' : 'sqlite',

  connections: {
    /**
     * SQLite connection (local development).
     */
    sqlite: {
      client: 'better-sqlite3',

      connection: {
        filename: app.tmpPath('db.sqlite3'),
      },

      /**
       * Required by Knex for SQLite defaults.
       */
      useNullAsDefault: true,

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },
    },

    /**
     * PostgreSQL connection (Neon). Activated when DATABASE_URL is set.
     */
    pg: {
      client: 'pg',
      connection: {
        connectionString: env.get('DATABASE_URL'),
        ssl: env.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : undefined,
      },

      migrations: {
        naturalSort: true,
        paths: ['database/migrations'],
      },

      schemaGeneration: {
        enabled: true,
        rulesPaths: ['./database/schema_rules.js'],
      },

      debug: app.inDev,
    },
  },
})

export default dbConfig
