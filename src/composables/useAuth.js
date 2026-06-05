import { ref } from 'vue'

/**
 * Composable para manejar autenticación
 */
export function useAuth() {
  const user = ref(null)
  const isAuthenticated = ref(false)

  const login = async (email, password) => {
    // Implementar lógica de login
    // const response = await apiRequest('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    // user.value = response.user
    // isAuthenticated.value = true
  }

  const logout = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('token')
  }

  const checkAuth = () => {
    const token = localStorage.getItem('token')
    isAuthenticated.value = !!token
  }

  return { user, isAuthenticated, login, logout, checkAuth }
}
