import User from '#models/user'
import { registerValidator, loginValidator, adminLoginValidator } from '#validators/auth'
import type { HttpContext } from '@adonisjs/core/http'
import UserTransformer from '#transformers/user_transformer'

/**
 * Authentication endpoints:
 * - register  → customer self sign-up (email + password)
 * - login     → customer login
 * - adminLogin→ seeded admin login (admin id + password)
 * - me        → current session user
 * - logout    → revoke current access token
 */
export default class AuthController {
  async register({ request, response }: HttpContext) {
    const data = await request.validateUsing(registerValidator)

    const user = await User.create({
      fullName: data.name,
      email: data.email,
      password: data.password,
      role: 'customer',
    })
    const token = await User.accessTokens.create(user)

    return response.created({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async login({ request, response }: HttpContext) {
    const { email, password } = await request.validateUsing(loginValidator)

    const user = await User.verifyCredentials(email, password)
    const token = await User.accessTokens.create(user)

    return response.ok({
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    })
  }

  async adminLogin({ request, response }: HttpContext) {
    const { username, password } = await request.validateUsing(adminLoginValidator)

    let user: User | null
    try {
      user = await User.verifyCredentials(username, password)
    } catch (error) {
      // Only treat wrong credentials as 401; DB/network failures must
      // surface as 500 instead of masquerading as bad logins.
      const code = (error as { code?: string } | null)?.code
      if (code === 'E_INVALID_CREDENTIALS') {
        return response.unauthorized({ error: 'Invalid admin credentials' })
      }
      throw error
    }

    if (user.role !== 'admin') {
      return response.forbidden({ error: 'Admin access required' })
    }

    const token = await User.accessTokens.create(user, ['*'], {
      expiresIn: '7days',
    })

    return {
      user: UserTransformer.transform(user),
      token: token.value!.release(),
    }
  }

  async me({ auth, response }: HttpContext) {
    return response.ok({ user: UserTransformer.transform(auth.getUserOrFail()) })
  }

  async logout({ auth }: HttpContext) {
    const user = auth.getUserOrFail()
    if (user.currentAccessToken) {
      await User.accessTokens.delete(user, user.currentAccessToken.identifier)
    }
    return { message: 'Logged out successfully' }
  }
}
