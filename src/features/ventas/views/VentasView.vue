<script setup>
import { ref, onMounted } from 'vue'
import { useVentasStore } from '../../../stores/ventas.js'
import { useNotificationsStore } from '../../../stores/notifications.js'
import AppButton from '../../../components/base/AppButton.vue'
import AppBadge from '../../../components/base/AppBadge.vue'
import AppPagination from '../../../components/base/AppPagination.vue'
import { formatCurrency, formatDate, formatNumber } from '../../../utils/formatters.js'

const store = useVentasStore()
const notif = useNotificationsStore()
const expanded = ref(new Set())

onMounted(() => store.fetchAll())

function toggleExpand(id) {
  expanded.value.has(id) ? expanded.value.delete(id) : expanded.value.add(id)
}

async function clearHistory() {
  if (!confirm('¿Eliminar TODO el historial de ventas? Esta acción es irreversible.')) return
  try {
    await store.destroyHistory()
    notif.success('Historial eliminado')
  } catch {
    notif.error('No se pudo eliminar el historial')
  }
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Pedidos</h1>
        <p class="page-sub">Historial completo de ventas y estadísticas.</p>
      </div>
      <AppButton variant="danger" @click="clearHistory">Eliminar historial</AppButton>
    </div>

    <!-- Stats -->
    <div class="stats-grid">
      <div class="stat-card">
        <p class="stat-label">Total vendido</p>
        <p class="stat-value">{{ formatCurrency(store.stats.totalVendido) }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Pedidos registrados</p>
        <p class="stat-value">{{ formatNumber(store.stats.totalPedidos) }}</p>
      </div>
      <div class="stat-card">
        <p class="stat-label">Productos vendidos</p>
        <p class="stat-value">{{ formatNumber(store.stats.totalProductos) }}</p>
      </div>
    </div>

    <!-- Listado de ventas -->
    <div v-if="store.loading" class="skeleton-list">
      <div v-for="n in 4" :key="n" class="skeleton-venta" />
    </div>

    <div v-else-if="store.items.length === 0" class="empty-state">
      <p>No hay pedidos registrados aún.</p>
    </div>

    <div v-else class="venta-list">
      <div v-for="venta in store.items" :key="venta.id" class="venta-card">
        <!-- Cabecera de la venta -->
        <div class="venta-card__header" @click="toggleExpand(venta.id)">
          <div class="venta-card__meta">
            <span class="venta-card__id"># {{ venta.id }}</span>
            <AppBadge :variant="venta.estado_pago === 'pagado' ? 'success' : 'warning'">
              {{ venta.estado_pago }}
            </AppBadge>
          </div>
          <div class="venta-card__client">
            <strong>{{ venta.nombre_envio ?? venta.user?.name }}</strong>
            <span>{{ venta.user?.email }}</span>
          </div>
          <div class="venta-card__total">{{ formatCurrency(venta.total) }}</div>
          <div class="venta-card__date">{{ formatDate(venta.created_at) }}</div>
          <button class="venta-card__toggle">
            {{ expanded.has(venta.id) ? '▲' : '▼' }}
          </button>
        </div>

        <!-- Detalle expandido -->
        <Transition name="expand">
          <div v-if="expanded.has(venta.id)" class="venta-card__body">
            <div class="venta-detail-grid">
              <div class="detail-group">
                <p class="detail-label">Referencia de pago</p>
                <p class="detail-val">{{ venta.referencia_pago ?? '—' }}</p>
              </div>
              <div class="detail-group">
                <p class="detail-label">Método</p>
                <p class="detail-val">{{ venta.metodo_pago ?? '—' }}</p>
              </div>
              <div class="detail-group">
                <p class="detail-label">Ciudad</p>
                <p class="detail-val">{{ venta.ciudad_envio }}, {{ venta.pais_envio }}</p>
              </div>
              <div class="detail-group">
                <p class="detail-label">Dirección</p>
                <p class="detail-val">{{ venta.direccion_envio }}</p>
              </div>
            </div>

            <!-- Tabla de detalles -->
            <table class="detail-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th class="align-center">Cant.</th>
                  <th class="align-right">P. Unit.</th>
                  <th class="align-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="det in venta.detalles" :key="det.id">
                  <td>{{ det.producto?.nombre }}</td>
                  <td class="align-center">{{ det.cantidad }}</td>
                  <td class="align-right">{{ formatCurrency(det.precio_unitario) }}</td>
                  <td class="align-right">{{ formatCurrency(det.subtotal) }}</td>
                </tr>
              </tbody>
            </table>

            <div class="detail-actions">
              <RouterLink :to="`/ventas/${venta.id}`" class="link-comprobante">
                Ver comprobante →
              </RouterLink>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <AppPagination
      :current-page="store.page"
      :total-pages="store.totalPages"
      :total-items="store.total"
      :per-page="store.perPage"
      @change="store.setPage"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}
.page-title { font-size: 26px; font-weight: 700; }
.page-sub   { color: var(--color-text-muted); margin-top: 4px; font-size: 13px; }

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 28px;
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 20px 24px;
}

