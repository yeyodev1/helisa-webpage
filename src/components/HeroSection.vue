<script setup lang="ts">
import { ref, onMounted } from 'vue'

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

const isMounted = ref(false)

onMounted(() => {
  setTimeout(() => { isMounted.value = true }, 100)
})
</script>

<template>
  <section id="hero" class="hero">
    <div class="hero__bg">
      <div class="hero__gradient" />
      <div class="hero__particles">
        <span v-for="n in 20" :key="n" class="particle" :style="{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 8}s`,
          animationDuration: `${8 + Math.random() * 12}s`,
          width: `${4 + Math.random() * 8}px`,
          height: `${4 + Math.random() * 8}px`,
        }" />
      </div>
    </div>

    <div class="hero__content">
      <div :class="['hero__text', { 'hero__text--visible': isMounted }]">
        <span class="hero__badge">Health &amp; Life S.A.</span>
        <h1 class="hero__title">
          <span class="hero__title-line">Agua y Aire</span>
          <span class="hero__title-line hero__title-line--accent">Puro para tu hogar</span>
        </h1>
        <p class="hero__subtitle">
          Sistemas de tratamiento y purificación con respaldo técnico
          y atenci&oacute;n personalizada en todo el Ecuador.
        </p>
        <div class="hero__actions">
          <button class="btn btn--primary" @click="scrollTo('products')">
            Ver productos
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button class="btn btn--ghost" @click="scrollTo('about')">
            Conocer m&aacute;s
          </button>
        </div>
      </div>
    </div>

    <div class="hero__scroll">
      <span class="hero__scroll-text">Scroll</span>
      <div class="hero__scroll-line" />
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba($azul-medio, 0.4) 0%, transparent 60%),
      radial-gradient(ellipse 60% 50% at 80% 80%, rgba($rojo, 0.1) 0%, transparent 50%),
      radial-gradient(ellipse 50% 40% at 20% 90%, rgba($celeste-claro, 0.08) 0%, transparent 50%),
      linear-gradient(180deg, $azul-oscuro 0%, darken($azul-oscuro, 3%) 100%);
  }

  &__particles {
    position: absolute;
    inset: 0;
    overflow: hidden;
  }

  &__content {
    position: relative;
    z-index: 1;
    padding: 2rem;
    text-align: center;
    max-width: 900px;
  }

  &__text {
    opacity: 0;
    transform: translateY(40px);
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__badge {
    display: inline-block;
    font-family: $font-secondary;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: $celeste-claro;
    background: rgba($azul-medio, 0.3);
    border: 1px solid rgba($celeste-claro, 0.2);
    padding: 0.5rem 1.25rem;
    border-radius: 100px;
    margin-bottom: 2rem;
  }

  &__title {
    margin: 0 0 1.5rem;
  }

  &__title-line {
    display: block;
    font-family: $font-display;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: -0.03em;

    &--accent {
      background: linear-gradient(135deg, $celeste-claro 0%, $azul-medio 50%, $rojo 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: clamp(1rem, 2vw, 1.2rem);
    color: rgba($white, 0.7);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 auto 2.5rem;
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 1;

    &-text {
      font-family: $font-secondary;
      font-size: 0.7rem;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: rgba($white, 0.4);
    }

    &-line {
      width: 1px;
      height: 40px;
      background: linear-gradient(to bottom, rgba($white, 0.4), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }
  }
}

.particle {
  position: absolute;
  bottom: -10px;
  border-radius: 50%;
  background: rgba($celeste-claro, 0.3);
  animation: float linear infinite;
}

@keyframes float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) scale(0);
    opacity: 0;
  }
}

@keyframes scrollPulse {
  0%, 100% {
    transform: scaleY(1);
    opacity: 1;
  }
  50% {
    transform: scaleY(0.6);
    opacity: 0.3;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 2rem;
  border: none;
  border-radius: 8px;
  font-family: $font-secondary;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &--primary {
    background: $rojo;
    color: $white;

    &:hover {
      background: lighten($rojo, 8%);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($rojo, 0.3);
    }
  }

  &--ghost {
    background: transparent;
    color: $white;
    border: 1px solid rgba($white, 0.2);

    &:hover {
      border-color: $white;
      background: rgba($white, 0.05);
      transform: translateY(-2px);
    }
  }
}
</style>
