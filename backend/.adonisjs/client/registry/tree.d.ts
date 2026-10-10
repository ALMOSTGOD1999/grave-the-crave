/* eslint-disable prettier/prettier */
import type { routes } from './index.ts'

export interface ApiDefinition {
  auth: {
    register: typeof routes['auth.register']
    login: typeof routes['auth.login']
    adminLogin: typeof routes['auth.admin_login']
    me: typeof routes['auth.me']
    logout: typeof routes['auth.logout']
  }
  products: {
    suggest: typeof routes['products.suggest']
    lowStock: typeof routes['products.low_stock']
    index: typeof routes['products.index']
    store: typeof routes['products.store']
    update: typeof routes['products.update']
    destroy: typeof routes['products.destroy']
  }
  bills: {
    store: typeof routes['bills.store']
    index: typeof routes['bills.index']
    show: typeof routes['bills.show']
    pdf: typeof routes['bills.pdf']
  }
  promotions: {
    store: typeof routes['promotions.store']
    index: typeof routes['promotions.index']
  }
  orders: {
    store: typeof routes['orders.store']
    index: typeof routes['orders.index']
  }
}
