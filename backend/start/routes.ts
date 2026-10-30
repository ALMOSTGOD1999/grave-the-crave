/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| API contract (all responses JSON, auth via `Authorization: Bearer <token>`):
|   POST   /api/auth/register      customer sign-up
|   POST   /api/auth/login         customer login
|   POST   /api/auth/admin/login   seeded admin login
|   GET    /api/auth/me            current user (auth)
|   POST   /api/auth/logout        revoke token (auth)
|   GET    /api/products           list (admin)
|   GET    /api/products/suggest   billing autocomplete (admin)
|   GET    /api/products/low-stock low stock view (admin)
|   POST   /api/products           create (admin)
|   PUT    /api/products/:id       partial update (admin)
|   DELETE /api/products/:id       delete (admin)
|   POST   /api/bills              create bill + stock decrement (admin)
|   GET    /api/bills              bill history (admin)
|   GET    /api/bills/:id          bill with items (admin)
|   GET    /api/bills/:id/pdf      invoice PDF download (admin)
|   GET    /api/customers          customer directory (admin)
|   POST   /api/promotions         send campaign (admin)
|   GET    /api/promotions         sent history (admin)
|   POST   /api/orders             place order (auth)
|   GET    /api/orders             own order history (auth)
*/

import { middleware } from '#start/kernel'
import router from '@adonisjs/core/services/router'

const Auth = () => import('#controllers/auth_controller')
const Products = () => import('#controllers/products_controller')
const Bills = () => import('#controllers/bills_controller')
const Customers = () => import('#controllers/customers_controller')
const Orders = () => import('#controllers/orders_controller')
const Promotions = () => import('#controllers/promotions_controller')

router.get('/', () => {
  return { hello: 'world' }
})

router
  .group(() => {
    router.post('register', [Auth, 'register'])
    router.post('login', [Auth, 'login'])
    router.post('admin/login', [Auth, 'adminLogin'])
    router.get('me', [Auth, 'me']).use(middleware.auth())
    router.post('logout', [Auth, 'logout']).use(middleware.auth())
  })
  .prefix('/api/auth')

router
  .group(() => {
    router.get('products/suggest', [Products, 'suggest'])
    router.get('products/low-stock', [Products, 'lowStock'])
    router.get('products', [Products, 'index'])
    router.post('products', [Products, 'store'])
    router.put('products/:id', [Products, 'update'])
    router.delete('products/:id', [Products, 'destroy'])

    router.post('bills', [Bills, 'store'])
    router.get('bills', [Bills, 'index'])
    router.get('bills/:id', [Bills, 'show'])
    router.get('bills/:id/pdf', [Bills, 'pdf'])

    router.get('customers', [Customers, 'index'])

    router.post('promotions', [Promotions, 'store'])
    router.get('promotions', [Promotions, 'index'])
  })
  .prefix('/api')
  .use(middleware.admin())

router
  .group(() => {
    router.post('orders', [Orders, 'store'])
    router.get('orders', [Orders, 'index'])
  })
  .prefix('/api')
  .use(middleware.auth())
