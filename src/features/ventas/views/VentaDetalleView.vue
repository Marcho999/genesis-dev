<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVentasStore } from '../../../stores/ventas.js'
import AppButton from '../../../components/base/AppButton.vue'
import AppBadge from '../../../components/base/AppBadge.vue'
import { formatCurrency, formatDate } from '../../../utils/formatters.js'

const route  = useRoute()
const router = useRouter()
const store  = useVentasStore()

onMounted(() => store.fetchOne(route.params.id))
</script>

<template>
  <div class="comprobante-wrap">
    <!-- Loading -->
    <div v-if="store.loading" class="comprobante-skeleton" />

    <!-- Error -->
    <div v-else-if="!store.current" class="comprobante-error">
      <p>No se encontró el pedido.</p>
      <AppButton variant="outline" @click="router.push('/catalogo')">Volver al catálogo</AppButton>
    </div>

    <!-- Comprobante -->
    <div v-else class="comprobante">
      <!-- Encabezado -->
      <div class="comp-header">
        <div class="comp-brand">
          <span class="brand-icon">G</span>
          <div>
            <p class="brand-name">GENESIS</p>
            <p class="brand-tag">Calzado urbano</p>
          </div>
        </div>
        <div class="comp-meta">
          <p class="comp-order">Pedido <strong>#{{ store.current.id }}</strong></p>
          <p class="comp-date">{{ formatDate(store.current.created_at) }}</p>
          <AppBadge :variant="store.current.estado_pago === 'pagado' ? 'success' : 'warning'">
            {{ store.current.estado_pago }}
          </AppBadge>
        </div>
      </div>

      <!-- Total destacado -->
      <div class="comp-total-hero">
        <p class="comp-total-label">Total a pagar</p>
        <p class="comp-total-val">{{ formatCurrency(store.current.total) }}</p>
      </div>

      <!-- Dos columnas: envío + pago -->
      <div class="comp-detail-grid">
        <div class="comp-section">
          <h3 class="comp-section-title">Datos de envío</h3>
          <div class="info-row"><span>Nombre</span><strong>{{ store.current.nombre_envio }}</strong></div>
          <div class="info-row"><span>País</span><strong>{{ store.current.pais_envio }}</strong></div>
          <div class="info-row"><span>Ciudad</span><strong>{{ store.current.ciudad_envio }}</strong></div>
          <div class="info-row"><span>Dirección</span><strong>{{ store.current.direccion_envio }}</strong></div>
        </div>
        <div class="comp-section">
          <h3 class="comp-section-title">Pago</h3>
          <div class="info-row"><span>Método</span><strong>{{ store.current.metodo_pago }}</strong></div>
          <div class="info-row"><span>Referencia</span><strong>{{ store.current.referencia_pago ?? '—' }}</strong></div>
        </div>
      </div>

      <!-- Tabla de productos -->
      <div class="comp-section">
        <h3 class="comp-section-title">Productos</h3>
        <table class="comp-table">
          <thead>
            <tr>
              <th>Producto</th>
              <th class="align-center">Cant.</th>
              <th class="align-right">P. Unitario</th>
              <th class="align-right">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="det in store.current.detalles" :key="det.id">
              <td>{{ det.producto?.nombre }}</td>
              <td class="align-center">{{ det.cantidad }}</td>
              <td class="align-right">{{ formatCurrency(det.precio_unitario) }}</td>
              <td class="align-right">{{ formatCurrency(det.subtotal) }}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="align-right total-label">Total</td>
              <td class="align-right total-val">{{ formatCurrency(store.current.total) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- Acciones -->
      <div class="comp-actions">
        <AppButton variant="outline" @click="router.push('/catalogo')">← Volver al catálogo</AppButton>
        <AppButton variant="ghost" @click="window.print()">Imprimir</AppButton>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comprobante-wrap {
  max-width: 760px;
  margin: 0 auto;
}

.comprobante {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.comp-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 28px 32px;
  border-bottom: 1px solid var(--color-border);
}

.comp-brand { display: flex; align-items: center; gap: 12px; }
.brand-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
}
.brand-name { font-size: 16px; font-weight: 700; }
.brand-tag  { font-size: 12px; color: var(--color-text-muted); }

.comp-meta { text-align: right; display: flex; flex-direction: column; gap: 6px; align-items: flex-end; }
.comp-order { font-size: 14px; color: var(--color-text-muted); }
.comp-date  { font-size: 12px; color: var(--color-text-muted); }

.comp-total-hero {
  padding: 32px;
  text-align: center;
  border-bottom: 1px solid var(--color-border);
  background: rgba(249,115,22,.06);
}
.comp-total-label { font-size: 13px; font-weight: 600; color: var(--color-text-muted); text-transform: uppercase; }
.comp-total-val   { font-size: 40px; font-weight: 800; color: var(--color-primary); margin-top: 4px; }

.comp-detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  border-bottom: 1px solid var(--color-border);
}

.comp-section {
  padding: 24px 32px;
  border-bottom: 1px solid var(--color-border);
}
.comp-detail-grid .comp-section { border-bottom: none; }
.comp-detail-grid .comp-section:first-child { border-right: 1px solid var(--color-border); }

.comp-section-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  font-size: 13.5px;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border);
}
.info-row:last-child { border-bottom: none; }
.info-row span { color: var(--color-text-muted); }

.comp-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13.5px;
}
.comp-table th {
  padding: 10px 0;
  font-size: 11px;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  border-bottom: 1px solid var(--color-border);
}
.comp-table td { padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.comp-table tr:last-child td { border-bottom: none; }

.align-center { text-align: center; }
.align-right  { text-align: right; }

tfoot .total-label { color: var(--color-text-muted); font-size: 13px; font-weight: 600; }
tfoot .total-val   { font-size: 18px; font-weight: 700; color: var(--color-primary); }

.comp-actions {
  display: flex;
  gap: 12px;
  padding: 20px 32px;
  border-top: 1px solid var(--color-border);
}

.comprobante-skeleton {
  height: 500px;
  border-radius: var(--radius-lg);
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.4s infinite;
}
.comprobante-error {
  text-align: center;
  padding: 60px;
  color: var(--color-text-muted);
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
}

@keyframes shimmer { to { background-position: -200% 0; } }

@media (max-width: 600px) {
  .comp-detail-grid { grid-template-columns: 1fr; }
  .comp-detail-grid .comp-section:first-child { border-right: none; border-bottom: 1px solid var(--color-border); }
}
</style>
