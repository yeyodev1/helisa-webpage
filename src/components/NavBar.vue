<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, RouterLink } from 'vue-router'

const isScrolled = ref(false)
const isMobileOpen = ref(false)
const route = useRoute()

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40
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
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/calificar' },
]

const isActive = (path: string) => route.path === path
</script>

<template>
  <nav :class="['navbar', { 'navbar--scrolled': isScrolled }]">
    <div class="navbar__inner">
      <RouterLink to="/" class="navbar__logo" aria-label="HELISA - Ir al inicio">
        <img src="/images/logo/helisa-logo.png" alt="HELISA" class="navbar__logo-img" />
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

      <a
        href="https://api.whatsapp.com/send/?phone=5930987125598&text=Hola,+quisiera+comunicarme+con+un+asesor"
        target="_blank"
        rel="noopener noreferrer"
        class="navbar__cta"
      >
        Escríbenos
      </a>

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
        <a
          href="https://api.whatsapp.com/send/?phone=5930987125598&text=Hola,+quisiera+comunicarme+con+un+asesor"
          target="_blank"
          rel="noopener noreferrer"
          class="navbar__mobile-cta"
          @click="isMobileOpen = false"
        >
          Escríbenos por WhatsApp
        </a>
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
  padding: 1.25rem 1.5rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 768px) {
    padding: 1.5rem 3rem;
  }

  @media (min-width: 1024px) {
    padding: 1.75rem 4rem;
  }

  &--scrolled {
    background: rgba($white, 0.92);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid $border;
    padding: 0.875rem 1.5rem;

    @media (min-width: 768px) {
      padding: 0.875rem 3rem;
    }

    @media (min-width: 1024px) {
      padding: 0.875rem 4rem;
    }
  }

  &__inner {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: space-between;
    box-sizing: border-box;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    z-index: 1001;
  }

  &__logo-img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  &__logo-text {
    font-family: $font-display;
    font-weight: 600;
    font-size: 1.25rem;
    letter-spacing: -0.02em;
    color: $black;
  }

  &__links {
    display: none;
    align-items: center;
    gap: 2.5rem;

    @media (min-width: 1024px) {
      display: flex;
    }
  }

  &__link {
    color: $foreground-muted;
    font-family: $font-secondary;
    font-size: 0.85rem;
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
      height: 1px;
      background: $black;
      transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover,
    &--active {
      color: $black;

      &::after {
        width: 100%;
      }
    }
  }

  &__cta {
    display: none;
    padding: 0.7rem 1.25rem;
    background: $black;
    color: $white;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: $gray-800;
      transform: translateY(-1px);
    }

    @media (min-width: 1024px) {
      display: inline-flex;
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
    z-index: 1001;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  &__mobile {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba($white, 0.98);
    backdrop-filter: blur(20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    z-index: 1000;

    &-link {
      color: $black;
      font-family: $font-display;
      font-size: 2rem;
      font-weight: 500;
      letter-spacing: -0.03em;
      transition: color 0.3s;

      &:hover,
      &.router-link-active {
        color: $gray-500;
      }
    }

    &-cta {
      margin-top: 1rem;
      padding: 0.9rem 1.5rem;
      background: $black;
      color: $white;
      border-radius: 100px;
      font-family: $font-secondary;
      font-size: 0.85rem;
      font-weight: 500;
    }
  }
}

.hamburger-line {
  display: block;
  width: 22px;
  height: 1.5px;
  background: $black;
  position: relative;
  transition: all 0.3s;

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 1.5px;
    background: $black;
    transition: all 0.3s;
  }

  &::before {
    top: -7px;
  }

  &::after {
    top: 7px;
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
  transition: opacity 0.4s ease;
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}
</style>
