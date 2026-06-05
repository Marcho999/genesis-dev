<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth.js'
import { useNotificationsStore } from '../../../stores/notifications.js'
import AppInput from '../../../components/base/AppInput.vue'
import AppButton from '../../../components/base/AppButton.vue'
import { validate, required, isEmail, minLength } from '../../../utils/validators.js'

const router  = useRouter()
const auth    = useAuthStore()
const notif   = useNotificationsStore()

// 'choose' | 'admin' | 'normal'
const step = ref('choose')

const form = reactive({ email: '', password: '' })
const errors = reactive({ email: null, password: null })

function selectRole(role) { step.value = role }

function validateForm() {
  errors.email    = validate(form.email,    [required, isEmail])
  errors.password = validate(form.password, [required, minLength(8)])
  return !errors.email && !errors.password
}

async function submit() {
  if (!validateForm()) return
  try {
    await auth.login({ ...form, role: step.value })
    notif.success('Bienvenido a Zapadictos')
    router.push(auth.isAdmin ? '/productos' : '/catalogo')
  } catch {
    notif.error(auth.error ?? 'Credenciales incorrectas')
  }
}
</script>

<template>
  <div class="login-wrap">
    <!-- Step 1: elegir tipo de acceso -->
    <div v-if="step === 'choose'" class="login-card">
      <div class="login-brand">
        <span class="brand-icon">Z</span>
        <div>
          <p class="brand-name">Zapadictos</p>
          <p class="brand-tag">Calzado urbano</p>
        </div>
      </div>

      <h1 class="login-title">¿Cómo deseas acceder?</h1>
      <p class="login-sub">Selecciona el tipo de acceso según tu rol</p>

      <div class="role-grid">
        <button class="role-card" @click="selectRole('admin')">
          <span class="role-icon">⚙</span>
          <strong>Administrador</strong>
          <p>Gestiona productos, promociones y pedidos</p>
        </button>
        <button class="role-card" @click="selectRole('normal')">
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

    <!-- Step 2: formulario de login -->
    <div v-else class="login-card">
      <button class="back-btn" @click="step = 'choose'">← Volver</button>

      <div class="login-brand">
        <span class="brand-icon">Z</span>
        <div>
          <p class="brand-name">Zapadictos</p>
          <p class="brand-tag">{{ step === 'admin' ? 'Panel Admin' : 'Acceso Cliente' }}</p>
        </div>
      </div>

      <h1 class="login-title">Iniciar sesión</h1>

      <form class="login-form" @submit.prevent="submit">
        <AppInput
          v-model="form.email"
          label="Correo electrónico"
          type="email"
          placeholder="tu@email.com"
          :error="errors.email"
          required
        />
        <AppInput
          v-model="form.password"
          label="Contraseña"
          type="password"
          placeholder="Mínimo 8 caracteres"
          :error="errors.password"
          required
        />

        <AppButton type="submit" :loading="auth.loading" full>
          Ingresar
        </AppButton>
      </form>
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
