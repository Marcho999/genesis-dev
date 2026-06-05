import { defineStore } from 'pinia'
import { promocionesService } from '../services/promociones.service.js'

export const usePromocionesStore = defineStore('promociones', {
  state: () => ({
    items:   [],
    total:   0,
    page:    1,
    perPage: 10,
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
        const res = await promocionesService.getAll({ page: this.page, perPage: this.perPage })
        this.items = res.data
        this.total = res.total
      } catch (err) {
        this.error = err.message
      } finally {
        this.loading = false
      }
    },

    async create(payload) {
      this.saving = true
      try {
        await promocionesService.create(payload)
        await this.fetchAll()
      } finally {
        this.saving = false
      }
    },

    async update(id, payload) {
      this.saving = true
      try {
        await promocionesService.update(id, payload)
        await this.fetchAll()
      } finally {
        this.saving = false
      }
    },

    async remove(id) {
      await promocionesService.remove(id)
      await this.fetchAll()
    },

    setPage(page) { this.page = page; this.fetchAll() },
  },
})
