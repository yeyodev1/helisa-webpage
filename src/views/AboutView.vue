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
  { year: '2003', title: 'Origen', desc: 'Nacimos con la visión de transformar el acceso a agua tratada y segura en Ecuador.', image: '/images/proyectos/edificio-helisa.jpg' },
  { year: '2010', title: 'Expansión', desc: 'Ampliamos nuestra cobertura nacional con soporte técnico en todas las regiones.', image: '/images/nave-tarimas.jpg' },
  { year: '2018', title: 'Innovación', desc: 'Incorporamos tecnologías de ozono, UV y ósmosis inversa de última generación.', image: '/images/patio-naves.webp' },
  { year: '2025', title: 'Liderazgo', desc: 'Consolidados como referentes en tratamiento de agua y aire del país.', image: '/images/curso-carbon.jpg' },
]

onMounted(() => {
  const tl = gsap.timeline()
  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span > span', { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out', clipPath: 'inset(0% 0% 100% 0%)' }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  const storyTl = gsap.timeline({
    scrollTrigger: { trigger: '.story', start: 'top 75%', toggleActions: 'play none none none' },
  })
  storyTl
    .fromTo('.story__label', { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 })
    .fromTo('.story__title', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.3')
    .fromTo('.story__text p', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.15 }, '-=0.4')
    .fromTo('.story__visual', { scale: 1.05, opacity: 0, y: 40 }, { scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.6')
  if (storyTl.scrollTrigger) triggers.push(storyTl.scrollTrigger)

  document.querySelectorAll('.value-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 40, opacity: 0, scale: 0.95
    }, {
      y: 0, opacity: 1, scale: 1, duration: 0.8, delay: i * 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.values__grid', start: 'top 80%', toggleActions: 'play none none none' },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.timeline__item').forEach((item) => {
    const tween = gsap.fromTo(item, {
      y: 40, opacity: 0,
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
    <section class="about-hero">
      <div class="about-hero__bg">
        <div class="about-hero__grid"></div>
        <div class="about-hero__glow"></div>
      </div>
      
      <div class="container about-hero__content">
        <div class="hero-badge">Nosotros</div>
        <h1 class="hero-title">
          <span class="line-wrap"><span>Health &</span></span>
          <span class="line-wrap"><span class="text-gradient">Life S.A.</span></span>
        </h1>
        <p class="hero-desc">
          Humanizamos la tecnología para cuidar lo más valioso: tu salud y la de tu familia.
        </p>
      </div>
    </section>

    <section class="story section-padding">
      <div class="container story__inner">
        <div class="story__text">
          <span class="section-label story__label">Nuestra esencia</span>
          <h2 class="section-title story__title">Pensando en <span class="text-gradient">su bienestar</span></h2>
          <div class="story__paragraphs">
            <p>
              HELISA representa el nacimiento de una vida más saludable. Nuestro propósito es
              ofrecer los mejores sistemas de tratamiento y purificación de agua y aire con
              respaldo de repuestos y atención personalizada en todo el Ecuador.
            </p>
            <p>
              Para nosotros el agua es movimiento, dinamismo, salud y energía. Cada sistema que
              instalamos lleva esa filosofía: transformar espacios para que respires y bebas con confianza.
            </p>
          </div>
        </div>

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
                <span class="story__badge-number">2003</span>
                <span class="story__badge-label">Desde</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="values section-padding">
      <div class="centered-wrapper">
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
      <div class="centered-wrapper">
        <div class="section-header">
          <span class="section-label">Historia</span>
          <h2 class="section-title">Nuestro <span class="text-gradient">camino</span></h2>
        </div>
        <div class="timeline__wrapper">
          <div class="timeline__line"></div>
          <div class="timeline__items">
            <div v-for="item in timeline" :key="item.year" class="timeline__item">
              <div class="timeline__dot"></div>
              <div class="timeline__content">
                <img :src="item.image" :alt="item.title" class="timeline__image" />
                <div class="timeline__text">
                  <span class="timeline__year">{{ item.year }}</span>
                  <h3 class="timeline__title">{{ item.title }}</h3>
                  <p class="timeline__desc">{{ item.desc }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.about-page {
  padding-top: 80px;
  background-color: $background;
  overflow: hidden;
  margin: 0 auto;
  width: 100%;
  max-width: 1920px;
}

/* HERO SECTION */
.about-hero {
  position: relative;
  padding: 8rem 0 4rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    pointer-events: none;
    overflow: hidden;
  }

  &__grid {
    position: absolute;
    inset: -50%;
    width: 200%;
    height: 200%;
    background-image:
      linear-gradient($border 1px, transparent 1px),
      linear-gradient(90deg, $border 1px, transparent 1px);
    background-size: 100px 100px;
    opacity: 0.4;
    transform: perspective(500px) rotateX(60deg) translateY(-100px) translateZ(-200px);
    animation: gridMove 20s linear infinite;
  }

  &__glow {
    position: absolute;
    top: -20%;
    left: 50%;
    transform: translateX(-50%);
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba($black, 0.03) 0%, transparent 70%);
    border-radius: 50%;
    filter: blur(60px);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 900px;
    width: 100%;
    margin: 0 auto;
  }
}

@keyframes gridMove {
  0% {
    transform: perspective(500px) rotateX(60deg) translateY(0) translateZ(-200px);
  }

  100% {
    transform: perspective(500px) rotateX(60deg) translateY(100px) translateZ(-200px);
  }
}

.hero-badge {
  @include label-pill;
  margin-bottom: 2rem;
  background: $white;
  border: 1px solid $border;
  box-shadow: 0 4px 20px rgba($black, 0.03);
}

.hero-title {
  font-family: $font-display;
  font-size: clamp(3.5rem, 10vw, 7.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: $primary;
  margin: 0 0 1.5rem;

  .line-wrap {
    display: block;
    overflow: hidden;
    padding-bottom: 0.1em;

    >span {
      display: inline-block;
      transform-origin: left bottom;
    }
  }
}

.hero-desc {
  font-family: $font-secondary;
  font-size: clamp(1.1rem, 2vw, 1.35rem);
  color: $foreground-muted;
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
}

/* STORY SECTION */
.story {
  position: relative;
  z-index: 2;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4rem;
    width: 100%;
    margin: 0 auto;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    max-width: 800px;
    gap: 1.5rem;
  }

  &__paragraphs {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    p {
      font-family: $font-secondary;
      font-size: 1.15rem;
      color: $foreground-muted;
      line-height: 1.7;
      margin: 0;

      @media (min-width: 768px) {
        font-size: 1.25rem;
      }
    }
  }

  &__visual {
    width: 100%;
    max-width: 1000px;
    position: relative;
  }

  &__frame {
    position: relative;
    width: 100%;
    padding: 1.5rem;
    background: rgba($white, 0.7);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    border: 1px solid rgba($white, 0.8);
    border-radius: 2rem;
    box-shadow:
      0 30px 60px rgba($black, 0.05),
      inset 0 0 0 1px rgba($white, 0.9);

    @media (min-width: 768px) {
      padding: 2rem;
      border-radius: 3rem;
    }
  }

  &__image {
    width: 100%;
    border-radius: 1.5rem;
    aspect-ratio: 16 / 9;
    object-fit: cover;
    display: block;

    @media (min-width: 768px) {
      border-radius: 2rem;
    }
  }

  &__badge {
    position: absolute;
    display: flex;
    align-items: center;
    background: $white;
    border: 1px solid $border;
    box-shadow: 0 20px 40px rgba($black, 0.1);
    z-index: 2;

    &--top {
      top: 0;
      right: 5%;
      padding: 0.75rem 1.25rem;
      border-radius: 100px;
      gap: 0.75rem;
      transform: translateY(-50%);
    }

    &--bottom {
      bottom: 0;
      left: 5%;
      padding: 1rem 1.5rem;
      border-radius: 24px;
      gap: 1rem;
      transform: translateY(30%);
    }

    &-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: $primary;
      box-shadow: 0 0 0 4px rgba($black, 0.1);
    }

    &-text {
      font-family: $font-secondary;
      font-size: 0.9rem;
      font-weight: 500;
      color: $primary;
      letter-spacing: 0.02em;
    }

    &-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 48px;
      height: 48px;
      background: $primary;
      border-radius: 14px;
      color: $white;
      font-size: 1.25rem;
      flex-shrink: 0;
    }

    &-body {
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    &-number {
      font-family: $font-display;
      font-size: 1.5rem;
      font-weight: 500;
      letter-spacing: -0.04em;
      color: $primary;
      line-height: 1;
    }

    &-label {
      font-family: $font-secondary;
      font-size: 0.75rem;
      color: $foreground-muted;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  margin-bottom: 4rem;
}

.section-title {
  font-family: $font-display;
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 500;
  color: $primary;
  margin: 0;
  letter-spacing: -0.03em;
}

/* VALUES SECTION */
.centered-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

.values {
  margin-top: 4rem;
  margin-bottom: 4rem;
  width: 100%;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    place-items: center;
    justify-content: center;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.value-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  background: rgba($white, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($border, 0.8);
  border-radius: 28px;
  padding: 2.5rem 1.5rem;
  flex: 1 1 220px;
  max-width: 300px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;
  outline: none;

  &:hover,
  &--active {
    background: $white;
    border-color: $white;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba($black, 0.05);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    background: $primary;
    border-radius: 20px;
    color: $white;
    font-size: 1.5rem;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__icon,
  &--active &__icon {
    transform: scale(1.1) rotate(5deg);
  }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 500;
    color: $primary;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.95rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

/* TIMELINE SECTION */
.timeline {
  &__wrapper {
    position: relative;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 0;
  }

  &__line {
    position: absolute;
    left: 24px;
    top: 0;
    bottom: 0;
    width: 2px;
    background: linear-gradient(to bottom, transparent, $border 10%, $border 90%, transparent);

    @media (min-width: 768px) {
      left: 50%;
      transform: translateX(-50%);
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__item {
    position: relative;
    padding-left: 60px;
    width: 100%;
    box-sizing: border-box;
  }

  &__dot {
    position: absolute;
    left: 17px;
    top: 24px;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background: $primary;
    border: 4px solid $background;
    box-shadow: 0 0 0 2px $border;
    z-index: 2;

    @media (min-width: 768px) {
      left: auto;
      right: -8px;
    }
  }

  &__content {
    background: rgba($white, 0.7);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($border, 0.8);
    border-radius: 24px;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: $white;
      transform: translateY(-4px) scale(1.02);
      box-shadow: 0 20px 40px rgba($black, 0.05);
    }

    @media (min-width: 768px) {
      grid-template-columns: minmax(180px, 240px) 1fr;
      align-items: center;
    }
  }

  &__image {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 18px;
    border: 1px solid rgba($border, 0.8);
  }

  &__text {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__year {
    display: block;
    font-family: $font-display;
    font-size: 2rem;
    font-weight: 500;
    color: $primary;
    margin-bottom: 0.5rem;
    letter-spacing: -0.04em;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 500;
    color: $primary;
    margin: 0 0 0.75rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
