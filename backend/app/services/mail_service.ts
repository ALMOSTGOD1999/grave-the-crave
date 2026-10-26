import env from '#start/env'

type Attachment = {
  filename: string
  contentBase64: string
  contentType?: string
}

type SendEmailInput = {
  to: string | string[]
  subject: string
  html: string
  attachments?: Attachment[]
}

type SendEmailResult = {
  sent: boolean
  skipped: boolean
  error?: string
}

/**
 * Resend errors are JSON of shape `{ name, message, statusCode }` and the
 * `message` is written for humans (e.g. "verify a domain at resend.com/domains").
 * Surface it with the status code so admins see what to DO instead of a bare
 * "403". Falls back to a generic string for non-JSON bodies.
 */
function describeResendError(status: number, body: string): string {
  try {
    const parsed = JSON.parse(body) as { message?: string }
    if (parsed && typeof parsed.message === 'string' && parsed.message) {
      return `${parsed.message} (Resend ${status})`
    }
  } catch {
    // Non-JSON body — fall through to the generic text.
  }
  return `Resend API error (HTTP ${status})`
}

/**
 * Minimal Resend client (https://resend.com/docs/api-reference).
 *
 * Returns `{ skipped: true }` when no RESEND_API_KEY is configured so
 * callers can still finish their flow (e.g. bill saved but not mailed).
 */
export async function sendEmail(input: SendEmailInput): Promise<SendEmailResult> {
  const apiKey = env.get('RESEND_API_KEY')
  const from = env.get('FROM_EMAIL')

  if (!apiKey || !from) {
    return { sent: false, skipped: true, error: 'RESEND_API_KEY or FROM_EMAIL not configured' }
  }

  const recipients = Array.isArray(input.to) ? input.to : [input.to]
  const validRecipients = recipients.filter((r) => r && r.includes('@'))
  if (validRecipients.length === 0) {
    return { sent: false, skipped: true, error: 'No valid recipient addresses' }
  }

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to: validRecipients,
        subject: input.subject,
        html: input.html,
        attachments: input.attachments?.map((a) => ({
          filename: a.filename,
          content: a.contentBase64,
          content_type: a.contentType ?? 'application/pdf',
        })),
      }),
    })

    if (!response.ok) {
      const body = await response.text()
      console.error('[mail] Resend API error', response.status, body)
      return { sent: false, skipped: false, error: describeResendError(response.status, body) }
    }

    return { sent: true, skipped: false }
  } catch (error) {
    console.error('[mail] Failed to send email', error)
    return { sent: false, skipped: false, error: 'Network error while sending email' }
  }
}
