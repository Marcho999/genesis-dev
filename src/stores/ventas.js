import { defineStore } from 'pinia'
import { ventasService } from '../services/ventas.service.js'

export const useVentasStore = defineStore('ventas', {
  state: () => ({
    items:   [],
    total:   0,
    page:    1,
    perPage: 10,
    stats:   { totalVendido: 0, totalPedidos: 0, totalProductos: 0 },
    current: null,
    loading: false,
    saving:  false,
    error:   null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error   = null
      try {
        const res = await ventasService.getAll({ page: this.page, perPage: this.perPage })
        this.items = res.data
        this.total = res.total
        this.stats = res.stats ?? this.stats
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async fetchOne(id) {
      this.loading = true
      try {
        this.current = await ventasService.getOne(id)
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async checkout(payload) {
      this.saving = true
      this.error  = null
      try {
        return await ventasService.create(payload)
      } catch (err) {
        this.error = err.message
        throw err
      } finally {
        this.saving = false
      }
    },

    async destroyHistory() {
      await ventasService.destroyHistory()
      await this.fetchAll()
    },

    setPage(page) { this.page = page; this.fetchAll() },
  },
})
