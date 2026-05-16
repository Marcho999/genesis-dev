<template>
  <div class="app-shell">
    <header class="app-header">
      <a class="brand" href="/" aria-label="Genesis Dev">
        <span class="brand-mark">G</span>
        <span>Genesis Dev</span>
      </a>

      <nav class="main-nav" aria-label="Principal">
        <a href="#inicio">Inicio</a>
        <a href="#proyecto">Proyecto</a>
        <a href="#contacto">Contacto</a>
      </nav>
    </header>

    <main class="app-main">
      <slot />
    </main>
  </div>
</template>
