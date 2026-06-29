<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
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

// Close menu on route change
watch(
  () => route.path,
  () => {
    isMobileOpen.value = false
  }
)

// Prevent scrolling when menu is open
watch(isMobileOpen, (isOpen) => {
  if (isOpen) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
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
  <nav :class="['navbar', { 'navbar--scrolled': isScrolled, 'navbar--menu-open': isMobileOpen }]">
    <div class="navbar__inner">
      <RouterLink to="/" class="navbar__logo" aria-label="HELISA - Ir al inicio" @click="isMobileOpen = false">
        <img src="/images/logo/helisa-logo.png" alt="HELISA" class="navbar__logo-img" />
        <span class="navbar__logo-text">HELISA</span>
      </RouterLink>

      <button class="navbar__hamburger" @click="isMobileOpen = !isMobileOpen" :aria-label="isMobileOpen ? 'Cerrar menú' : 'Abrir menú'">
        <span :class="['hamburger-line', { open: isMobileOpen }]" />
      </button>
    </div>
  </nav>

  <Transition name="fullscreen-menu">
    <div v-if="isMobileOpen" class="fullscreen-menu">
      <div class="fullscreen-menu__bg"></div>
      
      <div class="fullscreen-menu__content">
        <nav class="fullscreen-menu__nav">
          <RouterLink
            v-for="(link, index) in navLinks"
            :key="link.to"
            :to="link.to"
            :class="['fullscreen-menu__link', { 'fullscreen-menu__link--active': isActive(link.to) }]"
            :style="{ transitionDelay: `${index * 0.1}s` }"
          >
            <span class="fullscreen-menu__link-num">0{{ index + 1 }}</span>
            {{ link.label }}
          </RouterLink>
        </nav>

        <div class="fullscreen-menu__footer">
          <div class="fullscreen-menu__social">
            <span class="fullscreen-menu__label">Redes Sociales</span>
            <div class="fullscreen-menu__social-links">
              <a href="#" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-instagram"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-facebook-f"></i></a>
              <a href="#" target="_blank" rel="noopener noreferrer"><i class="fa-brands fa-linkedin-in"></i></a>
            </div>
          </div>
          <div class="fullscreen-menu__contact">
            <span class="fullscreen-menu__label">Contáctanos</span>
            <a
              href="https://api.whatsapp.com/send/?phone=5930987125598&text=Hola,+quisiera+comunicarme+con+un+asesor"
              target="_blank"
              rel="noopener noreferrer"
              class="fullscreen-menu__cta"
            >
              Escríbenos por WhatsApp <i class="fa-brands fa-whatsapp"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  background: transparent;
  padding: 1.25rem 1.5rem;
  box-sizing: border-box;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  @media (min-width: 768px) {
    padding: 1.5rem 3rem;
  }

  @media (min-width: 1024px) {
    padding: 2rem 4rem;
  }

  &--scrolled {
    background: rgba($white, 0.95);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border-bottom: 1px solid rgba($black, 0.05);
    padding: 0.875rem 1.5rem;

    @media (min-width: 768px) {
      padding: 1rem 3rem;
    }

    @media (min-width: 1024px) {
      padding: 1rem 4rem;
    }
  }

  &--menu-open {
    background: transparent !important;
    border-bottom: none !important;
    backdrop-filter: none !important;
    
    .navbar__logo-text {
      color: $white;
    }

    .hamburger-line {
      background: transparent;
      &::before, &::after {
        background: $white;
      }
    }
  }

  &__inner {
    width: 100%;
    max-width: 1600px;
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
    position: relative;
    z-index: 1001;
    text-decoration: none;
  }

  &__logo-img {
    width: 45px;
    height: 45px;
    object-fit: contain;
    transition: transform 0.5s;
  }

  &__logo:hover &__logo-img {
    transform: scale(1.05);
  }

  &__logo-text {
    font-family: $font-display;
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: -0.03em;
    color: $primary;
    transition: color 0.4s;
  }

  &__hamburger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
    width: 48px;
    height: 48px;
    position: relative;
    z-index: 1001;
    transition: transform 0.3s;

    &:hover {
      transform: scale(1.05);
    }
  }
}

