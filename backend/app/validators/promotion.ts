import vine from '@vinejs/vine'

const emailArray = vine
  .array(vine.string().trim().toLowerCase().email().maxLength(254))
  .minLength(1)
  .maxLength(5000)

/**
 * Basic promotion email — recipients may be the literal 'all'
 * (every registered customer) or an explicit list of addresses.
 */
export const createPromotionValidator = vine.create({
  subject: vine.string().trim().minLength(1).maxLength(255),
  html: vine.string().trim().minLength(1).maxLength(500_000),
  recipients: vine.union([
    // The refiner is typed as Record<string, unknown> by Vine even though
    // it receives the raw field value - narrow it back to a string.
    vine.union.if((value) => (value as unknown) === 'all', vine.literal('all')),
    vine.union.else(emailArray),
  ]),
})
