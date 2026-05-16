# Router

Aqui puedes configurar Vue Router cuando tu proyecto tenga varias paginas.

Ejemplo futuro:

```js
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', component: HomeView }],
})
```
