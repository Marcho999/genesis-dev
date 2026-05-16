# Estructura del proyecto

Tu aplicacion Vue empieza en `src/main.js` y carga `src/App.vue`.

## Donde escribir tu codigo

- `src/App.vue`: componente raiz. Mantenlo simple y úsalo para montar el layout, rutas o vistas principales.
- `src/views`: pantallas completas. Ejemplo: `HomeView.vue`, `LoginView.vue`, `DashboardView.vue`.
- `src/components/base`: componentes pequenos y reutilizables. Ejemplo: botones, inputs, modales.
- `src/components/layout`: estructura visual general. Ejemplo: header, sidebar, footer, layout principal.
- `src/features`: funcionalidades grandes organizadas por modulo. Ejemplo: `auth`, `products`, `orders`.
- `src/composables`: logica reutilizable de Vue. Ejemplo: `useToggle`, `useAuth`, `useProducts`.
- `src/services/api`: llamadas a backend o servicios externos.
- `src/stores`: estado global cuando lo necesites.
- `src/utils`: funciones puras de ayuda. Ejemplo: formatear fechas, validar textos, calcular totales.
- `src/constants`: valores fijos del proyecto.
- `src/styles`: CSS global dividido por responsabilidad.
- `src/assets/images`: imagenes del proyecto.
- `src/assets/icons`: iconos o recursos visuales.
- `public`: archivos estaticos que se sirven directamente.

## Forma recomendada de trabajar

1. Crea una vista en `src/views` para cada pantalla.
2. Divide cada pantalla en componentes dentro de `src/components` o `src/features`.
3. Si una funcion se repite, muevela a `src/utils` o `src/composables`.
4. Si necesitas consumir datos de una API, crea funciones en `src/services/api`.
5. Evita escribir todo en `App.vue`; úsalo como entrada principal, no como bodega.

## Ejemplo rapido

Si quieres crear una pagina de productos:

- Crea `src/views/ProductsView.vue`.
- Crea componentes en `src/features/products/components`.
- Crea llamadas a datos en `src/features/products/services`.
- Importa `ProductsView.vue` desde `App.vue` o desde el router cuando instales Vue Router.
