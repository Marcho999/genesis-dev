import { http } from './api/http.js'
import { API_ENDPOINTS } from '../constants/api.js'

export const productosService = {
  getAll({ page = 1, perPage = 10, search = '' } = {}) {
    const params = new URLSearchParams({ page, per_page: perPage })
    if (search) params.set('search', search)
    return http.get(`${API_ENDPOINTS.GET_PRODUCTS}?${params}`)
  },

  getOne(id)          { return http.get(API_ENDPOINTS.GET_PRODUCT(id)) },
  create(data)        { return http.post(API_ENDPOINTS.CREATE_PRODUCT, data) },
  update(id, data)    { return http.put(API_ENDPOINTS.UPDATE_PRODUCT(id), data) },
  remove(id)          { return http.delete(API_ENDPOINTS.DELETE_PRODUCT(id)) },
  exportPdf()         { return `${import.meta.env.VITE_API_BASE_URL ?? ''}${API_ENDPOINTS.EXPORT_CATALOG_PDF}` },
}
