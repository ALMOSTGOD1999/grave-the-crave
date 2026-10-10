import type User from '#models/user'

/**
 * Plain-object user serialization for API responses.
 *
 * The http-transformers `Item` wrapper does not serialize to a flat
 * object via JSON.stringify, so responses build plain objects instead.
 */
export default class UserTransformer {
  static transform(user: User) {
    return {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }
  }
}
