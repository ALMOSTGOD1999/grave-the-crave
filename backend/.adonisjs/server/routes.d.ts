import '@adonisjs/core/types/http'

type ParamValue = string | number | bigint | boolean

export type ScannedRoutes = {
  ALL: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.admin_login': { paramsTuple?: []; params?: {} }
    'auth.me': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'products.suggest': { paramsTuple?: []; params?: {} }
    'products.low_stock': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bills.store': { paramsTuple?: []; params?: {} }
    'bills.index': { paramsTuple?: []; params?: {} }
    'bills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bills.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'promotions.store': { paramsTuple?: []; params?: {} }
    'promotions.index': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
    'orders.index': { paramsTuple?: []; params?: {} }
  }
  GET: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'products.suggest': { paramsTuple?: []; params?: {} }
    'products.low_stock': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'bills.index': { paramsTuple?: []; params?: {} }
    'bills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bills.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'promotions.index': { paramsTuple?: []; params?: {} }
    'orders.index': { paramsTuple?: []; params?: {} }
  }
  HEAD: {
    'auth.me': { paramsTuple?: []; params?: {} }
    'products.suggest': { paramsTuple?: []; params?: {} }
    'products.low_stock': { paramsTuple?: []; params?: {} }
    'products.index': { paramsTuple?: []; params?: {} }
    'bills.index': { paramsTuple?: []; params?: {} }
    'bills.show': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'bills.pdf': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
    'promotions.index': { paramsTuple?: []; params?: {} }
    'orders.index': { paramsTuple?: []; params?: {} }
  }
  POST: {
    'auth.register': { paramsTuple?: []; params?: {} }
    'auth.login': { paramsTuple?: []; params?: {} }
    'auth.admin_login': { paramsTuple?: []; params?: {} }
    'auth.logout': { paramsTuple?: []; params?: {} }
    'products.store': { paramsTuple?: []; params?: {} }
    'bills.store': { paramsTuple?: []; params?: {} }
    'promotions.store': { paramsTuple?: []; params?: {} }
    'orders.store': { paramsTuple?: []; params?: {} }
  }
  PUT: {
    'products.update': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
  DELETE: {
    'products.destroy': { paramsTuple: [ParamValue]; params: {'id': ParamValue} }
  }
}
declare module '@adonisjs/core/types/http' {
  export interface RoutesList extends ScannedRoutes {}
}