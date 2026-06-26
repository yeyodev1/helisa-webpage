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
  {
    number: '01',
    title: 'Diagnóstico gratuito',
    desc: 'Analizamos tu agua y entorno para recomendar la solución ideal.',
  },
  {
    number: '02',
    title: 'Servicio técnico',
    desc: 'Personal especializado en instalación y mantenimiento a nivel nacional.',
  },
  {
    number: '03',
    title: 'Asesoría personalizada',
    desc: 'Te orientamos según tus necesidades específicas de hogar o industria.',
  },
  {
    number: '04',
    title: 'Laboratorio',
    desc: 'Análisis técnicos que respaldan cada recomendación.',
  },
  {
    number: '05',
    title: 'Envíos a domicilio',
    desc: 'Llegamos a todo el Ecuador con repuestos y equipos.',
  },
  {
    number: '06',
    title: 'Capacitaciones',
    desc: 'Formación en uso y mantenimiento de nuestros productos.',
  },
]

const featuredProjects = [
  {
    title: 'Petro Ecuador',
    category: 'Industria Petrolera',
    image: '/images/proyectos/petro-ecuador.png',
  },
  {
    title: 'Hospital Miguel H. Alcívar',
    category: 'Sector de Salud',
    image: '/images/proyectos/hospital-alcivar.jpg',
  },
  {
    title: 'Sonesta',
    category: 'Sector de Turismo',
    image: '/images/proyectos/sonesta.jpg',
  },
]

