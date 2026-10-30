import { CustomerSchema } from '#database/schema'

/**
 * A person who has received at least one bill. Rows are created/updated
 * automatically inside the bill-creation transaction (see
 * bills_controller) — there is no manual "add customer" screen.
 */
export default class Customer extends CustomerSchema {}
