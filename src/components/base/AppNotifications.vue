<script setup>
import { useNotificationsStore } from '../../stores/notifications.js'
const store = useNotificationsStore()
</script>

<template>
  <Teleport to="body">
    <div class="notif-list" aria-live="polite">
      <TransitionGroup name="notif">
        <div
          v-for="n in store.items"
          :key="n.id"
          class="notif"
          :class="`notif--${n.type}`"
        >
          <span class="notif__icon">
            {{ n.type === 'success' ? '✓' : n.type === 'error' ? '✕' : 'i' }}
          </span>
          <span class="notif__msg">{{ n.message }}</span>
          <button class="notif__close" @click="store.remove(n.id)">✕</button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style scoped>
.notif-list {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  width: calc(100vw - 48px);
}

.notif {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-card);
  font-size: 13.5px;
  color: var(--color-text);
}

.notif--success .notif__icon { color: var(--color-success); }
.notif--error   .notif__icon { color: var(--color-danger); }
.notif--info    .notif__icon { color: #63b3ed; }

.notif__icon { font-size: 15px; font-weight: 700; flex-shrink: 0; }
.notif__msg  { flex: 1; line-height: 1.4; }

.notif__close {
  background: none;
  border: none;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 13px;
  flex-shrink: 0;
}
.notif__close:hover { color: var(--color-text); }

.notif-enter-active { transition: all 0.25s ease; }
.notif-leave-active { transition: all 0.2s ease; }
.notif-enter-from   { opacity: 0; transform: translateX(20px); }
.notif-leave-to     { opacity: 0; transform: translateX(20px); }
</style>
