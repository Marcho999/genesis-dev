import { http } from './api/http.js'
import { API_ENDPOINTS } from '../constants/api.js'

export const authService = {
  async login(credentials) {
    return http.post(API_ENDPOINTS.LOGIN, credentials)
  },

  async logout() {
    return http.post(API_ENDPOINTS.LOGOUT)
  },
}
