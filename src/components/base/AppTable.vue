<script setup>
defineProps({
  columns: { type: Array, required: true },
  // [{ key: String, label: String, align?: 'left'|'right'|'center', width?: String }]
  rows:    { type: Array, default: () => [] },
  loading: { type: Boolean, default: false },
  rowKey:  { type: String, default: 'id' },
})
</script>

<template>
  <div class="table-wrap">
    <table class="table">
      <thead>
        <tr>
          <th
            v-for="col in columns"
            :key="col.key"
            :style="col.width ? { width: col.width } : {}"
            :class="`align-${col.align ?? 'left'}`"
          >
            {{ col.label }}
          </th>
          <th v-if="$slots.actions" class="align-right" style="width:140px">Acciones</th>
        </tr>
      </thead>

      <tbody>
        <!-- Loading skeleton -->
        <template v-if="loading">
          <tr v-for="n in 5" :key="n" class="row-skeleton">
            <td v-for="col in columns" :key="col.key">
              <span class="skeleton" />
            </td>
            <td v-if="$slots.actions"><span class="skeleton skeleton--short" /></td>
          </tr>
        </template>

        <!-- Empty state -->
        <tr v-else-if="rows.length === 0">
          <td :colspan="columns.length + ($slots.actions ? 1 : 0)" class="empty-cell">
            <slot name="empty">
              <span class="empty-text">Sin registros para mostrar</span>
            </slot>
          </td>
        </tr>

        <!-- Data rows -->
        <tr v-else v-for="row in rows" :key="row[rowKey]" class="data-row">
          <td
            v-for="col in columns"
            :key="col.key"
            :class="`align-${col.align ?? 'left'}`"
          >
            <slot :name="`cell-${col.key}`" :value="row[col.key]" :row="row">
              {{ row[col.key] ?? '—' }}
            </slot>
          </td>
          <td v-if="$slots.actions" class="align-right">
            <div class="actions-cell">
              <slot name="actions" :row="row" />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.table-wrap {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}

thead tr {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

th {
  padding: 12px 16px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.4px;
  text-transform: uppercase;
  white-space: nowrap;
}

.data-row {
  border-bottom: 1px solid var(--color-border);
  transition: background 0.1s;
}
.data-row:last-child { border-bottom: none; }
.data-row:hover { background: var(--color-surface-hover); }

td {
  padding: 13px 16px;
  color: var(--color-text);
  vertical-align: middle;
}

/* Alignment */
.align-left   { text-align: left; }
.align-right  { text-align: right; }
.align-center { text-align: center; }

.actions-cell {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

/* Empty */
.empty-cell { text-align: center; padding: 48px 16px; }
.empty-text { color: var(--color-text-muted); font-size: 13px; }

/* Skeleton */
.skeleton {
  display: block;
  height: 14px;
  border-radius: 4px;
  background: linear-gradient(90deg, var(--color-surface-hover) 25%, var(--color-border) 50%, var(--color-surface-hover) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
  width: 75%;
}
.skeleton--short { width: 60px; }

@keyframes shimmer { to { background-position: -200% 0; } }
</style>
