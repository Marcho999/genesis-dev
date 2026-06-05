export const APP_NAME    = 'GENESIS'
export const APP_TAGLINE = 'Calzado urbano'

// Navegación por rol
export const NAV_ADMIN = [
  { label: 'Productos',     to: '/productos' },
  { label: 'Catálogo',      to: '/catalogo' },
  { label: 'Promociones',   to: '/promociones' },
  { label: 'Pedidos',       to: '/ventas' },
]

export const NAV_PUBLIC = [
  { label: 'Catálogo', to: '/catalogo' },
]

export const PRODUCT_CATEGORIES = [
  'Zapato',
  'Deportivas',
  'Zapatillas',
  'Sandalias',
  'Botas',
]

export const PRODUCT_BRANDS = [
  'Nike',
  'Adidas',
  'Jordan',
  'Asics',
  'Puma',
  'New Balance',
  'Converse',
  'Vans',
]

export const PAYMENT_METHODS = [
  { value: 'nequi',         label: 'Nequi',          available: true },
  { value: 'daviplata',     label: 'Daviplata',       available: false },
  { value: 'tarjeta',       label: 'Tarjeta crédito', available: false },
  { value: 'transferencia', label: 'Transferencia',   available: false },
]
