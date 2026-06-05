<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import AppButton from '../../../components/base/AppButton.vue'
import AppInput from '../../../components/base/AppInput.vue'
import AppSelect from '../../../components/base/AppSelect.vue'
import AppAlert from '../../../components/base/AppAlert.vue'
import { useCarritoStore } from '../../../stores/carrito.js'
import { useVentasStore } from '../../../stores/ventas.js'
import { useNotificationsStore } from '../../../stores/notifications.js'
import { formatCurrency } from '../../../utils/formatters.js'
import { validate, required } from '../../../utils/validators.js'

const carrito = useCarritoStore()
const ventas  = useVentasStore()
const notif   = useNotificationsStore()
const router  = useRouter()

const showCheckout = ref(false)

const form = reactive({
  nombre_envio:    '',
  pais_envio:      'Colombia',
  ciudad_envio:    '',
  direccion_envio: '',
  metodo_pago:     'nequi',
})

const errors = reactive({
  nombre_envio: null, ciudad_envio: null, direccion_envio: null,
})

const METODOS_PAGO = [
  { value: 'nequi',          label: 'Nequi' },
  { value: 'daviplata',      label: 'Daviplata (próximamente)', disabled: true },
  { value: 'tarjeta',        label: 'Tarjeta (próximamente)',   disabled: true },
  { value: 'transferencia',  label: 'Transferencia (próximamente)', disabled: true },
]

function validateForm() {
  errors.nombre_envio    = validate(form.nombre_envio,    [required])
  errors.ciudad_envio    = validate(form.ciudad_envio,    [required])
  errors.direccion_envio = validate(form.direccion_envio, [required])
  return Object.values(errors).every(e => !e)
}

async function confirmarCompra() {
  if (!validateForm()) return
  try {
    const venta = await ventas.checkout({
      ...form,
      items: carrito.itemsList.map(i => ({
        producto_id: i.id,
        cantidad:    i.cantidad,
      })),
    })
    carrito.vaciar()
    carrito.open = false
    showCheckout.value = false
    notif.success('¡Pedido realizado con éxito!')
    router.push(`/ventas/${venta.id}`)
  } catch {
    notif.error(ventas.error ?? 'Error al procesar el pedido')
  }
}
</script>

<template>
  <!-- Overlay -->
  <Transition name="fade">
    <div v-if="carrito.open" class="overlay" @click.self="carrito.open = false" />
  </Transition>

  <!-- Panel -->
  <Transition name="slide">
    <aside v-if="carrito.open" class="cart-panel">
      <header class="cart-header">
        <h2 class="cart-title">Carrito <span class="cart-count">{{ carrito.count }}</span></h2>
        <button class="cart-close" @click="carrito.open = false">✕</button>
      </header>

      <!-- Carrito vacío -->
      <div v-if="carrito.isEmpty" class="cart-empty">
        <span class="cart-empty-icon">🛒</span>
        <p>Tu carrito está vacío</p>
      </div>

      <template v-else>
        <!-- Items -->
        <ul v-if="!showCheckout" class="cart-items">
          <li v-for="item in carrito.itemsList" :key="item.id" class="cart-item">
            <div class="cart-item__img-wrap">
              <img v-if="item.imagen" :src="item.imagen" :alt="item.nombre" class="cart-item__img" />
              <span v-else class="cart-item__img-ph">👟</span>
            </div>
            <div class="cart-item__info">
              <p class="cart-item__name">{{ item.nombre }}</p>
              <p class="cart-item__brand">{{ item.marca }}</p>
              <p class="cart-item__price">{{ formatCurrency(item.precio_con_descuento * item.cantidad) }}</p>
            </div>
            <div class="cart-item__qty">
              <button class="qty-btn" @click="carrito.disminuir(String(item.id))">−</button>
              <span class="qty-val">{{ item.cantidad }}</span>
              <button class="qty-btn" @click="carrito.incrementar(String(item.id))">+</button>
            </div>
            <button class="cart-item__remove" @click="carrito.quitar(String(item.id))">✕</button>
          </li>
        </ul>

        <!-- Checkout form -->
        <div v-else class="checkout-form">
          <h3 class="checkout-title">Datos de envío</h3>

          <AppInput v-model="form.nombre_envio"    label="Nombre completo"  :error="errors.nombre_envio"    required />
          <AppInput v-model="form.pais_envio"      label="País"             disabled />
          <AppInput v-model="form.ciudad_envio"    label="Ciudad"           :error="errors.ciudad_envio"    required />
          <AppInput v-model="form.direccion_envio" label="Dirección"        :error="errors.direccion_envio" required />

          <h3 class="checkout-title" style="margin-top:16px">Método de pago</h3>
          <div class="payment-methods">
            <label
              v-for="m in METODOS_PAGO"
              :key="m.value"
              class="payment-option"
              :class="{ 'payment-option--selected': form.metodo_pago === m.value, 'payment-option--disabled': m.disabled }"
            >
              <input type="radio" :value="m.value" v-model="form.metodo_pago" :disabled="m.disabled" />
              {{ m.label }}
            </label>
          </div>

          <AppAlert v-if="ventas.error" variant="danger" dismissible>{{ ventas.error }}</AppAlert>
        </div>

        <!-- Footer -->
        <footer class="cart-footer">
          <div class="cart-total">
            <span>Total</span>
            <strong>{{ formatCurrency(carrito.total) }}</strong>
          </div>

          <div v-if="!showCheckout" class="cart-footer-actions">
            <AppButton variant="ghost" full @click="carrito.vaciar()">Vaciar carrito</AppButton>
            <AppButton full @click="showCheckout = true">Finalizar compra →</AppButton>
          </div>
          <div v-else class="cart-footer-actions">
            <AppButton variant="ghost" full @click="showCheckout = false">← Volver</AppButton>
            <AppButton full :loading="ventas.saving" @click="confirmarCompra">Confirmar pedido</AppButton>
          </div>
        </footer>
      </template>
    </aside>
  </Transition>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 200;
}

