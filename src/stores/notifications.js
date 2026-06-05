import { defineStore } from 'pinia'

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    items: [],
  }),

  actions: {
    push(type, message, duration = 4000) {
      const id = Date.now() + Math.random()
      this.items.push({ id, type, message })
      if (duration > 0) setTimeout(() => this.remove(id), duration)
    },

    success(message) { this.push('success', message) },
    error(message)   { this.push('error',   message) },
    info(message)    { this.push('info',    message) },

    remove(id) {
      this.items = this.items.filter(n => n.id !== id)
    },
  },
})