.hamburger-line {
  display: block;
  width: 28px;
  height: 2px;
  background: $primary;
  position: relative;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &::before,
  &::after {
    content: '';
    position: absolute;
    left: 0;
    width: 100%;
    height: 2px;
    background: $primary;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &::before {
    top: -8px;
  }

  &::after {
    top: 8px;
    width: 70%;
    right: 0;
    left: auto;
  }

  &.open {
    background: transparent;

    &::before {
      top: 0;
      transform: rotate(45deg);
      background: $white;
    }

    &::after {
      top: 0;
      width: 100%;
      transform: rotate(-45deg);
      background: $white;
    }
  }
}

/* FULLSCREEN OVERLAY MENU (AWWWARDS STYLE) */
.fullscreen-menu {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    background: $primary;
    z-index: 0;
  }

  &__content {
    position: relative;
    z-index: 1;
    width: 100%;
    max-width: 1200px;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    height: 100%;
    padding-top: 20vh;
    padding-bottom: 10vh;
    box-sizing: border-box;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      padding-top: 0;
      padding-bottom: 0;
    }
  }

  &__nav {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    @media (min-width: 1024px) {
      gap: 1.5rem;
    }
  }

  &__link {
    font-family: $font-display;
    font-size: clamp(3rem, 8vw, 6rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    color: rgba($white, 0.6);
    text-decoration: none;
    display: flex;
    align-items: baseline;
    gap: 1.5rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    position: relative;
    line-height: 1;

    &-num {
      font-family: $font-secondary;
      font-size: clamp(1rem, 2vw, 1.5rem);
      font-weight: 400;
      color: rgba($white, 0.3);
      letter-spacing: 0.1em;
      transition: color 0.4s;
    }

    &:hover,
    &--active {
      color: $white;
      transform: translateX(20px);

      .fullscreen-menu__link-num {
        color: $white;
      }
    }
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 3rem;
    margin-top: 4rem;

    @media (min-width: 1024px) {
      margin-top: 0;
      margin-left: auto;
      text-align: right;
      align-items: flex-end;
    }
  }

  &__label {
    display: block;
    font-family: $font-secondary;
    font-size: 0.85rem;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: rgba($white, 0.4);
    margin-bottom: 1.5rem;
  }

  &__social-links {
    display: flex;
    gap: 1.5rem;

    @media (min-width: 1024px) {
      justify-content: flex-end;
    }

    a {
      color: $white;
      font-size: 1.5rem;
      transition: transform 0.3s, color 0.3s;

      &:hover {
        transform: translateY(-5px);
        color: rgba($white, 0.7);
      }
    }
  }

  &__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1.25rem 2.5rem;
    background: rgba($white, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.2);
    border-radius: 100px;
    color: $white;
    font-family: $font-secondary;
    font-size: 1rem;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: $white;
      color: $primary;
      transform: translateY(-3px);
    }
  }
}

/* TRANSITIONS */
.fullscreen-menu-enter-active,
.fullscreen-menu-leave-active {
  transition: all 0.8s cubic-bezier(0.85, 0, 0.15, 1);
  
  .fullscreen-menu__bg {
    transition: transform 0.8s cubic-bezier(0.85, 0, 0.15, 1);
  }

  .fullscreen-menu__link {
    transition: opacity 0.4s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .fullscreen-menu__footer {
    transition: opacity 0.6s, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.fullscreen-menu-enter-from,
.fullscreen-menu-leave-to {
  .fullscreen-menu__bg {
    transform: translateY(-100%);
  }

  .fullscreen-menu__link {
    opacity: 0;
    transform: translateY(30px);
  }

  .fullscreen-menu__footer {
    opacity: 0;
    transform: translateY(30px);
  }
}

.fullscreen-menu-enter-to,
.fullscreen-menu-leave-from {
  .fullscreen-menu__bg {
    transform: translateY(0);
  }

  .fullscreen-menu__link {
    opacity: 1;
    transform: translateY(0);
  }

  .fullscreen-menu__footer {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
