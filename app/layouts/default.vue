<script setup lang="ts">
import AppHeader from '~/components/layout/AppHeader.vue'
import AppFooter from '~/components/layout/AppFooter.vue'
</script>

<template>
  <div class="app">
    <AppHeader />

    <main class="app__main">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<style lang="scss" scoped>
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.app__main {
  flex: 1;
}
</style>
