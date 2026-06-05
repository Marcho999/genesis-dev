<script setup>
defineProps({
  open:    { type: Boolean, required: true },
  title:   { type: String },
  size:    { type: String, default: 'md' }, // sm | md | lg | xl
})

defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="open" class="modal-overlay" @mousedown.self="$emit('close')">
        <div class="modal-panel" :class="`modal-panel--${size}`" role="dialog" :aria-modal="true">
          <div class="modal-header">
            <h2 class="modal-title">{{ title }}</h2>
            <button class="modal-close" aria-label="Cerrar" @click="$emit('close')">✕</button>
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div v-if="$slots.footer" class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 24px;
}

.modal-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  width: 100%;
  box-shadow: var(--shadow-card);
}

.modal-panel--sm { max-width: 380px; }
.modal-panel--md { max-width: 520px; }
.modal-panel--lg { max-width: 720px; }
.modal-panel--xl { max-width: 960px; }

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 24px;
  border-bottom: 1px solid var(--color-border);
  flex-shrink: 0;
}

.modal-title { font-size: 16px; font-weight: 700; color: var(--color-text); }

.modal-close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 16px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  transition: color 0.15s, background 0.15s;
}
.modal-close:hover { color: var(--color-text); background: var(--color-surface-hover); }

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid var(--color-border);
  flex-shrink: 0;
}

/* Transition */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-active .modal-panel, .modal-leave-active .modal-panel { transition: transform 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-from .modal-panel { transform: translateY(-12px) scale(0.97); }
.modal-leave-to .modal-panel { transform: translateY(6px) scale(0.98); }
</style>
