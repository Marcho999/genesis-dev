import { createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards.js'

const routes = [
  { path: '/', redirect: '/catalogo' },

  // Pública
  {
    path: '/login',
    name: 'login',
    component: () => import('../features/auth/views/LoginView.vue'),
    meta: { public: true },
  },
  {
    path: '/catalogo',
    name: 'catalogo',
    component: () => import('../features/catalog/views/CatalogoView.vue'),
    meta: { public: true },
  },
  {
    path: '/ventas/:id',
    name: 'venta-detalle',
    component: () => import('../features/ventas/views/VentaDetalleView.vue'),
    meta: { public: true },
  },

  // Admin
  {
    path: '/productos',
    name: 'productos',
    component: () => import('../features/products/views/ProductosView.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/promociones',
    name: 'promociones',
    component: () => import('../features/promotions/views/PromocionesView.vue'),
    meta: { requiresAdmin: true },
  },
  {
    path: '/ventas',
    name: 'ventas',
    component: () => import('../features/ventas/views/VentasView.vue'),
    meta: { requiresAdmin: true },
  },

  // Fallback
  { path: '/:pathMatch(.*)*', redirect: '/catalogo' },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach(authGuard)
