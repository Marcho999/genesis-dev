<script setup>
import { ref, onMounted } from 'vue'
import { useProductosStore } from '../../../stores/productos.js'
import { useNotificationsStore } from '../../../stores/notifications.js'
import { productosService } from '../../../services/productos.service.js'
import AppTable from '../../../components/base/AppTable.vue'
import AppButton from '../../../components/base/AppButton.vue'
import AppBadge from '../../../components/base/AppBadge.vue'
import AppPagination from '../../../components/base/AppPagination.vue'
import AppInput from '../../../components/base/AppInput.vue'
import ProductoFormModal from '../components/ProductoFormModal.vue'
import { formatCurrency } from '../../../utils/formatters.js'

const store = useProductosStore()
const notif = useNotificationsStore()

const modalOpen   = ref(false)
const editTarget  = ref(null)
const searchQuery = ref('')
let   searchTimer = null

const columns = [
  { key: 'imagen',    label: '',            width: '56px' },
  { key: 'nombre',    label: 'Nombre' },
  { key: 'marca',     label: 'Marca' },
  { key: 'categoria', label: 'Categoría' },
  { key: 'precio',    label: 'Precio',  align: 'right' },
  { key: 'stock',     label: 'Stock',   align: 'center' },
]

onMounted(() => store.fetchAll())

function openCreate() { editTarget.value = null; modalOpen.value = true }
function openEdit(row) { editTarget.value = row; modalOpen.value = true }
function closeModal() { modalOpen.value = false; editTarget.value = null }

async function handleSubmit(data) {
  try {
    if (editTarget.value) {
      await store.update(editTarget.value.id, data)
      notif.success('Producto actualizado')
    } else {
      await store.create(data)
      notif.success('Producto creado')
    }
    closeModal()
  } catch {
    notif.error('Ocurrió un error al guardar')
  }
}

async function handleDelete(row) {
  if (!confirm(`¿Eliminar "${row.nombre}"? Esta acción no se puede deshacer.`)) return
  try {
    await store.remove(row.id)
    notif.success('Producto eliminado')
  } catch {
    notif.error('No se pudo eliminar el producto')
  }
}

function onSearch(q) {
  searchQuery.value = q
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => store.setSearch(q), 350)
}

function downloadPdf() {
  window.open(productosService.exportPdf(), '_blank')
}
</script>

<template>
  <div>
    <!-- Header -->
    <div class="page-header">
      <div>
        <h1 class="page-title">Productos disponibles</h1>
        <p class="page-sub">Consulta, crea y administra el inventario de tus calzados.</p>
      </div>
      <div class="header-actions">
        <AppButton variant="outline" @click="downloadPdf">⬇ Catálogo PDF</AppButton>
        <AppButton @click="openCreate">+ Agregar producto</AppButton>
      </div>
    </div>

    <!-- Búsqueda -->
    <div class="toolbar">
      <AppInput
        :modelValue="searchQuery"
        placeholder="Buscar por nombre o marca..."
        style="max-width:320px"
        @update:modelValue="onSearch"
      />
      <span class="toolbar__count">{{ store.total }} producto{{ store.total !== 1 ? 's' : '' }}</span>
    </div>

    <!-- Tabla -->
    <AppTable :columns="columns" :rows="store.items" :loading="store.loading">
      <template #cell-imagen="{ value }">
        <img v-if="value" :src="value" :alt="value" class="product-thumb" />
        <span v-else class="no-img">📦</span>
      </template>

      <template #cell-precio="{ value }">
        <span class="price">{{ formatCurrency(value) }}</span>
      </template>

      <template #cell-stock="{ value }">
        <AppBadge :variant="value > 10 ? 'success' : value > 0 ? 'warning' : 'danger'">
          {{ value }}
        </AppBadge>
      </template>

      <template #actions="{ row }">
        <AppButton size="sm" variant="outline" @click="openEdit(row)">Editar</AppButton>
        <AppButton size="sm" variant="danger"  @click="handleDelete(row)">Eliminar</AppButton>
      </template>
    </AppTable>

    <!-- Paginación -->
    <AppPagination
      :current-page="store.page"
      :total-pages="store.totalPages"
      :total-items="store.total"
      :per-page="store.perPage"
      @change="store.setPage"
    />

    <!-- Modal crear/editar -->
    <ProductoFormModal
      :open="modalOpen"
      :producto="editTarget"
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
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.page-title { font-size: 26px; font-weight: 700; }
.page-sub   { color: var(--color-text-muted); margin-top: 4px; font-size: 13px; }

.header-actions { display: flex; gap: 12px; align-items: center; flex-shrink: 0; }

.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
}

.toolbar__count { font-size: 13px; color: var(--color-text-muted); }

.product-thumb {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.no-img { font-size: 20px; display: block; text-align: center; }
.price  { font-weight: 600; color: var(--color-primary); }
</style>
