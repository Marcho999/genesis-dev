<script setup>
import { ref } from 'vue'

const props = defineProps({
  variant:     { type: String, default: 'info' }, // info | success | warning | danger
  title:       { type: String },
  dismissible: { type: Boolean, default: false },
})

const visible = ref(true)
</script>

<template>
  <Transition name="fade">
    <div v-if="visible" class="alert" :class="`alert--${variant}`" role="alert">
      <div class="alert__content">
        <strong v-if="title" class="alert__title">{{ title }}</strong>
        <slot />
      </div>
      <button v-if="dismissible" class="alert__close" @click="visible = false">✕</button>
    </div>
  </Transition>
</template>

<style scoped>
.alert {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  border-left: 3px solid;
  font-size: 13.5px;
}

.alert--info    { background: rgba(99,179,237,.1); border-color: #63b3ed; color: #90cdf4; }
.alert--success { background: rgba(34,197,94,.1);  border-color: var(--color-success); color: var(--color-success); }
.alert--warning { background: rgba(245,158,11,.1); border-color: var(--color-warning); color: var(--color-warning); }
.alert--danger  { background: rgba(239,68,68,.1);  border-color: var(--color-danger);  color: var(--color-danger); }

.alert__content { flex: 1; line-height: 1.5; }
.alert__title   { display: block; font-weight: 700; margin-bottom: 2px; }

.alert__close {
  background: none;
  border: none;
  cursor: pointer;
  color: currentColor;
  opacity: 0.7;
  font-size: 14px;
  padding: 0 2px;
  flex-shrink: 0;
}
.alert__close:hover { opacity: 1; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
