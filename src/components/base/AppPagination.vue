<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage:  { type: Number, required: true },
  totalPages:   { type: Number, required: true },
  totalItems:   { type: Number, default: 0 },
  perPage:      { type: Number, default: 10 },
})

const emit = defineEmits(['change'])

const pages = computed(() => {
  const total = props.totalPages
  const current = props.currentPage
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set([1, 2, current - 1, current, current + 1, total - 1, total])
  return [...pages]
    .filter(p => p >= 1 && p <= total)
    .sort((a, b) => a - b)
    .reduce((acc, page, i, arr) => {
      if (i > 0 && arr[i - 1] !== page - 1) acc.push('...')
      acc.push(page)
      return acc
    }, [])
})

const from = computed(() => (props.currentPage - 1) * props.perPage + 1)
const to = computed(() => Math.min(props.currentPage * props.perPage, props.totalItems))
</script>

<template>
  <div v-if="totalPages > 1" class="pagination">
    <span class="pagination__info">
      {{ from }}–{{ to }} de {{ totalItems }}
    </span>

    <div class="pagination__controls">
      <button
        class="pg-btn"
        :disabled="currentPage <= 1"
        @click="$emit('change', currentPage - 1)"
      >‹</button>

      <template v-for="(page, i) in pages" :key="i">
        <span v-if="page === '...'" class="pg-ellipsis">…</span>
        <button
          v-else
          class="pg-btn"
          :class="{ 'pg-btn--active': page === currentPage }"
          @click="$emit('change', page)"
        >{{ page }}</button>
      </template>

      <button
        class="pg-btn"
        :disabled="currentPage >= totalPages"
        @click="$emit('change', currentPage + 1)"
      >›</button>
    </div>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  font-size: 12.5px;
  color: var(--color-text-muted);
  border-top: 1px solid var(--color-border);
}

.pagination__controls { display: flex; align-items: center; gap: 4px; }

.pg-btn {
  min-width: 30px;
  height: 30px;
  padding: 0 6px;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
}
.pg-btn:not(:disabled):hover { background: var(--color-surface-hover); color: var(--color-text); }
.pg-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.pg-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.pg-ellipsis { padding: 0 4px; color: var(--color-text-muted); }
</style>
