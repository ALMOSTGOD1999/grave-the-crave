import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import type { Authenticators } from '@adonisjs/auth/types'

/**
 * Restricts a route to users with the `admin` role. Must run
 * after the auth middleware so `ctx.auth.user` is populated.
 */
export default class AdminMiddleware {
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: { guards?: (keyof Authenticators)[] } = {}
  ) {
    await ctx.auth.authenticateUsing(options.guards)

    const user = ctx.auth.getUserOrFail()
    if (user.role !== 'admin') {
      return ctx.response.forbidden({ error: 'Admin access required' })
    }

    return next()
  }
}
