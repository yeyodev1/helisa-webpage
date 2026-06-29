<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const triggers: ScrollTrigger[] = []

const navigate = (path: string) => router.push(path)

const stats = [
  { value: '15+', label: 'Años de experiencia' },
  { value: '100%', label: 'Atención personalizada' },
  { value: '24/7', label: 'Soporte técnico' },
  { value: '10K+', label: 'Clientes satisfechos' },
]

const services = [
  { number: '01', title: 'Diagnóstico gratuito', desc: 'Analizamos tu agua y entorno para recomendar la solución ideal.' },
  { number: '02', title: 'Servicio técnico', desc: 'Personal especializado en instalación y mantenimiento a nivel nacional.' },
  { number: '03', title: 'Asesoría personalizada', desc: 'Te orientamos según tus necesidades específicas de hogar o industria.' },
  { number: '04', title: 'Laboratorio', desc: 'Análisis técnicos que respaldan cada recomendación.' },
  { number: '05', title: 'Envíos a domicilio', desc: 'Llegamos a todo el Ecuador con repuestos y equipos.' },
  { number: '06', title: 'Capacitaciones', desc: 'Formación en uso y mantenimiento de nuestros productos.' },
]

const featuredProjects = [
  { title: 'Petro Ecuador', category: 'Industria Petrolera', image: '/images/proyectos/petro-ecuador.png' },
  { title: 'Hospital Miguel H. Alcívar', category: 'Sector de Salud', image: '/images/proyectos/hospital-alcivar.jpg' },
  { title: 'Sonesta', category: 'Sector de Turismo', image: '/images/proyectos/sonesta.jpg' },
]

