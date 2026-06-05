<script setup>
import { RouterLink, useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'
import { APP_NAME, APP_TAGLINE, NAV_ADMIN, NAV_PUBLIC } from '../../constants/app.js'
import { useAuthStore } from '../../stores/auth.js'
import { useNotificationsStore } from '../../stores/notifications.js'

const route  = useRoute()
const router = useRouter()
const auth   = useNotificationsStore()
const store  = useAuthStore()
const notif  = useNotificationsStore()

const navLinks = computed(() => store.isAdmin ? NAV_ADMIN : NAV_PUBLIC)

async function logout() {
  await store.logout()
  notif.info('Sesión cerrada')
  router.push('/catalogo')
}

function isActive(to) {
  return route.path === to || (to !== '/' && route.path.startsWith(to))
}
</script>

<template>
  <header class="navbar">
    <div class="navbar-inner">
      <!-- Brand -->
      <RouterLink to="/" class="brand">
        <span class="brand-icon">Z</span>
        <div class="brand-text">
          <span class="brand-name">{{ APP_NAME }}</span>
          <span class="brand-tag">{{ APP_TAGLINE }}</span>
        </div>
      </RouterLink>

      <!-- Navigation links -->
      <nav class="nav-links" aria-label="Navegación principal">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ 'nav-link--active': isActive(link.to) }"
        >
          {{ link.label }}
        </RouterLink>
      </nav>

      <!-- Right side -->
      <div class="nav-right">
        <!-- Usuario autenticado -->
        <template v-if="store.isAuthenticated">
          <span class="nav-user">
            <span class="nav-user-role" :class="`role--${store.user?.role}`">
              {{ store.isAdmin ? 'Admin' : 'Cliente' }}
            </span>
            {{ store.user?.name }}
          </span>
          <button class="nav-logout" @click="logout">Salir</button>
        </template>

        <!-- Sin autenticar -->
        <template v-else>
          <RouterLink to="/login" class="nav-login">Iniciar sesión</RouterLink>
        </template>
      </div>
    </div>
  </header>
</template>

<style scoped>
.navbar {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  height: var(--navbar-height);
  position: sticky;
  top: 0;
  z-index: 100;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 0;
  width: min(100% - 48px, var(--container-width));
  margin: 0 auto;
  height: 100%;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
  margin-right: 28px;
}

.brand-icon {
  width: 34px;
  height: 34px;
  background: var(--color-primary);
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  border-radius: var(--radius-md);
  display: grid;
  place-items: center;
}

.brand-text { display: flex; flex-direction: column; line-height: 1.2; }
.brand-name { font-size: 15px; font-weight: 700; color: var(--color-text); }
.brand-tag  { font-size: 10.5px; color: var(--color-text-muted); }

/* Nav links */
.nav-links { display: flex; gap: 2px; flex: 1; }

.nav-link {
  padding: 6px 14px;
  border-radius: var(--radius-sm);
  color: var(--color-text-muted);
  font-size: 13.5px;
  font-weight: 500;
  transition: color 0.15s, background 0.15s;
}
.nav-link:hover { color: var(--color-text); background: var(--color-surface-hover); }
.nav-link--active { color: var(--color-text); background: var(--color-surface-hover); }

/* Right side */
.nav-right {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;
  flex-shrink: 0;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--color-text-muted);
}

.nav-user-role {
  font-size: 11px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 99px;
}
.role--admin  { background: rgba(249,115,22,.2); color: var(--color-primary); }
.role--normal { background: rgba(34,197,94,.15); color: var(--color-success); }

.nav-logout {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-muted);
  font-size: 12.5px;
  font-family: inherit;
  padding: 5px 14px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.nav-logout:hover { color: var(--color-danger); border-color: var(--color-danger); }

.nav-login {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-primary);
  padding: 6px 16px;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  transition: background 0.15s;
}
.nav-login:hover { background: rgba(249,115,22,.12); }
</style>
