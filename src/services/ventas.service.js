import { http } from './api/http.js'
import { API_ENDPOINTS } from '../constants/api.js'

export const ventasService = {
  getAll({ page = 1, perPage = 10 } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage })
    return http.get(`${API_ENDPOINTS.GET_SALES}?${params}`)
  },

  getOne(id)         { return http.get(API_ENDPOINTS.GET_SALE(id)) },
  create(payload)    { return http.post(API_ENDPOINTS.CREATE_SALE, payload) },
  destroyHistory()   { return http.delete(API_ENDPOINTS.DESTROY_SALES_HISTORY) },
}
