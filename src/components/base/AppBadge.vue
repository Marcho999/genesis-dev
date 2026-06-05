<script setup>
defineProps({
  variant: { type: String, default: 'neutral' },
  // success | danger | warning | neutral | primary | info
})
</script>

<template>
  <span class="badge" :class="`badge--${variant}`">
    <slot />
  </span>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 9px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.3px;
  white-space: nowrap;
}

.badge--neutral  { background: rgba(139,144,167,.15); color: var(--color-text-muted); }
.badge--primary  { background: rgba(249,115,22,.18);  color: var(--color-primary); }
.badge--success  { background: rgba(34,197,94,.15);   color: var(--color-success); }
.badge--danger   { background: rgba(239,68,68,.15);   color: var(--color-danger); }
.badge--warning  { background: rgba(245,158,11,.15);  color: var(--color-warning); }
.badge--info     { background: rgba(99,179,237,.15);  color: #63b3ed; }
</style>