.cart-panel {
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  max-width: 100vw;
  height: 100vh;
  background: var(--color-surface);
  border-left: 1px solid var(--color-border);
  z-index: 201;
  display: flex;
  flex-direction: column;
  box-shadow: -8px 0 32px rgba(0,0,0,0.4);
}

.cart-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 20px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}
.cart-title { font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 10px; }
.cart-count {
  background: var(--color-primary);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: grid;
  place-items: center;
}
.cart-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 18px;
  cursor: pointer;
}
.cart-close:hover { color: var(--color-text); }

.cart-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: var(--color-text-muted);
  font-size: 14px;
}
.cart-empty-icon { font-size: 48px; }

.cart-items {
  flex: 1;
  overflow-y: auto;
  padding: 12px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  list-style: none;
}

.cart-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.cart-item__img-wrap { flex-shrink: 0; }
.cart-item__img { width: 48px; height: 48px; object-fit: cover; border-radius: var(--radius-sm); }
.cart-item__img-ph { width: 48px; height: 48px; display: grid; place-items: center; font-size: 24px; }
.cart-item__info { flex: 1; min-width: 0; }
.cart-item__name  { font-size: 13px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.cart-item__brand { font-size: 11px; color: var(--color-text-muted); }
.cart-item__price { font-size: 13px; font-weight: 700; color: var(--color-primary); margin-top: 3px; }

.cart-item__qty { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.qty-btn {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text);
  cursor: pointer;
  font-size: 16px;
  display: grid;
  place-items: center;
}
.qty-btn:hover { background: var(--color-surface-hover); }
.qty-val { font-size: 13px; font-weight: 600; min-width: 20px; text-align: center; }

.cart-item__remove {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
}
.cart-item__remove:hover { color: var(--color-danger); }

.checkout-form {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}
.checkout-title { font-size: 14px; font-weight: 700; color: var(--color-text); }

.payment-methods { display: flex; flex-direction: column; gap: 8px; }
.payment-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  font-size: 13.5px;
  transition: border-color 0.15s;
}
.payment-option:has(input:checked) { border-color: var(--color-primary); }
.payment-option--disabled { opacity: 0.4; cursor: not-allowed; }
.payment-option input { accent-color: var(--color-primary); }

.cart-footer {
  border-top: 1px solid var(--color-border);
  padding: 16px 20px;
  flex-shrink: 0;
}
.cart-total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 14px;
}
.cart-footer-actions { display: flex; gap: 10px; }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

.slide-enter-active, .slide-leave-active { transition: transform 0.25s ease; }
.slide-enter-from, .slide-leave-to { transform: translateX(100%); }
</style>
