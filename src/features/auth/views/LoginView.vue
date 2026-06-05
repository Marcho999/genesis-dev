<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { useNotificationsStore } from '../../../stores/notifications.js'

const router = useRouter()
const auth   = useAuthStore()
const notif  = useNotificationsStore()

async function entrar(role) {
  try {
    await auth.login({ role })
    notif.success('Bienvenido a GENESIS')
    router.push(auth.isAdmin ? '/productos' : '/catalogo')
  } catch {
    notif.error('Error al iniciar sesión')
  }
}
</script>

<template>
  <div class="login-wrap">
    <div class="login-card">
      <div class="login-brand">
        <span class="brand-icon">G</span>
        <div>
          <p class="brand-name">GENESIS</p>
          <p class="brand-tag">Calzado urbano</p>
        </div>
      </div>

      <h1 class="login-title">¿Cómo deseas acceder?</h1>
      <p class="login-sub">Selecciona el tipo de acceso según tu rol</p>

      <div class="role-grid">
        <button class="role-card" :disabled="auth.loading" @click="entrar('admin')">
          <span class="role-icon">⚙</span>
          <strong>Administrador</strong>
          <p>Gestiona productos, promociones y pedidos</p>
        </button>
        <button class="role-card" :disabled="auth.loading" @click="entrar('normal')">
          <span class="role-icon">👟</span>
          <strong>Cliente</strong>
          <p>Explora el catálogo y realiza compras</p>
        </button>
      </div>

      <p class="login-guest">
        ¿Solo quieres ver el catálogo?
        <RouterLink to="/catalogo" class="link">Entrar sin cuenta</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  min-height: calc(100vh - var(--navbar-height));
  display: grid;
  place-items: center;
  padding: 40px 16px;
}

.login-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 40px;
  width: 100%;
  max-width: 440px;
  box-shadow: var(--shadow-card);
}

.login-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 800;
  font-size: 20px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
  flex-shrink: 0;
}

.brand-name { font-size: 16px; font-weight: 700; }
.brand-tag  { font-size: 12px; color: var(--color-text-muted); }

.login-title { font-size: 22px; font-weight: 700; margin-bottom: 6px; }
.login-sub   { color: var(--color-text-muted); font-size: 13.5px; margin-bottom: 28px; }

.role-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 24px;
  margin-bottom: 24px;
}

.role-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-align: center;
  padding: 24px 16px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: border-color 0.15s, background 0.15s;
  color: var(--color-text);
  font-family: inherit;
}

.role-card:hover {
  border-color: var(--color-primary);
  background: var(--color-surface-hover);
}

.role-card strong { font-size: 14px; }
.role-card p { font-size: 12px; color: var(--color-text-muted); line-height: 1.4; }
.role-icon { font-size: 24px; }

.login-guest { text-align: center; font-size: 13px; color: var(--color-text-muted); }
.link { color: var(--color-primary); font-weight: 600; }
.link:hover { text-decoration: underline; }

.login-form { display: flex; flex-direction: column; gap: 18px; margin-top: 24px; }

.back-btn {
  background: none;
  border: none;
  color: var(--color-text-muted);
  font-size: 13px;
  cursor: pointer;
  padding: 0;
  margin-bottom: 24px;
  font-family: inherit;
}
.back-btn:hover { color: var(--color-text); }
</style>
