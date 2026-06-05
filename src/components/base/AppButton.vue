<script setup>
defineProps({
  variant: { type: String, default: 'primary' },
  size:    { type: String, default: 'md' },
  type:    { type: String, default: 'button' },
  loading: { type: Boolean, default: false },
  disabled:{ type: Boolean, default: false },
  full:    { type: Boolean, default: false },
})
</script>

<template>
  <button
    :type="type"
    class="btn"
    :class="[`btn--${variant}`, `btn--${size}`, { 'btn--full': full, 'btn--loading': loading }]"
    :disabled="disabled || loading"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true" />
    <slot />
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, color 0.15s, opacity 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn:disabled { opacity: 0.5; cursor: not-allowed; }
.btn--full { width: 100%; }

/* Sizes */
.btn--sm { font-size: 12px; padding: 5px 12px; height: 30px; }
.btn--md { font-size: 13px; padding: 8px 18px; height: 36px; }
.btn--lg { font-size: 14px; padding: 10px 24px; height: 42px; }

/* Variants */
.btn--primary { background: var(--color-primary); color: #fff; }
.btn--primary:not(:disabled):hover { background: var(--color-primary-hover); }

.btn--danger { background: var(--color-danger); color: #fff; }
.btn--danger:not(:disabled):hover { background: var(--color-danger-hover); }

.btn--success { background: var(--color-success); color: #fff; }
.btn--success:not(:disabled):hover { filter: brightness(0.9); }

.btn--outline {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
}
.btn--outline:not(:disabled):hover { color: var(--color-text); border-color: var(--color-text-muted); }

.btn--ghost {
  background: transparent;
  color: var(--color-text-muted);
}
.btn--ghost:not(:disabled):hover { background: var(--color-surface-hover); color: var(--color-text); }

/* Spinner */
.btn__spinner {
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
