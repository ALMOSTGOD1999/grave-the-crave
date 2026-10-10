import User from '#models/user'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

/**
 * Seeds the single admin account used for the 4 dashboard sections.
 * Login: username `Admin`, password `Dholuvolu`.
 * Idempotent - existing admin is left untouched (password is NOT reset).
 */
export default class AdminSeeder extends BaseSeeder {
  async run() {
    await User.firstOrCreate(
      { email: 'Admin' },
      {
        fullName: 'Grave the Crave Admin',
        email: 'Admin',
        password: 'Dholuvolu',
        role: 'admin',
      }
    )
  }
}
