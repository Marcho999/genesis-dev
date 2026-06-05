<script setup>
import AppLayout from './components/layout/AppLayout.vue'
import AppNotifications from './components/base/AppNotifications.vue'
</script>

<template>
  <AppLayout>
    <RouterView />
  </AppLayout>
  <AppNotifications />
</template>
