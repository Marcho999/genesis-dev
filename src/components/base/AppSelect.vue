<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:      { type: String },
  options:    { type: Array, default: () => [] },
  // options: [{ value, label }]  OR  ['string', ...]
  placeholder:{ type: String, default: 'Seleccionar...' },
  error:      { type: String },
  required:   { type: Boolean, default: false },
  disabled:   { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required">*</span>
    </label>
    <select
      class="field__select"
      :class="{ 'field__select--error': error }"
      :value="modelValue"
      :required="required"
      :disabled="disabled"
      @change="$emit('update:modelValue', $event.target.value)"
    >
      <option value="" disabled>{{ placeholder }}</option>
      <template v-for="opt in options" :key="typeof opt === 'object' ? opt.value : opt">
        <option :value="typeof opt === 'object' ? opt.value : opt">
          {{ typeof opt === 'object' ? opt.label : opt }}
        </option>
      </template>
    </select>
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
  </div>
</template>

<style scoped>
.field { display: flex; flex-direction: column; gap: 5px; }

.field__label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--color-text-muted);
  letter-spacing: 0.3px;
  text-transform: uppercase;
}

.field__required { color: var(--color-danger); margin-left: 3px; }

.field__select {
  height: 38px;
  padding: 0 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 13.5px;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
  appearance: auto;
}

.field__select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(249,115,22,.18);
}
.field__select:disabled { opacity: 0.5; cursor: not-allowed; }
.field__select--error { border-color: var(--color-danger); }

.field__error { font-size: 12px; color: var(--color-danger); }
</style>
