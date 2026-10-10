import vine from '@vinejs/vine'

const price = () => vine.number().min(0).decimal([0, 2])
const nonNegativeInt = () => vine.number().withoutDecimals().min(0)

export const createProductValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(255).unique({
    table: 'products',
    column: 'name',
  }),
  buyingPrice: price().optional(),
  profitPercent: vine.number().min(0).max(1000).optional(),
  stockQty: nonNegativeInt().optional(),
  lowStockLimit: nonNegativeInt().optional(),
})

/**
 * Partial update - every field optional, used for stock updates,
 * pricing updates and product create flow's edit counterpart.
 *
 * Name uniqueness is enforced in the controller (excluding the row
 * being updated) because the DB `unique` rule would reject the row
 * against itself.
 */
export const updateProductValidator = vine.create({
  name: vine
    .string()
    .trim()
    .minLength(1)
    .maxLength(255)
    .optional(),
  buyingPrice: price().optional(),
  profitPercent: vine.number().min(0).max(1000).optional(),
  stockQty: nonNegativeInt().optional(),
  lowStockLimit: nonNegativeInt().optional(),
  isActive: vine.boolean().optional(),
})