.stat-label { font-size: 12px; color: var(--color-text-muted); font-weight: 600; letter-spacing: 0.4px; text-transform: uppercase; }
.stat-value { font-size: 28px; font-weight: 800; color: var(--color-primary); margin-top: 6px; }

/* Venta cards */
.venta-list { display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px; }

.venta-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.venta-card__header {
  display: grid;
  grid-template-columns: 140px 1fr auto auto 36px;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  cursor: pointer;
  transition: background 0.15s;
}
.venta-card__header:hover { background: var(--color-surface-hover); }

.venta-card__meta  { display: flex; align-items: center; gap: 10px; }
.venta-card__id    { font-size: 13px; font-weight: 700; color: var(--color-text-muted); }
.venta-card__client { display: flex; flex-direction: column; gap: 2px; }
.venta-card__client strong { font-size: 14px; font-weight: 600; }
.venta-card__client span   { font-size: 12px; color: var(--color-text-muted); }
.venta-card__total { font-size: 16px; font-weight: 700; color: var(--color-primary); }
.venta-card__date  { font-size: 12.5px; color: var(--color-text-muted); }
.venta-card__toggle { background: none; border: none; color: var(--color-text-muted); font-size: 11px; cursor: pointer; }

.venta-card__body {
  border-top: 1px solid var(--color-border);
  padding: 20px;
}

.venta-detail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.detail-group { display: flex; flex-direction: column; gap: 3px; }
.detail-label { font-size: 11px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.4px; }
.detail-val   { font-size: 13.5px; }

.detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  margin-bottom: 14px;
}
.detail-table th {
  padding: 8px 12px;
  background: var(--color-bg);
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border);
}
.detail-table td { padding: 10px 12px; border-bottom: 1px solid var(--color-border); }
.detail-table tr:last-child td { border-bottom: none; }
.align-center { text-align: center; }
.align-right  { text-align: right; }

.detail-actions { text-align: right; }
.link-comprobante { font-size: 13px; color: var(--color-primary); font-weight: 600; }
.link-comprobante:hover { text-decoration: underline; }

/* Skeletons */
.skeleton-list { display: flex; flex-direction: column; gap: 10px; }
.skeleton-venta {
  height: 70px;
  border-radius: var(--radius-lg);
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}

.empty-state { text-align: center; padding: 60px; color: var(--color-text-muted); }

/* Transition expand */
.expand-enter-active, .expand-leave-active { transition: opacity 0.2s; }
.expand-enter-from, .expand-leave-to { opacity: 0; }

@keyframes shimmer { to { background-position: -200% 0; } }

@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
  .venta-card__header { grid-template-columns: 1fr auto; }
  .venta-detail-grid { grid-template-columns: 1fr 1fr; }
}
</style>
