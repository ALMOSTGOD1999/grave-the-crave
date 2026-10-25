import vine from '@vinejs/vine'

/**
 * Bill creation payload. Unit prices are always read from the
 * database (product selling price) — never trusted from input.
 */
export const createBillValidator = vine.create({
  customerName: vine.string().trim().minLength(1).maxLength(255),
  customerAddress: vine.string().trim().maxLength(2000).optional(),
  customerPhone: vine
    .string()
    .trim()
    .maxLength(30)
    .regex(/^[0-9+\-\s()]*$/)
    .optional(),
  customerEmail: vine.string().trim().toLowerCase().email().maxLength(254).optional(),
  /**
   * When false, the bill is recorded but stock levels are left untouched.
   * Omitted/true keeps the classic behaviour (deduct stock).
   */
  deductStock: vine.boolean().optional(),
  items: vine
    .array(
      vine.object({
        productId: vine.number().withoutDecimals().positive(),
        quantity: vine.number().withoutDecimals().min(1).max(100000),
      })
    )
    .minLength(1)
    .maxLength(500),
})
