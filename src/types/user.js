/**
 * Tipos/Modelos de Usuario
 * Aquí defines la estructura de datos esperada
 */

/**
 * @typedef {Object} User
 * @property {string} id - ID único del usuario
 * @property {string} name - Nombre completo
 * @property {string} email - Correo electrónico
 * @property {string} avatar - URL del avatar
 * @property {string} role - Rol del usuario (admin, user, guest)
 * @property {Date} createdAt - Fecha de creación
 */

export const userModel = {
  id: '',
  name: '',
  email: '',
  avatar: '',
  role: 'user',
  createdAt: new Date(),
}

export function createUser(data = {}) {
  return {
    ...userModel,
    ...data,
  }
}

export function validateUserData(user) {
  const errors = []
  if (!user.name?.trim()) errors.push('El nombre es requerido')
  if (!user.email?.trim()) errors.push('El email es requerido')
  if (user.email && !user.email.includes('@')) errors.push('Email inválido')
  return { isValid: errors.length === 0, errors }
}
