import { ref, reactive } from 'vue'
import { apiRequest } from '../services/api/http'

/**
 * Composable para manejar llamadas a APIs
 * @param {string} url - Ruta de la API
 * @returns {object} { data, loading, error, fetch }
 */
export function useFetch(url) {
  const data = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const fetch = async (options = {}) => {
    loading.value = true
    error.value = null
    try {
      data.value = await apiRequest(url, options)
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  return { data, loading, error, fetch }
}
