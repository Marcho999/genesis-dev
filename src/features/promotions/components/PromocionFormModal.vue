<script setup>
import { reactive, watch, onMounted, ref } from 'vue'
import AppModal from '../../../components/base/AppModal.vue'
import AppInput from '../../../components/base/AppInput.vue'
import AppSelect from '../../../components/base/AppSelect.vue'
import AppButton from '../../../components/base/AppButton.vue'
import { validate, required, between } from '../../../utils/validators.js'
import { productosService } from '../../../services/productos.service.js'

const props = defineProps({
  open:      { type: Boolean, required: true },
  promocion: { type: Object, default: null },
  saving:    { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const productosOpts = ref([])

const form = reactive({
  producto_id: '', descuento: '', fecha_inicio: '', fecha_fin: '', activa: true,
})

const errors = reactive({
  producto_id: null, descuento: null, fecha_inicio: null, fecha_fin: null,
})

onMounted(async () => {
  const res = await productosService.getAll({ perPage: 999 })
  productosOpts.value = res.data.map(p => ({ value: p.id, label: `${p.nombre} — ${p.marca}` }))
})

watch(() => props.promocion, (p) => {
  if (p) {
    form.producto_id  = p.producto_id ?? ''
    form.descuento    = p.descuento   ?? ''
    form.fecha_inicio = p.fecha_inicio ?? ''
    form.fecha_fin    = p.fecha_fin    ?? ''
    form.activa       = p.activa       ?? true
  } else {
    Object.assign(form, { producto_id:'', descuento:'', fecha_inicio:'', fecha_fin:'', activa: true })
  }
  Object.keys(errors).forEach(k => (errors[k] = null))
}, { immediate: true })

function validateForm() {
  errors.producto_id  = validate(form.producto_id,  [required])
  errors.descuento    = validate(form.descuento,    [required, between(1, 100)])
  errors.fecha_inicio = validate(form.fecha_inicio, [required])
  errors.fecha_fin    = validate(form.fecha_fin,    [required])
  return Object.values(errors).every(e => !e)
}

function submit() {
  if (!validateForm()) return
  emit('submit', { ...form, descuento: Number(form.descuento) })
}
</script>

<template>
  <AppModal
    :open="open"
    :title="promocion ? 'Editar promoción' : 'Nueva promoción'"
    size="md"
    @close="$emit('close')"
  >
    <form class="form" @submit.prevent="submit">
      <AppSelect
        v-model="form.producto_id"
        label="Producto"
        :options="productosOpts"
        placeholder="Selecciona un producto..."
        :error="errors.producto_id"
        required
      />

      <AppInput
        v-model="form.descuento"
        label="Descuento (%)"
        type="number"
        placeholder="Ej: 20"
        :error="errors.descuento"
        helper="Porcentaje entre 1 y 100"
        required
      />

      <div class="date-row">
        <AppInput v-model="form.fecha_inicio" label="Fecha inicio" type="date" :error="errors.fecha_inicio" required />
        <AppInput v-model="form.fecha_fin"    label="Fecha fin"    type="date" :error="errors.fecha_fin"    required />
      </div>

      <label v-if="promocion" class="toggle-wrap">
        <input type="checkbox" v-model="form.activa" class="toggle-check" />
        <span>Promoción activa</span>
      </label>
    </form>

    <template #footer>
      <AppButton variant="ghost" :disabled="saving" @click="$emit('close')">Cancelar</AppButton>
      <AppButton :loading="saving" @click="submit">
        {{ promocion ? 'Guardar cambios' : 'Crear promoción' }}
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.form { display: flex; flex-direction: column; gap: 18px; }
.date-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }

.toggle-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  cursor: pointer;
}
.toggle-check { accent-color: var(--color-primary); width: 16px; height: 16px; }
</style>
