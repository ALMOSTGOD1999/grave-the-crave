import Promotion from '#models/promotion'
import User from '#models/user'
import { createPromotionValidator } from '#validators/promotion'
import { sendEmail } from '#services/mail_service'
import type { HttpContext } from '@adonisjs/core/http'

/**
 * Promotion endpoints (admin only):
 * - POST /api/promotions  send a campaign ('all' customers or explicit list)
 * - GET  /api/promotions  sent history
 */
export default class PromotionsController {
  async index({ response }: HttpContext) {
    const promotions = await Promotion.query().orderBy('createdAt', 'desc').limit(500)
    return response.ok({ promotions })
  }

  async store({ request, response }: HttpContext) {
    const data = await request.validateUsing(createPromotionValidator)

    let recipients: string[]
    if (data.recipients === 'all') {
      const customers = await User.query()
        .where('role', 'customer')
        .whereNotNull('email')
        .select('email')
      recipients = [...new Set(customers.map((u) => u.email))]
    } else {
      recipients = [...new Set(data.recipients)]
    }

    if (recipients.length === 0) {
      return response.badRequest({ error: 'No recipients to send to' })
    }

    const result = await sendEmail({
      to: recipients,
      subject: data.subject,
      html: data.html,
    })

    if (!result.sent) {
      // Not saved as history: nothing actually left the system.
      return response.serviceUnavailable({
        error: `Email not sent: ${result.error}`,
      })
    }

    const promotion = await Promotion.create({
      subject: data.subject,
      html: data.html,
      recipients: data.recipients === 'all' ? 'all' : recipients,
      sentCount: recipients.length,
    })

    return response.created({ promotion })
  }
}
