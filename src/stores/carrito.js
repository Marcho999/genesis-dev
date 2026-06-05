import { defineStore } from 'pinia'

const STORAGE_KEY = 'zap_carrito'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') } catch { return {} }
}

export const useCarritoStore = defineStore('carrito', {
  state: () => ({
    items: load(),
    // { [productoId]: { id, nombre, marca, imagen, precio, precio_con_descuento, cantidad } }
    open:          false,
    checkoutOpen:  false,
  }),

  getters: {
    count:     (state) => Object.values(state.items).reduce((s, i) => s + i.cantidad, 0),
    total:     (state) => Object.values(state.items).reduce((s, i) => s + i.precio_con_descuento * i.cantidad, 0),
    isEmpty:   (state) => Object.keys(state.items).length === 0,
    itemsList: (state) => Object.values(state.items),
  },

  actions: {
    agregar(producto) {
      const id = String(producto.id)
      if (this.items[id]) {
        this.items[id].cantidad++
      } else {
        this.items[id] = {
          id:                  producto.id,
          nombre:              producto.nombre,
          marca:               producto.marca,
          imagen:              producto.imagen,
          precio:              producto.precio,
          precio_con_descuento: producto.precio_con_descuento ?? producto.precio,
          cantidad:            1,
        }
      }
      this._persist()
    },

    incrementar(id) {
      if (this.items[id]) { this.items[id].cantidad++; this._persist() }
    },

    disminuir(id) {
      if (!this.items[id]) return
      this.items[id].cantidad--
      if (this.items[id].cantidad <= 0) this.quitar(id)
      else this._persist()
    },

    quitar(id) {
      delete this.items[id]
      this._persist()
    },

    vaciar() {
      this.items = {}
      this._persist()
    },

    togglePanel()   { this.open = !this.open },
    openCheckout()  { this.open = true; this.checkoutOpen = true },
    closeCheckout() { this.checkoutOpen = false },

    _persist() { localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items)) },
  },
})
