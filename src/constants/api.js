export const API_ENDPOINTS = {
  // Auth
  LOGIN:  '/api/auth/login',
  LOGOUT: '/api/auth/logout',

  // Productos (admin CRUD)
  GET_PRODUCTS:    '/api/productos',
  GET_PRODUCT:     (id) => `/api/productos/${id}`,
  CREATE_PRODUCT:  '/api/productos',
  UPDATE_PRODUCT:  (id) => `/api/productos/${id}`,
  DELETE_PRODUCT:  (id) => `/api/productos/${id}`,
  EXPORT_CATALOG_PDF: '/api/productos-pdf',

  // Catálogo (público)
  GET_CATALOG: '/api/catalogo',

  // Promociones (admin CRUD)
  GET_PROMOTIONS:    '/api/promociones',
  CREATE_PROMOTION:  '/api/promociones',
  UPDATE_PROMOTION:  (id) => `/api/promociones/${id}`,
  DELETE_PROMOTION:  (id) => `/api/promociones/${id}`,

  // Ventas
  GET_SALES:            '/api/ventas',
  GET_SALE:             (id) => `/api/ventas/${id}`,
  CREATE_SALE:          '/api/ventas',
  DESTROY_SALES_HISTORY: '/api/ventas/historial',
}

export const HTTP_STATUS = {
  OK:                    200,
  CREATED:               201,
  UNAUTHORIZED:          401,
  FORBIDDEN:             403,
  NOT_FOUND:             404,
  UNPROCESSABLE_ENTITY:  422,
  INTERNAL_SERVER_ERROR: 500,
}
