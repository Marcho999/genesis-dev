<script setup>
import { reactive, watch } from 'vue'
import AppModal from '../../../components/base/AppModal.vue'
import AppInput from '../../../components/base/AppInput.vue'
import AppSelect from '../../../components/base/AppSelect.vue'
import AppButton from '../../../components/base/AppButton.vue'
import { validate, required, isPositive, isInteger, minLength } from '../../../utils/validators.js'
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '../../../constants/app.js'

const props = defineProps({
  open:     { type: Boolean, required: true },
  producto: { type: Object, default: null },
  saving:   { type: Boolean, default: false },
})

const emit = defineEmits(['close', 'submit'])

const form = reactive({
  nombre: '', marca: '', categoria: '', precio: '', stock: '', imagen: '', descripcion: '',
})

const errors = reactive({
  nombre: null, marca: null, categoria: null, precio: null, stock: null,
})

// Rellena el form cuando se abre en modo edición
watch(() => props.producto, (p) => {
  if (p) {
    form.nombre      = p.nombre ?? ''
    form.marca       = p.marca ?? ''
    form.categoria   = p.categoria ?? ''
    form.precio      = p.precio ?? ''
    form.stock       = p.stock ?? ''
    form.imagen      = p.imagen ?? ''
    form.descripcion = p.descripcion ?? ''
  } else {
    Object.assign(form, { nombre:'', marca:'', categoria:'', precio:'', stock:'', imagen:'', descripcion:'' })
  }
  Object.keys(errors).forEach(k => (errors[k] = null))
}, { immediate: true })

function validateForm() {
  errors.nombre    = validate(form.nombre,    [required, minLength(2)])
  errors.marca     = validate(form.marca,     [required])
  errors.categoria = validate(form.categoria, [required])
  errors.precio    = validate(form.precio,    [required, isPositive])
  errors.stock     = validate(form.stock,     [required, isInteger, isPositive])
  return Object.values(errors).every(e => !e)
}

function submit() {
  if (!validateForm()) return
  emit('submit', {
    nombre:      form.nombre,
    marca:       form.marca,
    categoria:   form.categoria,
    precio:      String(form.precio).replace(',', '.'),
    stock:       Number(form.stock),
    imagen:      form.imagen || null,
    descripcion: form.descripcion || null,
  })
}
</script>

<template>
  <AppModal
    :open="open"
    :title="producto ? 'Editar producto' : 'Nuevo producto'"
    size="lg"
    @close="$emit('close')"
  >
    <form class="form-grid" @submit.prevent="submit">
      <AppInput v-model="form.nombre"    label="Nombre"      placeholder="Ej: Nike Air Max 90" :error="errors.nombre"    required />
      <AppInput v-model="form.marca"     label="Marca"       placeholder="Ej: Nike"            :error="errors.marca"     required />
      <AppSelect
        v-model="form.categoria"
        label="Categoría"
        :options="PRODUCT_CATEGORIES"
        :error="errors.categoria"
        required
      />
      <AppInput v-model="form.precio"    label="Precio (COP)" type="number" placeholder="0" :error="errors.precio"    required />
      <AppInput v-model="form.stock"     label="Stock"        type="number" placeholder="0" :error="errors.stock"     required />
      <AppInput v-model="form.imagen"    label="URL Imagen"   placeholder="https://..." class="col-span-2" />
      <div class="col-span-2">
        <label class="field-label">Descripción</label>
        <textarea v-model="form.descripcion" class="textarea" rows="3" placeholder="Descripción del producto..." />
      </div>
    </form>

    <template #footer>
      <AppButton variant="ghost" :disabled="saving" @click="$emit('close')">Cancelar</AppButton>
      <AppButton :loading="saving" @click="submit">
        {{ producto ? 'Guardar cambios' : 'Crear producto' }}
      </AppButton>
    </template>
  </AppModal>
</template>

<style scoped>
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.col-span-2 { grid-column: span 2; }

.field-label {
  display: block;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.3px;
  text-transform: uppercase;
  margin-bottom: 5px;
}

.textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 13.5px;
  font-family: inherit;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.15s;
}
.textarea:focus { outline: none; border-color: var(--color-primary); }
</style>
