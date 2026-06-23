<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const isScrolled = ref(false)
const isMobileOpen = ref(false)
const route = useRoute()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 60
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const navLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Productos', to: '/productos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Calificar', to: '/calificar' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <nav :class="['navbar', { 'navbar--scrolled': isScrolled }]">
    <div class="navbar__inner">
      <RouterLink to="/" class="navbar__logo" aria-label="HELISA - Ir al inicio">
        <i class="fa-solid fa-droplet navbar__logo-icon"></i>
        <span class="navbar__logo-text">HELISA</span>
      </RouterLink>

      <div class="navbar__links">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="['navbar__link', { 'navbar__link--active': isActive(link.to) }]"
          :aria-current="isActive(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </RouterLink>
      </div>

      <button class="navbar__hamburger" @click="isMobileOpen = !isMobileOpen" :aria-label="isMobileOpen ? 'Cerrar menú' : 'Abrir menú'">
        <span :class="['hamburger-line', { open: isMobileOpen }]" />
      </button>
    </div>

    <Transition name="mobile-menu">
      <div v-if="isMobileOpen" class="navbar__mobile">
        <RouterLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="navbar__mobile-link"
          @click="isMobileOpen = false"
        >
          {{ link.label }}
        </RouterLink>
      </div>
    </Transition>
  </nav>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 1.5rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 768px) {
    padding: 1.5rem 3rem;
  }

  @media (min-width: 1024px) {
    padding: 1.5rem 4rem;
  }

  &--scrolled {
    background: rgba($azul-oscuro, 0.8);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border-bottom: 1px solid rgba($white, 0.06);
    padding: 0.75rem 1.5rem;

    @media (min-width: 768px) {
      padding: 0.75rem 3rem;
    }

    @media (min-width: 1024px) {
      padding: 0.75rem 4rem;
    }
  }

  &__inner {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;

    @media (min-width: 1440px) {
      max-width: 1320px;
    }

    @media (min-width: 1920px) {
      max-width: 1680px;
    }
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__logo-icon {
    font-size: 1.75rem;
    color: $celeste-claro;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &__logo:hover &__logo-icon {
    transform: scale(1.1) rotate(5deg);
  }

  &__logo-text {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: 0.05em;
    background: linear-gradient(135deg, $white 0%, $celeste-claro 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  &__links {
    display: none;
    align-items: center;
    gap: 2.5rem;

    @media (min-width: 768px) {
      display: flex;
    }
  }

  &__link {
    color: rgba($white, 0.75);
    font-family: $font-secondary;
    font-size: 0.9rem;
    font-weight: 500;
    position: relative;
    padding: 0.25rem 0;
    transition: color 0.3s;

    &::after {
      content: '';
      position: absolute;
      bottom: -2px;
      left: 0;
      width: 0;
      height: 2px;
      background: $rojo;
      transition: width 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover,
    &--active {
      color: $white;

      &::after {
        width: 100%;
      }
    }
  }

  &__hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    width: 32px;
    height: 32px;
    z-index: 10;

    @media (min-width: 768px) {
      display: none;
    }
  }

  &__mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($azul-oscuro, 0.98);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2rem;

    &-link {
      color: $white;
      font-family: $font-display;
      font-size: 2rem;
      font-weight: 600;
      transition: color 0.3s;

      &:hover,
      &.router-link-active {
        color: $rojo;
      }
    }
  }
}

.hamburger-line {
  display: block;
  width: 24px;
  height: 2px;
  background: $white;
  position: relative;
  transition: all 0.3s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: $white;
    transition: all 0.3s;
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
  }

  &.open {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
    }

    &::after {
      top: 0;
      transform: rotate(-45deg);
    }
  }
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.3s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
