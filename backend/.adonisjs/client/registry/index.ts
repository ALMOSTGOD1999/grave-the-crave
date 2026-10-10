/* eslint-disable prettier/prettier */
import type { AdonisEndpoint } from '@tuyau/core/types'
import type { Registry } from './schema.d.ts'
import type { ApiDefinition } from './tree.d.ts'

const placeholder: any = {}

const routes = {
  'auth.register': {
    methods: ["POST"],
    pattern: '/api/auth/register',
    tokens: [{"old":"/api/auth/register","type":0,"val":"api","end":""},{"old":"/api/auth/register","type":0,"val":"auth","end":""},{"old":"/api/auth/register","type":0,"val":"register","end":""}],
    types: placeholder as Registry['auth.register']['types'],
  },
  'auth.login': {
    methods: ["POST"],
    pattern: '/api/auth/login',
    tokens: [{"old":"/api/auth/login","type":0,"val":"api","end":""},{"old":"/api/auth/login","type":0,"val":"auth","end":""},{"old":"/api/auth/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.login']['types'],
  },
  'auth.admin_login': {
    methods: ["POST"],
    pattern: '/api/auth/admin/login',
    tokens: [{"old":"/api/auth/admin/login","type":0,"val":"api","end":""},{"old":"/api/auth/admin/login","type":0,"val":"auth","end":""},{"old":"/api/auth/admin/login","type":0,"val":"admin","end":""},{"old":"/api/auth/admin/login","type":0,"val":"login","end":""}],
    types: placeholder as Registry['auth.admin_login']['types'],
  },
  'auth.me': {
    methods: ["GET","HEAD"],
    pattern: '/api/auth/me',
    tokens: [{"old":"/api/auth/me","type":0,"val":"api","end":""},{"old":"/api/auth/me","type":0,"val":"auth","end":""},{"old":"/api/auth/me","type":0,"val":"me","end":""}],
    types: placeholder as Registry['auth.me']['types'],
  },
  'auth.logout': {
    methods: ["POST"],
    pattern: '/api/auth/logout',
    tokens: [{"old":"/api/auth/logout","type":0,"val":"api","end":""},{"old":"/api/auth/logout","type":0,"val":"auth","end":""},{"old":"/api/auth/logout","type":0,"val":"logout","end":""}],
    types: placeholder as Registry['auth.logout']['types'],
  },
  'products.suggest': {
    methods: ["GET","HEAD"],
    pattern: '/api/products/suggest',
    tokens: [{"old":"/api/products/suggest","type":0,"val":"api","end":""},{"old":"/api/products/suggest","type":0,"val":"products","end":""},{"old":"/api/products/suggest","type":0,"val":"suggest","end":""}],
    types: placeholder as Registry['products.suggest']['types'],
  },
  'products.low_stock': {
    methods: ["GET","HEAD"],
    pattern: '/api/products/low-stock',
    tokens: [{"old":"/api/products/low-stock","type":0,"val":"api","end":""},{"old":"/api/products/low-stock","type":0,"val":"products","end":""},{"old":"/api/products/low-stock","type":0,"val":"low-stock","end":""}],
    types: placeholder as Registry['products.low_stock']['types'],
  },
  'products.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/products',
    tokens: [{"old":"/api/products","type":0,"val":"api","end":""},{"old":"/api/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.index']['types'],
  },
  'products.store': {
    methods: ["POST"],
    pattern: '/api/products',
    tokens: [{"old":"/api/products","type":0,"val":"api","end":""},{"old":"/api/products","type":0,"val":"products","end":""}],
    types: placeholder as Registry['products.store']['types'],
  },
  'products.update': {
    methods: ["PUT"],
    pattern: '/api/products/:id',
    tokens: [{"old":"/api/products/:id","type":0,"val":"api","end":""},{"old":"/api/products/:id","type":0,"val":"products","end":""},{"old":"/api/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.update']['types'],
  },
  'products.destroy': {
    methods: ["DELETE"],
    pattern: '/api/products/:id',
    tokens: [{"old":"/api/products/:id","type":0,"val":"api","end":""},{"old":"/api/products/:id","type":0,"val":"products","end":""},{"old":"/api/products/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['products.destroy']['types'],
  },
  'bills.store': {
    methods: ["POST"],
    pattern: '/api/bills',
    tokens: [{"old":"/api/bills","type":0,"val":"api","end":""},{"old":"/api/bills","type":0,"val":"bills","end":""}],
    types: placeholder as Registry['bills.store']['types'],
  },
  'bills.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/bills',
    tokens: [{"old":"/api/bills","type":0,"val":"api","end":""},{"old":"/api/bills","type":0,"val":"bills","end":""}],
    types: placeholder as Registry['bills.index']['types'],
  },
  'bills.show': {
    methods: ["GET","HEAD"],
    pattern: '/api/bills/:id',
    tokens: [{"old":"/api/bills/:id","type":0,"val":"api","end":""},{"old":"/api/bills/:id","type":0,"val":"bills","end":""},{"old":"/api/bills/:id","type":1,"val":"id","end":""}],
    types: placeholder as Registry['bills.show']['types'],
  },
  'bills.pdf': {
    methods: ["GET","HEAD"],
    pattern: '/api/bills/:id/pdf',
    tokens: [{"old":"/api/bills/:id/pdf","type":0,"val":"api","end":""},{"old":"/api/bills/:id/pdf","type":0,"val":"bills","end":""},{"old":"/api/bills/:id/pdf","type":1,"val":"id","end":""},{"old":"/api/bills/:id/pdf","type":0,"val":"pdf","end":""}],
    types: placeholder as Registry['bills.pdf']['types'],
  },
  'promotions.store': {
    methods: ["POST"],
    pattern: '/api/promotions',
    tokens: [{"old":"/api/promotions","type":0,"val":"api","end":""},{"old":"/api/promotions","type":0,"val":"promotions","end":""}],
    types: placeholder as Registry['promotions.store']['types'],
  },
  'promotions.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/promotions',
    tokens: [{"old":"/api/promotions","type":0,"val":"api","end":""},{"old":"/api/promotions","type":0,"val":"promotions","end":""}],
    types: placeholder as Registry['promotions.index']['types'],
  },
  'orders.store': {
    methods: ["POST"],
    pattern: '/api/orders',
    tokens: [{"old":"/api/orders","type":0,"val":"api","end":""},{"old":"/api/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.store']['types'],
  },
  'orders.index': {
    methods: ["GET","HEAD"],
    pattern: '/api/orders',
    tokens: [{"old":"/api/orders","type":0,"val":"api","end":""},{"old":"/api/orders","type":0,"val":"orders","end":""}],
    types: placeholder as Registry['orders.index']['types'],
  },
} as const satisfies Record<string, AdonisEndpoint>

export { routes }

export const registry = {
  routes,
  $tree: {} as ApiDefinition,
}

declare module '@tuyau/core/types' {
  export interface UserRegistry {
    routes: typeof routes
    $tree: ApiDefinition
  }
}
