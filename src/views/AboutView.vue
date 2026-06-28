<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const triggers: ScrollTrigger[] = []
const activeValue = ref<number | null>(null)

const values = [
  { id: 1, title: 'Capital Humano', desc: 'Ambiente laboral excelente, proactivo e innovador.', icon: 'fa-users' },
  { id: 2, title: 'Productos y Servicios', desc: 'Alta calidad para ser líderes del mercado.', icon: 'fa-circle-check' },
  { id: 3, title: 'Responsabilidad Social', desc: 'Alianzas con fundaciones como Sembrando Sonrisas.', icon: 'fa-heart' },
  { id: 4, title: 'Planeta', desc: 'Responsabilidad ambiental ofreciendo agua y aire limpio.', icon: 'fa-earth-americas' },
]

const timeline = [
  { year: '2009', title: 'Nacimiento', desc: 'HELISA nace como Health & Life S.A. con la misión de purificar agua y aire en Ecuador.' },
  { year: '2015', title: 'Expansión', desc: 'Ampliamos nuestra cobertura nacional con soporte técnico en todas las regiones.' },
  { year: '2020', title: 'Innovación', desc: 'Incorporamos tecnologías de ozono, UV y ósmosis inversa de última generación.' },
  { year: '2025', title: 'Liderazgo', desc: 'Consolidados como referentes en tratamiento de agua y aire del país.' },
]

