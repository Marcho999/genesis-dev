// --- MOCK TEMPORAL ---
// Reemplazar el cuerpo de login/logout por las líneas comentadas
// cuando el backend de pgAdmin esté conectado.
// import { http } from './api/http.js'
// import { API_ENDPOINTS } from '../constants/api.js'

const MOCK_USERS = {
  admin:  { id: 1, name: 'Administrador', email: 'admin@genesis.com',  role: 'admin'  },
  normal: { id: 2, name: 'Cliente',        email: 'cliente@genesis.com', role: 'normal' },
}

export const authService = {
  async login({ role }) {
    // return http.post(API_ENDPOINTS.LOGIN, credentials)
    return {
      user:  MOCK_USERS[role] ?? MOCK_USERS.normal,
      token: `mock-${role}-${Date.now()}`,
    }
  },

  async logout() {
    // return http.post(API_ENDPOINTS.LOGOUT)
  },
}
