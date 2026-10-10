import vine from '@vinejs/vine'

export const createOrderValidator = vine.create({
  fullName: vine.string().trim().minLength(1).maxLength(120),
  phone: vine.string().trim().minLength(1).maxLength(30),
  email: vine.string().trim().toLowerCase().email().maxLength(254),
  address: vine.string().trim().minLength(1).maxLength(2000),
  deliveryDate: vine.date({ formats: ['yyyy-MM-dd'] }).optional(),
  deliveryTime: vine.string().trim().maxLength(60).optional(),
  notes: vine.string().trim().maxLength(2000).optional(),
  items: vine
    .array(
      vine.object({
        id: vine.string().trim().minLength(1).maxLength(120),
        name: vine.string().trim().minLength(1).maxLength(255),
        price: vine.number().min(0),
        quantity: vine.number().withoutDecimals().min(1).max(1000),
      })
    )
    .minLength(1)
    .maxLength(100),
})
