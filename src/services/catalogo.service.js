import { http } from './api/http.js'
import { API_ENDPOINTS } from '../constants/api.js'

export const catalogoService = {
  getAll({ page = 1, perPage = 9, search = '' } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage })
    if (search) params.set('search', search)
    return http.get(`${API_ENDPOINTS.GET_CATALOG}?${params}`)
  },
}