onMounted(() => {
  // Hero entrance
  gsap.timeline({ delay: 0.2 })
    .from('.hero__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__title-line', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero__visual', { scale: 1.05, opacity: 0, duration: 1.4, ease: 'power3.out' }, '-=1')

  // Marquee
  gsap.to('.marquee__track', { xPercent: -50, duration: 30, repeat: -1, ease: 'none' })

  // Reveal sections
  document.querySelectorAll('[data-reveal]').forEach((section) => {
    const items = section.querySelectorAll('.reveal-item')
    const tween = gsap.fromTo(items, {
      y: 32,
      opacity: 1,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      stagger: 0.08,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  // Stats counter
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
      onUpdate: () => {
        const current = Math.ceil(parseFloat(stat.textContent || '0'))
        stat.textContent = current + suffix
      },
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
      <div class="hero__grid-bg" />
      <div class="container hero__layout">
        <div class="hero__content">
          <span class="hero__label">Health &amp; Life S.A.</span>
          <h1 class="hero__title">
            <span class="hero__title-line">Agua Pura.</span>
            <span class="hero__title-line">Aire Limpio.</span>
            <span class="hero__title-line text-gradient">Vida Sana.</span>
          </h1>
          <p class="hero__subtitle">
            Sistemas de tratamiento y purificación con respaldo técnico
            y atención personalizada en todo el Ecuador.
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
          <div class="hero__image-frame">
            <img src="/images/nave-supersacos.jpg" alt="Instalaciones de tratamiento de agua" class="hero__image" />
          </div>
          <div class="hero__floating-card">
            <span class="hero__floating-number">15+</span>
            <span class="hero__floating-label">Años de experiencia</span>
          </div>
        </div>
      </div>

      <div class="hero__scroll">
        <span class="hero__scroll-text">Scroll</span>
        <div class="hero__scroll-line" />
      </div>
    </section>

    <section class="marquee">
      <div class="marquee__track">
        <span v-for="n in 4" :key="n" class="marquee__item">
          <i class="fa-solid fa-droplet"></i> Ozono <i class="fa-solid fa-sun"></i> UV <i class="fa-solid fa-filter"></i> Ósmosis Inversa <i class="fa-solid fa-water"></i> Filtración
        </span>
      </div>
    </section>

    <section class="services section-padding" data-reveal>
      <div class="container">
        <div class="section-header">
          <span class="section-label">Servicios</span>
          <h2 class="section-title">Soluciones pensadas<br><span class="text-gradient">en tu bienestar</span></h2>
        </div>
        <div class="services__grid">
          <article v-for="service in services" :key="service.number" class="service-card reveal-item">
            <span class="service-card__number">{{ service.number }}</span>
            <h3 class="service-card__title">{{ service.title }}</h3>
            <p class="service-card__desc">{{ service.desc }}</p>
          </article>
        </div>
      </div>
    </section>

    <section class="about-teaser section-padding" data-reveal>
      <div class="container about-teaser__grid">
        <div class="about-teaser__image-wrapper reveal-item">
          <img src="/images/nave-tarimas.jpg" alt="Almacén de insumos HELISA" class="about-teaser__image" />
        </div>
        <div class="about-teaser__text">
          <span class="section-label reveal-item">Nosotros</span>
          <h2 class="section-title reveal-item">Pensando en <span class="text-gradient">su bienestar</span></h2>
          <p class="about-teaser__paragraph reveal-item">
            HELISA — Health &amp; Life S.A. — ofrece los mejores sistemas de tratamiento y
            purificación de agua y aire con respaldo de repuestos y atención
            personalizada en todo el Ecuador.
          </p>
          <p class="about-teaser__paragraph reveal-item">
            Cada gota cuenta. Combinamos tecnología de punta con un equipo humano
            comprometido para transformar la calidad del agua y el aire de hogares e industrias.
          </p>
          <button class="btn btn--outline reveal-item" @click="navigate('/nosotros')">
            Conocer nuestra historia
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="stats section-padding" data-reveal>
      <div class="container stats__grid">
        <div v-for="stat in stats" :key="stat.label" class="stat reveal-item">
          <span class="stat__value" :data-value="stat.value">0</span>
          <span class="stat__label">{{ stat.label }}</span>
        </div>
      </div>
    </section>

    <section class="featured-projects section-padding" data-reveal>
      <div class="container">
        <div class="section-header section-header--row">
          <div>
            <span class="section-label">Proyectos</span>
            <h2 class="section-title">Experiencia en<br><span class="text-gradient">todo el Ecuador</span></h2>
          </div>
          <button class="btn btn--outline" @click="navigate('/proyectos')">
            Ver todos
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
        <div class="featured-projects__grid">
          <article
            v-for="(project, i) in featuredProjects"
            :key="project.title"
            :class="['featured-card', 'reveal-item', { 'featured-card--large': i === 0 }]"
          >
            <div class="featured-card__visual">
              <img :src="project.image" :alt="project.title" class="featured-card__image" />
              <div class="featured-card__overlay" />
            </div>
            <div class="featured-card__content">
              <span class="featured-card__category">{{ project.category }}</span>
              <h3 class="featured-card__title">{{ project.title }}</h3>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="cta section-padding" data-reveal>
      <div class="container">
        <div class="cta__inner">
          <div class="cta__content">
            <h2 class="cta__title reveal-item">
              Listo para respirar y beber mejor?
            </h2>
            <p class="cta__desc reveal-item">
              Agenda una asesoría gratuita y descubre la solución perfecta para ti.
            </p>
            <button class="btn btn--primary reveal-item" @click="navigate('/calificar')">
              Calificar y contactar
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 8rem 1.5rem 5rem;
  box-sizing: border-box;
  overflow: hidden;
  background: $white;
  border-bottom: 1px solid $border;

  @media (min-width: 768px) {
    padding: 10rem 3rem 6rem;
  }

  @media (min-width: 1024px) {
    padding: 10rem 4rem 6rem;
  }

  &__grid-bg {
    position: absolute;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient($gray-100 1px, transparent 1px),
      linear-gradient(90deg, $gray-100 1px, transparent 1px);
    background-size: 80px 80px;
    opacity: 0.5;
    mask-image: radial-gradient(ellipse 80% 70% at 70% 30%, $black 0%, transparent 70%);
  }

  &__layout {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
    width: 100%;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__label {
    @include label-pill;
    margin-bottom: 1.75rem;
  }

  &__title {
    margin: 0 0 1.5rem;
  }

  &__title-line {
    display: block;
    font-family: $font-display;
    font-size: clamp(2.75rem, 8vw, 5.5rem);
    font-weight: 500;
    line-height: 1.05;
    letter-spacing: -0.05em;
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: clamp(1rem, 1.4vw, 1.25rem);
    color: $foreground-muted;
    line-height: 1.7;
    max-width: 520px;
    margin: 0 auto 2rem;

    @media (min-width: 1024px) {
      margin: 0 0 2rem;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;

    @media (min-width: 1024px) {
      justify-content: flex-start;
    }
  }

  &__visual {
    position: relative;
    display: flex;
    justify-content: center;

    @media (min-width: 1024px) {
      justify-content: flex-end;
    }
  }

  &__image-frame {
    position: relative;
    width: 100%;
    max-width: 560px;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    border: 1px solid $border;

    @media (min-width: 1440px) {
      max-width: 640px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%);
  }

  &__floating-card {
    position: absolute;
    bottom: -20px;
    left: 0;
    display: flex;
    flex-direction: column;
    background: $white;
    border: 1px solid $border;
    border-radius: 16px;
    padding: 1.25rem 1.75rem;
    box-shadow: 0 20px 40px rgba($black, 0.06);

    @media (min-width: 1024px) {
      left: -40px;
    }
  }

  &__floating-number {
    font-family: $font-display;
    font-size: 2rem;
    font-weight: 500;
    letter-spacing: -0.04em;
    color: $black;
    line-height: 1;
  }

  &__floating-label {
    font-family: $font-secondary;
    font-size: 0.75rem;
    color: $foreground-muted;
    margin-top: 0.25rem;
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
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: $gray-400;
    }

    &-line {
      width: 1px;
      height: 50px;
      background: linear-gradient(to bottom, $gray-400, transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }
  }
}

@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(0.6); opacity: 0.3; }
}

.marquee {
  background: $black;
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

  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.service-card {
  position: relative;
  background: $white;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $black;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__number {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-family: $font-display;
    font-size: 0.85rem;
    font-weight: 500;
    color: $gray-300;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: $black;
    margin: 0 0 0.75rem;
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

.about-teaser {
  background: $white;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
    }
  }

  &__image-wrapper {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    border: 1px solid $border;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%);
  }

  &__text {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__paragraph {
    font-family: $font-secondary;
    font-size: 1.05rem;
    color: $foreground-muted;
    line-height: 1.8;
    margin: 0 0 1.25rem;
  }
}

.stats {
  background: $black;

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: rgba($white, 0.1);
    border-radius: 20px;
    overflow: hidden;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.stat {
  text-align: center;
  padding: 3rem 1rem;
  background: $black;

  &__value {
    display: block;
    font-family: $font-display;
    font-size: clamp(2.25rem, 4vw, 3.5rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    color: $white;
    margin-bottom: 0.5rem;
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: rgba($white, 0.5);
  }
}

.featured-projects {
  background: $background-soft;

  .section-header--row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    gap: 1.5rem;
    margin-bottom: 4rem;

    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-end;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: 1.2fr 1fr;
    }
  }
}

.featured-card {
  position: relative;
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
      grid-row: span 2;
    }
  }

  &__visual {
    position: relative;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: $gray-100;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba($black, 0.6) 0%, transparent 50%);
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 1.5rem;
  }

  &__category {
    display: inline-block;
    padding: 0.35rem 0.7rem;
    background: $white;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $black;
    margin-bottom: 0.75rem;
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

  &__inner {
    position: relative;
    border-radius: 28px;
    overflow: hidden;
    min-height: 420px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem;
    background: $black;
    border: 1px solid $border;
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 700px;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 500;
    color: $white;
    letter-spacing: -0.04em;
    line-height: 1.1;
    margin: 0 0 1.25rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($white, 0.6);
    line-height: 1.7;
    margin: 0 0 2rem;
  }
}

.reveal-item {
  opacity: 1;
  transform: translateY(0);
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
    background: $black;
    color: $white;

    &:hover {
      background: $gray-800;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($black, 0.15);
    }
  }

  &--ghost {
    background: transparent;
    color: $black;
    border: 1px solid $border;

    &:hover {
      border-color: $black;
      background: rgba($black, 0.03);
      transform: translateY(-2px);
    }
  }

  &--outline {
    background: transparent;
    color: $black;
    border: 1px solid $border;

    &:hover {
      border-color: $black;
      background: rgba($black, 0.03);
      transform: translateY(-2px);
    }
  }
}
</style>
