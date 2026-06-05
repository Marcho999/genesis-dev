# Feature: Autenticación

Módulo completo para manejar autenticación en la app.

## Estructura

```
auth/
├── views/           → LoginView.vue, RegisterView.vue
├── components/      → LoginForm.vue, RegisterForm.vue
├── services/        → Lógica de API
└── stores/          → Estado de autenticación
```

## Uso

```js
import { useAuth } from '@/composables/useAuth'

const { user, isAuthenticated, login } = useAuth()
```
