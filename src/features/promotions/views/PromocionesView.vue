<script setup>
import { onMounted, ref } from 'vue'
import { usePromocionesStore } from '../../../stores/promociones.js'
import { useNotificationsStore } from '../../../stores/notifications.js'
import AppTable from '../../../components/base/AppTable.vue'
import AppButton from '../../../components/base/AppButton.vue'
import AppBadge from '../../../components/base/AppBadge.vue'
import AppPagination from '../../../components/base/AppPagination.vue'
import PromocionFormModal from '../components/PromocionFormModal.vue'
import { formatDate, formatPercent } from '../../../utils/formatters.js'

const store = usePromocionesStore()
const notif = useNotificationsStore()

const modalOpen   = ref(false)
const editTarget  = ref(null)

const columns = [
  { key: 'producto',     label: 'Producto' },
  { key: 'descuento',    label: 'Descuento', align: 'center' },
  { key: 'fecha_inicio', label: 'Inicio' },
  { key: 'fecha_fin',    label: 'Fin' },
  { key: 'activa',       label: 'Estado', align: 'center' },
]

onMounted(() => store.fetchAll())

function openCreate() { editTarget.value = null; modalOpen.value = true }
function openEdit(row) { editTarget.value = row; modalOpen.value = true }
function closeModal() { modalOpen.value = false; editTarget.value = null }

async function handleSubmit(data) {
  try {
    if (editTarget.value) {
      await store.update(editTarget.value.id, data)
      notif.success('Promoción actualizada')
    } else {
      await store.create(data)
      notif.success('Promoción creada')
    }
    closeModal()
  } catch {
    notif.error('Error al guardar la promoción')
  }
}

async function handleDelete(row) {
  if (!confirm(`¿Eliminar esta promoción del producto "${row.producto?.nombre}"?`)) return
  try {
    await store.remove(row.id)
    notif.success('Promoción eliminada')
  } catch {
    notif.error('No se pudo eliminar')
  }
}

function isPromoActiva(row) {
  const hoy = new Date().toISOString().split('T')[0]
  return row.activa && row.fecha_inicio <= hoy && row.fecha_fin >= hoy
}
</script>

<template>
  <div>
    <div class="page-header">
      <div>
        <h1 class="page-title">Promociones</h1>
        <p class="page-sub">Gestiona los descuentos activos en tu catálogo.</p>
      </div>
      <AppButton @click="openCreate">+ Nueva promoción</AppButton>
    </div>

    <AppTable :columns="columns" :rows="store.items" :loading="store.loading">
      <template #cell-producto="{ row }">
        <div class="product-cell">
          <strong>{{ row.producto?.nombre ?? '—' }}</strong>
          <span>{{ row.producto?.marca }}</span>
        </div>
      </template>

      <template #cell-descuento="{ value }">
        <AppBadge variant="primary">{{ formatPercent(value) }}</AppBadge>
      </template>

      <template #cell-fecha_inicio="{ value }">{{ formatDate(value) }}</template>
      <template #cell-fecha_fin="{ value }">{{ formatDate(value) }}</template>

      <template #cell-activa="{ row }">
        <AppBadge :variant="isPromoActiva(row) ? 'success' : 'neutral'">
          {{ isPromoActiva(row) ? 'Activa' : 'Finalizada' }}
        </AppBadge>
      </template>

      <template #actions="{ row }">
        <AppButton size="sm" variant="outline" @click="openEdit(row)">Editar</AppButton>
        <AppButton size="sm" variant="danger"  @click="handleDelete(row)">Eliminar</AppButton>
      </template>
    </AppTable>

    <AppPagination
      :current-page="store.page"
      :total-pages="store.totalPages"
      :total-items="store.total"
      :per-page="store.perPage"
      @change="store.setPage"
    />

    <PromocionFormModal
      :open="modalOpen"
      :promocion="editTarget"
      :saving="store.saving"
      @close="closeModal"
      @submit="handleSubmit"
    />
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}
.page-title { font-size: 26px; font-weight: 700; }
.page-sub   { color: var(--color-text-muted); margin-top: 4px; font-size: 13px; }

.product-cell { display: flex; flex-direction: column; gap: 2px; }
.product-cell strong { font-size: 14px; }
.product-cell span   { font-size: 12px; color: var(--color-text-muted); }
</style>
