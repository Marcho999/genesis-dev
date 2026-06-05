/**
 * Formatea un valor como moneda colombiana (COP).
 * Ej: 150000 → "$150.000"
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value ?? 0)
}

/**
 * Formatea una fecha ISO o Date a formato legible.
 * Ej: "2026-05-03" → "3 may. 2026"
 */
export function formatDate(value) {
  if (!value) return '—'
  return new Date(value).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Ej: 25 → "25%"
 */
export function formatPercent(value) {
  return `${value}%`
}

/**
 * Ej: 1000 → "1.000"
 */
export function formatNumber(value) {
  return new Intl.NumberFormat('es-CO').format(value ?? 0)
}

/**
 * Calcula precio con descuento.
 * Ej: precio=100, descuento=20 → 80
 */
export function applyDiscount(precio, descuento) {
  return Number(precio) * (1 - Number(descuento) / 100)
}
