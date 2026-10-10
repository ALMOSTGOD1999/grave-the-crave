import vine from '@vinejs/vine'

/**
 * Customer self-registration (email + password, no OTP for now).
 */
export const registerValidator = vine.create({
  name: vine.string().trim().minLength(1).maxLength(120),
  email: vine
    .string()
    .trim()
    .toLowerCase()
    .email()
    .maxLength(254)
    .unique({ table: 'users', column: 'email' }),
  password: vine.string().minLength(6).maxLength(72),
})

/**
 * Customer login.
 */
export const loginValidator = vine.create({
  email: vine.string().trim().toLowerCase().email().maxLength(254),
  password: vine.string(),
})

/**
 * Admin login — username must be the seeded admin id.
 */
export const adminLoginValidator = vine.create({
  username: vine.string().trim().minLength(1).maxLength(60),
  password: vine.string().minLength(1).maxLength(72),
})
