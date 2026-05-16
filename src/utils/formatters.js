export function formatCurrency(value, currency = 'USD') {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency,
  }).format(value)
}
