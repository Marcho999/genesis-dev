/**
 * Validadores que retornan `null` si es válido o un string con el error.
 * Úsalos en formularios: const err = required(value) ?? isEmail(value)
 */

export const required = (value) =>
  value !== null && value !== undefined && String(value).trim() !== ''
    ? null
    : 'Este campo es obligatorio'

export const minLength = (min) => (value) =>
  !value || String(value).length >= min
    ? null
    : `Mínimo ${min} caracteres`

export const maxLength = (max) => (value) =>
  !value || String(value).length <= max
    ? null
    : `Máximo ${max} caracteres`

export const isEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
    ? null
    : 'Ingresa un email válido'

export const isPositive = (value) =>
  Number(value) >= 0
    ? null
    : 'Debe ser un número positivo'

export const isInteger = (value) =>
  Number.isInteger(Number(value))
    ? null
    : 'Debe ser un número entero'

export const between = (min, max) => (value) =>
  Number(value) >= min && Number(value) <= max
    ? null
    : `Debe estar entre ${min} y ${max}`

/**
 * Ejecuta un array de validadores sobre un valor y retorna el primer error.
 * Ej: validate(value, [required, isEmail])
 */
export function validate(value, fns) {
  for (const fn of fns) {
    const err = fn(value)
    if (err) return err
  }
  return null
}
