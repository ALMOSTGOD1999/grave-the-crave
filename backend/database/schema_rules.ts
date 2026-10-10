import { type SchemaRules } from '@adonisjs/lucid/types/schema_generator'

/**
 * Schema generation rules.
 *
 * Postgres DECIMAL columns default to `tsType: 'string'` because the
 * node-postgres driver returns NUMERIC as a string. We register custom
 * type parsers (see config/database.ts) so decimals arrive as numbers,
 * which keeps money/percent columns typed as `number` in the
 * generated schema.
 */
export default {
  types: {
    decimal: {
      tsType: 'number',
      imports: [],
      decorators: [{ name: '@column' }],
    },
  },
} satisfies SchemaRules