onMounted(() => {
  gsap.timeline({ delay: 0.2 })
    .from('.hero__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__title-line', { y: 80, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero__image', { scale: 1.05, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')

  gsap.to('.marquee__track', { xPercent: -50, duration: 30, repeat: -1, ease: 'none' })

  document.querySelectorAll('[data-reveal]').forEach((section) => {
    const items = section.querySelectorAll('.reveal-item')
    const tween = gsap.fromTo(items, { y: 24, opacity: 1 }, {
      y: 0, opacity: 1, duration: 0.7, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: section, start: 'top 85%', toggleActions: 'play none none none' },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.stat__value').forEach((stat) => {
    const targetText = stat.getAttribute('data-value') || '0'
    const numericTarget = parseInt(targetText.replace(/\D/g, ''), 10) || 0
    const suffix = targetText.replace(/[0-9]/g, '')
    const counter = gsap.to(stat, {
      innerText: numericTarget,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: stat, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate: () => { stat.textContent = Math.ceil(parseFloat(stat.textContent || '0')) + suffix },
    })
    if (counter.scrollTrigger) triggers.push(counter.scrollTrigger)
  })
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero__content">
        <span class="hero__label">Health &amp; Life S.A.</span>
        <h1 class="hero__title">
          <span class="hero__title-line">Agua Pura.</span>
          <span class="hero__title-line">Aire Limpio.</span>
          <span class="hero__title-line text-gradient">Vida Sana.</span>
        </h1>
        <p class="hero__subtitle">
          Sistemas de tratamiento y purificación con respaldo técnico y atención personalizada en todo el Ecuador.
        </p>
        <div class="hero__actions">
          <button class="btn btn--primary" @click="navigate('/productos')">
            Explorar productos
            <i class="fa-solid fa-arrow-right"></i>
          </button>
          <button class="btn btn--ghost" @click="navigate('/proyectos')">
            Ver proyectos
          </button>
        </div>
      </div>

      <div class="hero__visual">
        <div class="hero__frame">
          <img src="/images/nave-supersacos.jpg" alt="Instalaciones HELISA" class="hero__image" />

          <div class="hero__badge hero__badge--top">
            <span class="hero__badge-dot"></span>
            <span class="hero__badge-text">Ecuador</span>
          </div>

          <div class="hero__badge hero__badge--bottom">
            <div class="hero__badge-icon">
              <i class="fa-solid fa-award"></i>
            </div>
            <div class="hero__badge-body">
              <span class="hero__badge-number">15+</span>
              <span class="hero__badge-label">Años de experiencia</span>
            </div>
          </div>
        </div>

        <div class="hero__ring" aria-hidden="true"></div>
      </div>
    </section>

    <section class="marquee">
      <div class="marquee__track">
        <span v-for="n in 4" :key="n" class="marquee__item">
          <i class="fa-solid fa-droplet"></i> Ozono <i class="fa-solid fa-sun"></i> UV <i class="fa-solid fa-filter"></i> Ósmosis Inversa <i class="fa-solid fa-water"></i> Filtración
        </span>
      </div>
    </section>

    <section class="services" data-reveal>
      <div class="container">
        <div class="section-header">
          <span class="section-label">Servicios</span>
          <h2 class="section-title">Soluciones pensadas en tu bienestar</h2>
        </div>
        <div class="cards">
          <article v-for="service in services" :key="service.number" class="card reveal-item">
            <span class="card__number">{{ service.number }}</span>
            <h3 class="card__title">{{ service.title }}</h3>
            <p class="card__desc">{{ service.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about" data-reveal>
      <div class="container about__inner">
        <img src="/images/nave-tarimas.jpg" alt="Almacén HELISA" class="about__image reveal-item" />
        <div class="about__text">
          <span class="section-label reveal-item">Nosotros</span>
          <h2 class="section-title reveal-item">Pensando en <span class="text-gradient">su bienestar</span></h2>
          <p class="reveal-item">
            HELISA — Health &amp; Life S.A. — ofrece los mejores sistemas de tratamiento y purificación de agua y aire con respaldo de repuestos y atención personalizada en todo el Ecuador.
          </p>
          <p class="reveal-item">
            Cada gota cuenta. Combinamos tecnología de punta con un equipo humano comprometido para transformar la calidad del agua y el aire de hogares e industrias.
          </p>
          <button class="btn btn--outline reveal-item" @click="navigate('/nosotros')">
            Conocer nuestra historia
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="stats" data-reveal>
      <div class="container stats__inner">
        <div v-for="stat in stats" :key="stat.label" class="stat reveal-item">
          <span class="stat__value" :data-value="stat.value">0</span>
          <span class="stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <section class="featured" data-reveal>
      <div class="container">
        <div class="section-header section-header--row">
          <div>
            <span class="section-label">Proyectos</span>
            <h2 class="section-title">Experiencia en <span class="text-gradient">todo el Ecuador</span></h2>
          </div>
          <button class="btn btn--outline" @click="navigate('/proyectos')">
            Ver todos
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="featured__grid">
          <article v-for="(project, i) in featuredProjects" :key="project.title" :class="['featured-card', 'reveal-item', { 'featured-card--large': i === 0 }]">
            <div class="featured-card__visual">
              <img :src="project.image" :alt="project.title" class="featured-card__image" />
            </div>
            <div class="featured-card__content">
              <span class="featured-card__category">{{ project.category }}</span>
              <h3 class="featured-card__title">{{ project.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta" data-reveal>
      <div class="container cta__inner">
        <h2 class="cta__title reveal-item">Listo para respirar y beber mejor?</h2>
        <p class="cta__desc reveal-item">Agenda una asesoría gratuita y descubre la solución perfecta para ti.</p>
        <button class="btn btn--primary reveal-item" @click="navigate('/calificar')">
          Calificar y contactar
          <i class="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.home {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6rem;
  width: 100%;
}

section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 1280px;
  gap: 3rem;
  margin: 0 auto;
}

.section-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 0.75rem;
  max-width: 700px;
}

.section-header--row {
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-end;
    width: 100%;
    max-width: none;
    text-align: left;
  }
}

.hero {
  min-height: 100vh;
  padding: 8rem 1.5rem 4rem;
  gap: 3rem;
  background: $white;
  border-bottom: 1px solid $border;
  text-align: center;

  @media (min-width: 1024px) {
    flex-direction: row;
    justify-content: center;
    align-items: center;
    text-align: left;
    padding: 8rem 4rem;
    gap: 5rem;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    max-width: 600px;

    @media (min-width: 1024px) {
      align-items: flex-start;
    }
  }

  &__label {
    @include label-pill;
  }

  &__title {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    margin: 0;
  }

  &__title-line {
    font-family: $font-display;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.05em;
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    color: $foreground-muted;
    line-height: 1.7;
    margin: 0;
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
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
    animation: heroRingRotate 60s linear infinite;
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
      top: 0.5rem;
      right: 0.5rem;
      padding: 0.6rem 1rem;

      @media (min-width: 1024px) {
        top: 0;
        right: -1rem;
      }
    }

    &--bottom {
      bottom: 0.5rem;
      left: 0.5rem;
      padding: 0.85rem 1.25rem;
      border-radius: 20px;
      gap: 1rem;

      @media (min-width: 1024px) {
        bottom: 0;
        left: -2.5rem;
      }
    }

    &-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: $primary;
      box-shadow: 0 0 0 4px rgba($black, 0.08);
    }

    &-text {
      font-family: $font-secondary;
      font-size: 0.8rem;
      font-weight: 500;
      color: $primary;
      letter-spacing: 0.02em;
    }

    &-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      width: 44px;
      height: 44px;
      background: $primary;
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
      color: $primary;
      line-height: 1;
    }

    &-label {
      font-family: $font-secondary;
      font-size: 0.7rem;
      color: $foreground-muted;
    }
  }

  @keyframes heroRingRotate {
    from {
      transform: translate(15%, -10%) rotate(0deg);
    }

    to {
      transform: translate(15%, -10%) rotate(360deg);
    }
  }
}

.marquee {
  background: $primary;
  padding: 1.5rem 0;
  overflow: hidden;

  &__track {
    display: flex;
    width: max-content;
    gap: 2rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: $font-display;
    font-size: clamp(1rem, 2vw, 1.35rem);
    font-weight: 400;
    color: rgba($white, 0.6);
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.1em;

    i {
      color: $white;
      opacity: 0.4;
    }
  }
}

.services {
  background: $background-soft;
  padding: 5rem 1.5rem;
}

.cards {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.25rem;
  width: 100%;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1 1 280px;
  max-width: 380px;
  background: $white;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $primary;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__number {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-family: $font-display;
    font-size: 0.85rem;
    color: $gray-300;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.2rem;
    font-weight: 500;
    color: $primary;
    margin: 0;
    padding-right: 2rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

.about {
  background: $white;
  padding: 5rem 1.5rem;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3rem;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      justify-content: center;
      gap: 5rem;
    }
  }

  &__image {
    width: 100%;
    max-width: 520px;
    border-radius: 24px;
    border: 1px solid $border;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  &__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    max-width: 520px;
    text-align: center;

    @media (min-width: 1024px) {
      align-items: flex-start;
      text-align: left;
    }

    p {
      font-family: $font-secondary;
      font-size: 1rem;
      color: $foreground-muted;
      line-height: 1.8;
      margin: 0;
    }
  }
}

.stats {
  position: relative;
  background: $primary;
  padding: 8rem 1.5rem;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 60vw;
    height: 60vw;
    background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 60%);
    border-radius: 50%;
    pointer-events: none;
  }

  &__inner {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    
    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      gap: 1.5rem;
    }
  }
}

