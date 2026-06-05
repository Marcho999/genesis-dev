import { useAuthStore } from '../stores/auth.js'

export function authGuard(to) {
  const auth = useAuthStore()

  // Ruta requiere admin
  if (to.meta.requiresAdmin) {
    if (!auth.isAuthenticated) return { name: 'login' }
    if (!auth.isAdmin) return { name: 'catalogo' }
  }

  // Ya autenticado intentando ir al login
  if (to.name === 'login' && auth.isAuthenticated) {
    return auth.isAdmin ? { name: 'productos' } : { name: 'catalogo' }
  }
}
