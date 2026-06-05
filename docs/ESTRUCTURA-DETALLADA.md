# 📁 Estructura Detallada del Proyecto Genesis Dev

## 🎯 Propósito de Cada Carpeta

### `/src/components/`
**Componentes reutilizables de Vue**
- `base/` → Componentes básicos (Button, Input, Card, etc.)
- `icons/` → Componentes de iconos SVG
- `layout/` → Componentes de diseño (Header, Footer, Sidebar)

**Cómo usar:**
```js
import MyComponent from '@/components/base/Button.vue'
```

### `/src/views/`
**Páginas completas (1:1 con rutas)**
- Cada archivo = una página/vista
- Ejemplo: `HomeView.vue`, `AboutView.vue`, `ProductsView.vue`
- Estas vistas se renderiza con Vue Router

**Cómo usar:**
```js
// En router/index.js
import HomeView from '@/views/HomeView.vue'

routes: [
  { path: '/', component: HomeView }
]
```

### `/src/features/`
**Módulos por dominio/característica**
- Agrupa toda la lógica de una característica
- Estructura interna:
  - `views/` → Vistas del feature
  - `components/` → Componentes específicos
  - `services/` → APIs del feature
  - `stores/` → Estado del feature

**Ejemplo: Feature de autenticación**
```
features/auth/
├── components/
│   ├── LoginForm.vue
│   └── RegisterForm.vue
├── views/
│   ├── LoginView.vue
│   └── RegisterView.vue
├── services/
│   └── authService.js
└── stores/
    └── authStore.js
```

### `/src/services/`
**Lógica de conexión con APIs**
- `api/http.js` → Cliente HTTP genérico
- `auth.js` → Servicios de autenticación
- `product.js` → Servicios de productos
- `user.js` → Servicios de usuarios

**Cómo usar:**
```js
import { loginService } from '@/services/auth'

const response = await loginService(email, password)
```

### `/src/stores/`
**State Management (Pinia/Vuex)**
- `auth.js` → Estado de autenticación
- `product.js` → Estado de productos
- Gestiona datos compartidos entre componentes

**Cómo usar:**
```js
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
console.log(authStore.user)
```

### `/src/composables/`
**Lógica reutilizable (Vue 3 Composition API)**
- `useToggle.js` → Toggle simple
- `useFetch.js` → Manejar llamadas a APIs
- `useAuth.js` → Lógica de autenticación

**Cómo usar:**
```js
import { useAuth } from '@/composables/useAuth'

const { user, login } = useAuth()
```

### `/src/router/`
**Configuración de rutas (Vue Router)**
- `index.js` → Configuración de rutas principales
- `guards.js` → Protección de rutas (auth, admin)

**Cómo usar:**
```js
// main.js
import { router } from '@/router'
app.use(router)
```

### `/src/constants/`
**Valores constantes**
- `app.js` → Constantes de la app (nombre, versión)
- `api.js` → Endpoints de API, status codes

**Cómo usar:**
```js
import { API_ENDPOINTS } from '@/constants/api'

apiRequest(API_ENDPOINTS.LOGIN, {...})
```

### `/src/utils/`
**Funciones auxiliares**
- `formatters.js` → Dar formato a datos (moneda, fechas)
- `validators.js` → Validar datos (email, password)

**Cómo usar:**
```js
import { formatCurrency, validateEmail } from '@/utils/formatters'

console.log(formatCurrency(100)) // $100.00
```

### `/src/types/`
**Modelos/Tipos de datos**
- `user.js` → Estructura de Usuario
- `product.js` → Estructura de Producto

**Cómo usar:**
```js
import { createUser, validateUserData } from '@/types/user'

const user = createUser({ name: 'Juan', email: 'juan@example.com' })
const { isValid, errors } = validateUserData(user)
```

### `/src/styles/`
**Estilos CSS globales**
- `main.css` → Estilos principales
- `variables.css` → Variables CSS (colores, tamaños)
- `reset.css` → Reset de estilos por defecto
- `layout.css` → Estilos de layout
- `pages.css` → Estilos específicos por página

---

## 🗂️ Plantilla de Estructura Completa

```
src/
├── components/
│   ├── base/
│   │   ├── Button.vue
│   │   ├── Input.vue
│   │   └── Card.vue
│   ├── icons/
│   │   ├── IconHome.vue
│   │   └── IconUser.vue
│   └── layout/
│       ├── AppLayout.vue
│       ├── AppHeader.vue
│       └── AppFooter.vue
│
├── features/
│   ├── auth/
│   │   ├── views/
│   │   │   ├── LoginView.vue
│   │   │   └── RegisterView.vue
│   │   ├── components/
│   │   │   ├── LoginForm.vue
│   │   │   └── RegisterForm.vue
│   │   ├── services/
│   │   └── stores/
│   │
│   ├── products/
│   │   ├── views/
│   │   ├── components/
│   │   └── services/
│   │
│   └── dashboard/
│       ├── views/
│       └── components/
│
├── views/
│   ├── HomeView.vue
│   ├── AboutView.vue
│   └── 404View.vue
│
├── services/
│   ├── api/
│   │   └── http.js
│   ├── auth.js
│   ├── product.js
│   └── user.js
│
├── stores/
│   ├── auth.js
│   └── product.js
│
├── composables/
│   ├── useToggle.js
│   ├── useFetch.js
│   └── useAuth.js
│
├── router/
│   ├── index.js
│   └── guards.js
│
├── constants/
│   ├── app.js
│   └── api.js
│
├── utils/
│   ├── formatters.js
│   └── validators.js
│
├── types/
│   ├── user.js
│   └── product.js
│
├── styles/
│   ├── main.css
│   ├── variables.css
│   ├── reset.css
│   ├── layout.css
│   └── pages.css
│
├── assets/
│   ├── icons/
│   └── images/
│
├── App.vue
└── main.js

├── .env.example
├── vite.config.js
├── jsconfig.json
└── package.json
```

---

## 📋 Checklist para Mapear tu Código

- [ ] **¿Es una página?** → `/src/views/`
- [ ] **¿Es un componente reutilizable?** → `/src/components/`
- [ ] **¿Es lógica de API?** → `/src/services/`
- [ ] **¿Es estado compartido?** → `/src/stores/`
- [ ] **¿Es un hook/lógica reutilizable?** → `/src/composables/`
- [ ] **¿Es un formato/validación?** → `/src/utils/`
- [ ] **¿Es una constante?** → `/src/constants/`
- [ ] **¿Es todo un módulo?** → `/src/features/`

---

## 🚀 Próximas Mejoras Sugeridas

1. **State Management**: Instalar y configurar Pinia
   ```bash
   npm install pinia
   ```

2. **Router Real**: Configurar rutas en `/src/router/index.js`

3. **Testing**: Agregar Vitest
   ```bash
   npm install -D vitest @vue/test-utils
   ```

4. **Linting**: Agregar ESLint + Prettier

5. **Validación de Tipos**: Migrar a TypeScript o usar JSDoc