.stat {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  border-radius: 24px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;

  &:hover {
    background: rgba(255, 255, 255, 0.03);
    transform: translateY(-10px);
    
    .stat__value {
      color: $white;
      -webkit-text-stroke: 1px transparent;
      text-shadow: 0 10px 40px rgba(255, 255, 255, 0.15);
    }
    
    .stat__label {
      color: $white;
      letter-spacing: 0.15em;
    }
  }

  &__value {
    font-family: $font-display;
    font-size: clamp(3.5rem, 8vw, 6rem);
    font-weight: 500;
    letter-spacing: -0.05em;
    line-height: 1;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.4);
    margin-bottom: 1.5rem;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255, 255, 255, 0.5);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    display: flex;
    align-items: center;
    gap: 0.75rem;

    &::before, &::after {
      content: '';
      display: block;
      width: 24px;
      height: 1px;
      background: rgba(255, 255, 255, 0.2);
      transition: all 0.5s;
    }
  }

  &:hover &__label::before,
  &:hover &__label::after {
    width: 40px;
    background: rgba(255, 255, 255, 0.6);
  }
}

.featured {
  background: $background-soft;
  padding: 5rem 1.5rem;

  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
  }
}

.featured-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  flex: 1 1 300px;
  max-width: 100%;
  min-height: 320px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid $border;
  cursor: pointer;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 30px 60px rgba($black, 0.08);

    .featured-card__image {
      transform: scale(1.05);
    }
  }

  &--large {
    @media (min-width: 1024px) {
      flex: 2 1 540px;
      min-height: 500px;
    }
  }

  &__visual {
    position: absolute;
    inset: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1.5rem;
    background: linear-gradient(to top, rgba($black, 0.7), transparent);
  }

  &__category {
    align-self: flex-start;
    padding: 0.35rem 0.7rem;
    background: $white;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $primary;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: $white;
    margin: 0;
  }
}

.cta {
  background: $white;
  padding: 0 1.5rem 5rem;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    text-align: center;
    width: 100%;
    max-width: 900px;
    padding: 5rem 2rem;
    background: $primary;
    border-radius: 28px;
    border: 1px solid $border;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 500;
    color: $white;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($white, 0.6);
    line-height: 1.7;
    margin: 0;
    max-width: 600px;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 100px;
  font-family: $font-secondary;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &--primary {
    background: $primary;
    color: $white;

    &:hover {
      background: $primary-dark;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($black, 0.15);
    }
  }

  &--ghost {
    background: transparent;
    color: $primary;
    border: 1px solid $border;

    &:hover {
      border-color: $primary;
      background: rgba($black, 0.03);
      transform: translateY(-2px);
    }
  }

  &--outline {
    background: transparent;
    color: $primary;
    border: 1px solid $border;

    &:hover {
      border-color: $primary;
      background: rgba($black, 0.03);
      transform: translateY(-2px);
    }
  }
}

.reveal-item {
  opacity: 1;
  transform: translateY(0);
}
</style>
