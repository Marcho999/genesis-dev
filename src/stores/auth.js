import { defineStore } from 'pinia'
import { authService } from '../services/auth.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:    JSON.parse(localStorage.getItem('zap_user') || 'null'),
    token:   localStorage.getItem('zap_token') || null,
    loading: false,
    error:   null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin:  (state) => state.user?.role === 'admin',
    isNormal: (state) => state.user?.role === 'normal',
  },

  actions: {
    async login(credentials) {
      this.loading = true
      this.error   = null
      try {
        const { user, token } = await authService.login(credentials)
        this.user  = user
        this.token = token
        localStorage.setItem('zap_token', token)
        localStorage.setItem('zap_user', JSON.stringify(user))
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try { await authService.logout() } catch {}
      this.user  = null
      this.token = null
      localStorage.removeItem('zap_token')
      localStorage.removeItem('zap_user')
    },
  },
})
