import { http } from './api/http.js'
import { API_ENDPOINTS } from '../constants/api.js'

export const promocionesService = {
  getAll({ page = 1, perPage = 10 } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage })
    return http.get(`${API_ENDPOINTS.GET_PROMOTIONS}?${params}`)
  },

  create(data)     { return http.post(API_ENDPOINTS.CREATE_PROMOTION, data) },
  update(id, data) { return http.put(API_ENDPOINTS.UPDATE_PROMOTION(id), data) },
  remove(id)       { return http.delete(API_ENDPOINTS.DELETE_PROMOTION(id)) },
}
