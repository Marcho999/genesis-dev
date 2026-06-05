<script setup>
import AppNavbar from './AppNavbar.vue'
</script>

<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="app-main">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-main {
  flex: 1;
  width: min(100% - 48px, var(--container-width));
  margin: 0 auto;
  padding: 40px 0 80px;
}
</style>
