<script setup>
import AppBadge from '../../../components/base/AppBadge.vue'
import AppButton from '../../../components/base/AppButton.vue'
import { formatCurrency } from '../../../utils/formatters.js'
import { useCarritoStore } from '../../../stores/carrito.js'
import { useAuthStore } from '../../../stores/auth.js'

const props = defineProps({
  producto: { type: Object, required: true },
})

const carrito = useCarritoStore()
const auth    = useAuthStore()

const tienePromo = (p) => p.promocion_activa && p.precio_con_descuento < p.precio

function agregar() {
  carrito.agregar(props.producto)
}
</script>

<template>
  <article class="card">
    <!-- Imagen -->
    <div class="card__img-wrap">
      <img
        v-if="producto.imagen"
        :src="producto.imagen"
        :alt="producto.nombre"
        class="card__img"
        loading="lazy"
      />
      <div v-else class="card__img-placeholder">👟</div>

      <AppBadge v-if="tienePromo(producto)" variant="danger" class="card__badge">
        -{{ producto.promocion_activa.descuento }}%
      </AppBadge>
    </div>

    <!-- Contenido -->
    <div class="card__body">
      <AppBadge variant="neutral" class="card__category">{{ producto.categoria }}</AppBadge>

      <h3 class="card__name">{{ producto.nombre }}</h3>
      <p class="card__brand">{{ producto.marca }}</p>

      <p v-if="producto.descripcion" class="card__desc">{{ producto.descripcion }}</p>

      <!-- Precios -->
      <div class="card__price-row">
        <span class="card__price">{{ formatCurrency(producto.precio_con_descuento ?? producto.precio) }}</span>
        <span v-if="tienePromo(producto)" class="card__price-old">{{ formatCurrency(producto.precio) }}</span>
      </div>

      <!-- Stock -->
      <p class="card__stock" :class="{ 'card__stock--out': producto.stock === 0 }">
        {{ producto.stock > 0 ? `${producto.stock} en stock` : 'Sin stock' }}
      </p>
    </div>

    <!-- Acción -->
    <div class="card__footer">
      <AppButton
        full
        :disabled="producto.stock === 0 || auth.isAdmin"
        @click="agregar"
      >
        {{ producto.stock === 0 ? 'Agotado' : 'Agregar al carrito' }}
      </AppButton>
    </div>
  </article>
</template>

<style scoped>
.card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: border-color 0.15s, transform 0.15s;
}
.card:hover { border-color: var(--color-primary); transform: translateY(-2px); }

.card__img-wrap {
  position: relative;
  height: 200px;
  background: var(--color-bg);
  overflow: hidden;
}
.card__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.card__img-placeholder {
  width: 100%;
  height: 100%;
  display: grid;
  place-items: center;
  font-size: 48px;
  color: var(--color-text-muted);
}
.card__badge {
  position: absolute;
  top: 10px;
  right: 10px;
}

.card__body {
  padding: 16px 16px 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}
.card__category { align-self: flex-start; }
.card__name  { font-size: 15px; font-weight: 700; line-height: 1.3; }
.card__brand { font-size: 12px; color: var(--color-text-muted); }
.card__desc  { font-size: 12.5px; color: var(--color-text-muted); line-height: 1.4; }

.card__price-row { display: flex; align-items: center; gap: 8px; margin-top: 6px; }
.card__price     { font-size: 18px; font-weight: 700; color: var(--color-primary); }
.card__price-old { font-size: 13px; color: var(--color-text-muted); text-decoration: line-through; }

.card__stock { font-size: 12px; color: var(--color-success); }
.card__stock--out { color: var(--color-danger); }

.card__footer { padding: 16px; }
</style>
