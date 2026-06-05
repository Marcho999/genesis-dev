import { defineStore } from 'pinia'
import { productosService } from '../services/productos.service.js'

export const useProductosStore = defineStore('productos', {
  state: () => ({
    items:      [],
    total:      0,
    page:       1,
    perPage:    10,
    search:     '',
    loading:    false,
    saving:     false,
    error:      null,
  }),

  getters: {
    totalPages: (state) => Math.ceil(state.total / state.perPage),
  },

  actions: {
    async fetchAll() {
      this.loading = true
      this.error   = null
      try {
        const res = await productosService.getAll({
          page:    this.page,
          perPage: this.perPage,
          search:  this.search,
        })
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
        await productosService.create(payload)
        await this.fetchAll()
      } finally {
        this.saving = false
      }
    },

    async update(id, payload) {
      this.saving = true
      try {
        await productosService.update(id, payload)
        await this.fetchAll()
      } finally {
        this.saving = false
      }
    },

    async remove(id) {
      await productosService.remove(id)
      await this.fetchAll()
    },

    setPage(page)     { this.page = page;   this.fetchAll() },
    setSearch(query)  { this.search = query; this.page = 1; this.fetchAll() },
  },
})
