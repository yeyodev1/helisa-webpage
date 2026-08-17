<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import NavBar from '@/components/NavBar.vue'
import FooterSection from '@/components/FooterSection.vue'
import ScrollToTop from '@/components/ScrollToTop.vue'
import AppPreloader from '@/components/AppPreloader.vue'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const handleTokenExpired = () => {
  userStore.clear()
  // Un token viejo/expirado en localStorage no debería sacar a un visitante
  // anónimo de una página pública (Home, Productos, Nosotros...) — solo
  // manda a /login si realmente está en una ruta que requiere sesión.
  const requiresAuth = router.currentRoute.value.matched.some((record) => record.meta?.requiresAuth)
  if (requiresAuth) {
    router.push('/login')
  }
}

onMounted(() => {
  window.addEventListener('auth:token-expired', handleTokenExpired)
})

onUnmounted(() => {
  window.removeEventListener('auth:token-expired', handleTokenExpired)
})
</script>

<template>
  <div class="app-container">
    <AppPreloader />
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
}

.app-main {
  flex: 1;
  width: 100%;
  margin: 0 auto;
}

.app-footer {
  width: 100%;
  margin: 0 auto;
}
</style>