onMounted(() => {
  const headerTl = gsap.timeline()
  headerTl
    .from('.about-header__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.about-header__title', { y: 80, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('.about-header__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  const storyTl = gsap.timeline({
    scrollTrigger: { trigger: '.story', start: 'top 75%', toggleActions: 'play none none none' },
  })
  storyTl
    .fromTo('.story__label', { y: 20, opacity: 1 }, { y: 0, opacity: 1, duration: 0.6 })
    .fromTo('.story__title', { y: 40, opacity: 1 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
    .fromTo('.story__text p', { y: 24, opacity: 1 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.4')
    .fromTo('.story__visual', { scale: 1.03, opacity: 1 }, { scale: 1, opacity: 1, duration: 1 }, '-=0.6')
  if (storyTl.scrollTrigger) triggers.push(storyTl.scrollTrigger)

  document.querySelectorAll('.value-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 30, opacity: 1,
    }, {
      y: 0, opacity: 1, duration: 0.7, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.values__grid', start: 'top 80%', toggleActions: 'play none none none' },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.timeline__item').forEach((item) => {
    const tween = gsap.fromTo(item, {
      y: 30, opacity: 1,
    }, {
      y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none none' },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <main class="about-page">
    <section class="about-header">
      <div class="about-header__bg">
        <div class="about-header__grid" />
      </div>
      <div class="container about-header__content">
        <span class="about-header__label">Nosotros</span>
        <h1 class="about-header__title">Health &amp; <span class="text-gradient">Life S.A.</span></h1>
        <p class="about-header__desc">
          Humanizamos la tecnología para cuidar lo más valioso: tu salud y la de tu familia.
        </p>
      </div>
    </section>

    <section class="story section-padding">
      <div class="container story__inner">
        <div class="story__visual">
          <div class="story__frame">
            <img src="/images/nave-supersacos.jpg" alt="Instalaciones HELISA" class="story__image" />
            <div class="story__badge story__badge--top">
              <span class="story__badge-dot"></span>
              <span class="story__badge-text">Ecuador</span>
            </div>
            <div class="story__badge story__badge--bottom">
              <div class="story__badge-icon">
                <i class="fa-solid fa-heart"></i>
              </div>
              <div class="story__badge-body">
                <span class="story__badge-number">2009</span>
                <span class="story__badge-label">Desde</span>
              </div>
            </div>
          </div>
          <div class="story__ring" aria-hidden="true"></div>
        </div>

        <div class="story__text">
          <span class="section-label reveal-item">Nuestra esencia</span>
          <h2 class="section-title reveal-item">Pensando en <span class="text-gradient">su bienestar</span></h2>
          <p class="reveal-item">
            HELISA representa el nacimiento de una vida más saludable. Nuestro propósito es
            ofrecer los mejores sistemas de tratamiento y purificación de agua y aire con
            respaldo de repuestos y atención personalizada en todo el Ecuador.
          </p>
          <p class="reveal-item">
            Para nosotros el agua es movimiento, dinamismo, salud y energía. Cada sistema que
            instalamos lleva esa filosofía: transformar espacios para que respires y bebas con confianza.
          </p>
          <div class="story__slogan reveal-item">
            <i class="fa-solid fa-quote-left"></i>
            <span>Pensando en su bienestar</span>
          </div>
        </div>
      </div>
    </section>

    <section class="values section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Pilares</span>
          <h2 class="section-title">Lo que nos <span class="text-gradient">mueve</span></h2>
        </div>
        <div class="values__grid">
          <article
            v-for="value in values"
            :key="value.id"
            class="value-card"
            tabindex="0"
            :aria-label="`Valor: ${value.title}`"
            @mouseenter="activeValue = value.id"
            @mouseleave="activeValue = null"
            @focus="activeValue = value.id"
            @blur="activeValue = null"
            :class="{ 'value-card--active': activeValue === value.id }"
          >
            <div class="value-card__icon">
              <i :class="['fa-solid', value.icon]"></i>
            </div>
            <h3 class="value-card__title">{{ value.title }}</h3>
            <p class="value-card__desc">{{ value.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="timeline section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-label">Historia</span>
          <h2 class="section-title">Nuestro <span class="text-gradient">camino</span></h2>
        </div>
        <div class="timeline__wrapper">
          <div class="timeline__items">
            <div v-for="(item, index) in timeline" :key="item.year" class="timeline__item">
              <div class="timeline__dot" />
              <div class="timeline__content" :class="{ 'timeline__content--right': index % 2 !== 0 }">
                <span class="timeline__year">{{ item.year }}</span>
                <h3 class="timeline__title">{{ item.title }}</h3>
                <p class="timeline__desc">{{ item.desc }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.about-page {
  padding-top: 80px;
}

.about-header {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
  background: $white;
  border-bottom: 1px solid $border;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient($gray-100 1px, transparent 1px),
      linear-gradient(90deg, $gray-100 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.5;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, $black 0%, transparent 70%);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    padding: 8rem 1.5rem 5rem;
    box-sizing: border-box;
  }

  &__label {
    @include label-pill;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 500;
    letter-spacing: -0.05em;
    line-height: 1.05;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: $foreground-muted;
    max-width: 550px;
    margin: 0;
    line-height: 1.7;
  }
}

.story {
  background: $background-soft;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1280px;
  }

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    width: 100%;

    @media (min-width: 1024px) {
      flex-direction: row;
      gap: 6rem;
    }
  }

  &__visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 520px;
    padding: 2rem;
  }

  &__frame {
    position: relative;
    width: 100%;
    padding: 1rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 36px;
    box-shadow:
      0 40px 80px -20px rgba($black, 0.08),
      0 24px 40px -24px rgba($black, 0.04);
    z-index: 1;
  }

  &__image {
    width: 100%;
    border-radius: 24px;
    aspect-ratio: 4 / 5;
    object-fit: cover;
    display: block;
  }

  &__ring {
    position: absolute;
    top: 0;
    right: 0;
    width: 70%;
    height: 70%;
    border: 1px dashed $border;
    border-radius: 50%;
    transform: translate(15%, -10%);
    z-index: 0;
    pointer-events: none;
    animation: storyRingRotate 60s linear infinite;
  }

  &__badge {
    position: absolute;
    display: flex;
    align-items: center;
    gap: 0.65rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 100px;
    box-shadow: 0 20px 50px rgba($black, 0.1);
    z-index: 2;

    &--top {
      top: 0;
      right: -1rem;
      padding: 0.6rem 1rem;
    }

    &--bottom {
      bottom: 0;
      left: -2.5rem;
      padding: 0.85rem 1.25rem;
      border-radius: 20px;
      gap: 1rem;
    }

    &-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $black;
      box-shadow: 0 0 0 4px rgba($black, 0.08);
    }

    &-text {
      font-family: $font-secondary;
      font-size: 0.8rem;
      font-weight: 500;
      color: $black;
      letter-spacing: 0.02em;
    }

    &-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 44px;
      height: 44px;
      background: $black;
      border-radius: 14px;
      color: $white;
      font-size: 1.1rem;
      flex-shrink: 0;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    &-number {
      font-family: $font-display;
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.04em;
      color: $black;
      line-height: 1;
    }

    &-label {
      font-family: $font-secondary;
      font-size: 0.7rem;
      color: $foreground-muted;
    }
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    max-width: 520px;

    @media (min-width: 1024px) {
      align-items: flex-start;
      text-align: left;
    }

    p {
      font-family: $font-secondary;
      font-size: 1.05rem;
      color: $foreground-muted;
      line-height: 1.8;
      margin: 0;
    }
  }

  &__slogan {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 1rem;
    padding: 1rem 1.5rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 12px;
    font-family: $font-secondary;
    font-style: italic;
    color: $foreground-muted;

    i {
      color: $black;
      font-size: 1.25rem;
    }
  }
}

.values {
  background: $white;
  border-top: 1px solid $border;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1280px;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
  }
}

.value-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  flex: 1 1 220px;
  max-width: 280px;
  background: $background-soft;
  border: 1px solid $border;
  border-radius: 24px;
  padding: 2rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;

  &:hover,
  &--active {
    background: $white;
    border-color: $black;
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    background: $black;
    border-radius: 16px;
    color: $white;
    font-size: 1.35rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.15rem;
    font-weight: 500;
    color: $black;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

.timeline {
  background: $background-soft;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1280px;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  &__wrapper {
    position: relative;
    width: 100%;
    max-width: 900px;
  }

  &__items {
    position: relative;

    &::before {
      content: '';
      position: absolute;
      left: 20px;
      top: 0;
      bottom: 0;
      width: 1px;
      background: $border;

      @media (min-width: 768px) {
        left: 50%;
        transform: translateX(-50%);
      }
    }
  }

  &__item {
    position: relative;
    padding-left: 60px;
    margin-bottom: 3rem;

    @media (min-width: 768px) {
      padding-left: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
      margin-bottom: 4rem;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__dot {
    position: absolute;
    left: 14px;
    top: 0;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    background: $black;
    border: 3px solid $white;

    @media (min-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__content {
    background: $white;
    border: 1px solid $border;
    border-radius: 20px;
    padding: 1.5rem 2rem;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      border-color: $black;
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba($black, 0.06);
    }

    @media (min-width: 768px) {
      &--right {
        grid-column: 2;
      }
    }
  }

  &__year {
    display: block;
    font-family: $font-display;
    font-size: 1.75rem;
    font-weight: 500;
    color: $black;
    margin-bottom: 0.25rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.15rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 0.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

@keyframes storyRingRotate {
  from { transform: translate(15%, -10%) rotate(0deg); }
  to { transform: translate(15%, -10%) rotate(360deg); }
}
</style>
