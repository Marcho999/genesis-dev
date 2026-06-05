<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  label:       { type: String },
  type:        { type: String, default: 'text' },
  placeholder: { type: String },
  error:       { type: String },
  helper:      { type: String },
  required:    { type: Boolean, default: false },
  disabled:    { type: Boolean, default: false },
})

defineEmits(['update:modelValue'])
</script>

<template>
  <div class="field">
    <label v-if="label" class="field__label">
      {{ label }}
      <span v-if="required" class="field__required" aria-hidden="true">*</span>
    </label>
    <input
      :type="type"
      class="field__input"
      :class="{ 'field__input--error': error }"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      @input="$emit('update:modelValue', $event.target.value)"
    />
    <p v-if="error" class="field__error" role="alert">{{ error }}</p>
    <p v-else-if="helper" class="field__helper">{{ helper }}</p>
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

.field__input {
  height: 38px;
  padding: 0 12px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text);
  font-size: 13.5px;
  font-family: inherit;
  transition: border-color 0.15s, box-shadow 0.15s;
  width: 100%;
}

.field__input::placeholder { color: var(--color-text-muted); opacity: 0.6; }
.field__input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(249,115,22,.18);
}
.field__input:disabled { opacity: 0.5; cursor: not-allowed; }
.field__input--error { border-color: var(--color-danger); }
.field__input--error:focus { box-shadow: 0 0 0 3px rgba(239,68,68,.18); }

.field__error  { font-size: 12px; color: var(--color-danger); }
.field__helper { font-size: 12px; color: var(--color-text-muted); }
</style>
