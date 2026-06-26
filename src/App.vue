<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
</script>

<template>
  <div class="app-container">
    <NavBar />
    <main class="app-main">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <FooterSection class="app-footer" />
    <ScrollToTop />
  </div>
</template>

<style lang="scss">
@use '@/styles/colorVariables.module.scss' as *;

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.app-main {
  flex: 1;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.app-footer {
  width: 100%;
  margin: 0 auto;
}
</style>
