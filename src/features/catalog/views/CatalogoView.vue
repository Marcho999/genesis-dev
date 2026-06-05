<script setup>
import { ref, onMounted } from 'vue'
import { useCarritoStore } from '../../../stores/carrito.js'
import { useAuthStore } from '../../../stores/auth.js'
import { catalogoService } from '../../../services/catalogo.service.js'
import ProductoCard from '../components/ProductoCard.vue'
import CartPanel from '../components/CartPanel.vue'
import AppButton from '../../../components/base/AppButton.vue'
import AppPagination from '../../../components/base/AppPagination.vue'
import AppInput from '../../../components/base/AppInput.vue'

const carrito = useCarritoStore()
const auth    = useAuthStore()

const productos  = ref([])
const total      = ref(0)
const page       = ref(1)
const perPage    = 9
const loading    = ref(false)
const search     = ref('')
let   searchTimer = null

const totalPages = () => Math.ceil(total.value / perPage)

async function fetchProductos() {
  loading.value = true
  try {
    const res = await catalogoService.getAll({ page: page.value, perPage, search: search.value })
    productos.value = res.data
    total.value     = res.total
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

function onSearch(q) {
  search.value = q
  page.value   = 1
  clearTimeout(searchTimer)
  searchTimer = setTimeout(fetchProductos, 350)
}

function changePage(p) { page.value = p; fetchProductos() }

onMounted(fetchProductos)
</script>

<template>
  <div>
    <!-- Top bar -->
    <div class="catalog-header">
      <div>
        <h1 class="page-title">Catálogo</h1>
        <p class="page-sub">{{ total }} producto{{ total !== 1 ? 's' : '' }} disponibles</p>
      </div>

      <!-- Carrito FAB (solo no-admins) -->
      <button v-if="!auth.isAdmin" class="cart-fab" @click="carrito.togglePanel()">
        🛒
        <span v-if="carrito.count > 0" class="cart-fab__badge">{{ carrito.count }}</span>
      </button>
    </div>

    <!-- Búsqueda -->
    <div class="catalog-toolbar">
      <AppInput
        :modelValue="search"
        placeholder="Buscar calzado..."
        style="max-width:340px"
        @update:modelValue="onSearch"
      />
    </div>

    <!-- Grid de productos -->
    <div v-if="loading" class="products-grid">
      <div v-for="n in 9" :key="n" class="skeleton-card" />
    </div>

    <div v-else-if="productos.length === 0" class="empty-catalog">
      <p>No hay productos que coincidan con tu búsqueda.</p>
    </div>

    <div v-else class="products-grid">
      <ProductoCard
        v-for="producto in productos"
        :key="producto.id"
        :producto="producto"
      />
    </div>

    <!-- Paginación -->
    <AppPagination
      :current-page="page"
      :total-pages="totalPages()"
      :total-items="total"
      :per-page="perPage"
      @change="changePage"
    />

    <!-- Panel carrito -->
    <CartPanel />
  </div>
</template>

<style scoped>
.catalog-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 20px;
}

.page-title { font-size: 26px; font-weight: 700; }
.page-sub   { color: var(--color-text-muted); margin-top: 4px; font-size: 13px; }

.catalog-toolbar { margin-bottom: 24px; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.skeleton-card {
  height: 380px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  animation: shimmer 1.4s infinite;
  background: linear-gradient(90deg, var(--color-surface) 25%, var(--color-surface-hover) 50%, var(--color-surface) 75%);
  background-size: 200% 100%;
}

.empty-catalog {
  text-align: center;
  padding: 60px;
  color: var(--color-text-muted);
  font-size: 15px;
}

/* FAB carrito */
.cart-fab {
  position: relative;
  width: 52px;
  height: 52px;
  background: var(--color-primary);
  border: none;
  border-radius: 50%;
  font-size: 22px;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow: 0 4px 16px rgba(249,115,22,0.4);
  transition: transform 0.15s, background 0.15s;
  flex-shrink: 0;
}
.cart-fab:hover { background: var(--color-primary-hover); transform: scale(1.05); }

.cart-fab__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 20px;
  height: 20px;
  background: var(--color-danger);
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  border-radius: 99px;
  display: grid;
  place-items: center;
  padding: 0 4px;
}

@keyframes shimmer { to { background-position: -200% 0; } }
</style>
