<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: number
  title: string
  category: string
  location?: string
  description: string
  image: string
}

const categories = [
  'Todos',
  'Industria Petrolera',
  'Laboratorios',
  'Plantas Envasadoras',
  'Potabilización y PTAR',
  'Sector Agrícola',
  'Sector de Salud',
  'Sector de Turismo',
  'Sector Educativo',
  'Sector Industrial',
  'Tratamiento Hogar',
]

const projects: Project[] = [
  {
    id: 1,
    title: 'Petro Ecuador',
    category: 'Industria Petrolera',
    location: 'Ecuador',
    description: 'Sistema de tratamiento de agua para operaciones petroleras con altos estándares de calidad.',
    image: '/images/proyectos/petro-ecuador.png',
  },
  {
    id: 3,
    title: 'Repsol Duragas',
    category: 'Industria Petrolera',
    location: 'Ecuador',
    description: 'Soluciones de filtración y tratamiento para procesos industriales.',
    image: '/images/proyectos/repsol-duragas.png',
  },
  {
    id: 5,
    title: 'Laboratorios Indunidas',
    category: 'Laboratorios',
    location: 'Ecuador',
    description: 'Sistema de desmineralización para procesos farmacéuticos.',
    image: '/images/proyectos/laboratorio-indunidas.png',
  },
  {
    id: 7,
    title: 'Agua Latina en Playas',
    category: 'Plantas Envasadoras',
    location: 'Playas',
    description: 'Planta envasadora con sistema completo de tratamiento y purificación.',
    image: '/images/proyectos/agua-latina-playas.jpg',
  },
  {
    id: 13,
    title: 'Avícola 2007',
    category: 'Sector Agrícola',
    location: 'Ecuador',
    description: 'Tratamiento de agua para procesos avícolas y faenamiento.',
    image: '/images/proyectos/avicola-2007.jpg',
  },
  {
    id: 17,
    title: 'Hospital Miguel H. Alcívar',
    category: 'Sector de Salud',
    location: 'Ecuador',
    description: 'Sistema de tratamiento de agua para áreas hospitalarias.',
    image: '/images/proyectos/hospital-alcivar.jpg',
  },
  {
    id: 19,
    title: 'Sonesta',
    category: 'Sector de Turismo',
    location: 'Ecuador',
    description: 'Tratamiento de agua para cadena hotelera de lujo.',
    image: '/images/proyectos/sonesta.jpg',
  },
  {
    id: 20,
    title: 'Colegio en Durán',
    category: 'Sector Educativo',
    location: 'Durán',
    description: 'Sistema de agua potable para institución educativa.',
    image: '/images/proyectos/colegio-duran.jpg',
  },
  {
    id: 22,
    title: 'Proyecto CELEC',
    category: 'Sector Industrial',
    location: 'Ecuador',
    description: 'Tratamiento de agua para procesos de generación eléctrica.',
    image: '/images/proyectos/celec.png',
  },
  {
    id: 23,
    title: 'Casa en Estancias del Río',
    category: 'Tratamiento Hogar',
    location: 'Samborondón',
    description: 'Sistema doméstico de purificación de agua completo.',
    image: '/images/proyectos/casa-estancias.jpg',
  },
  {
    id: 24,
    title: 'Edificio Helisa',
    category: 'Tratamiento Hogar',
    location: 'Guayaquil',
    description: 'Tratamiento integral de agua para edificio corporativo.',
    image: '/images/proyectos/edificio-helisa.jpg',
  },
]

const activeCategory = ref('Todos')
const searchQuery = ref('')
const triggers: ScrollTrigger[] = []

const filteredProjects = computed(() => {
  let result = projects
  if (activeCategory.value !== 'Todos') {
    result = result.filter((p) => p.category === activeCategory.value)
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    )
  }
  return result
})

const setCategory = (cat: string) => {
  activeCategory.value = cat
  gsap.fromTo(
    '.project-card',
    { opacity: 0, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
  )
}

onMounted(() => {
  const tl = gsap.timeline()
  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span > span', { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out', clipPath: 'inset(0% 0% 100% 0%)' }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.projects-filters', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')

  document.querySelectorAll('.project-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 100,
      opacity: 0,
      rotationX: 10,
      scale: 0.9,
      transformPerspective: 1000
    }, {
      y: 0,
      opacity: 1,
      rotationX: 0,
      scale: 1,
      duration: 1.2,
      ease: 'expo.out',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      delay: (i % 3) * 0.1,
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)

    const img = card.querySelector('.project-card__image')
    if (img) {
      const imgTween = gsap.fromTo(img, {
        yPercent: -15,
        scale: 1.15
      }, {
        yPercent: 15,
        ease: 'none',
        scrollTrigger: {
          trigger: card,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true
        }
      })
      if (imgTween.scrollTrigger) triggers.push(imgTween.scrollTrigger)
    }
  })

  document.querySelectorAll('.projects-stat').forEach((stat, i) => {
    const tween = gsap.fromTo(stat, {
      y: 30,
      opacity: 0,
      scale: 0.95
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.projects-stats', start: 'top 85%', toggleActions: 'play none none none' },
      delay: i * 0.1,
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <main class="projects-page">
    <section class="projects-hero">
      <div class="projects-hero__bg">
        <div class="projects-hero__grid"></div>
        <div class="projects-hero__glow"></div>
      </div>
      
      <div class="container projects-hero__content">
        <div class="hero-badge">Portafolio</div>
        <h1 class="hero-title">
          <span class="line-wrap"><span>Proyectos que</span></span>
          <span class="line-wrap"><span class="text-gradient">transforman vidas</span></span>
        </h1>
        <p class="hero-desc">
          Más de 15 años instalando sistemas de tratamiento de agua y aire en los sectores más exigentes del Ecuador.
        </p>

        <div class="projects-filters">
          <div class="category-tabs" role="tablist" aria-label="Filtrar proyectos por categoría">
            <button
              v-for="cat in categories"
              :key="cat"
              type="button"
              role="tab"
              :aria-selected="activeCategory === cat"
              :class="['category-tab', { 'category-tab--active': activeCategory === cat }]"
              @click="setCategory(cat)"
            >
              {{ cat }}
            </button>
          </div>
          <div class="search-field">
            <i class="fa-solid fa-magnifying-glass search-field__icon"></i>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Buscar proyecto..."
              class="search-field__input"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="projects-grid section-padding">
      <div class="container">
        <div v-if="filteredProjects.length === 0" class="projects-empty">
          <div class="projects-empty__icon"><i class="fa-solid fa-folder-open"></i></div>
          <p>No encontramos proyectos para esta búsqueda.</p>
        </div>
        <div v-else class="projects-grid__layout">
          <article
            v-for="project in filteredProjects"
            :key="project.id"
            class="project-card"
          >
            <div class="project-card__frame">
              <div class="project-card__visual">
                <img :src="project.image" :alt="project.title" class="project-card__image" loading="lazy" />
                <div class="project-card__overlay" />
                <div class="project-card__category-badge">
                  <i class="fa-solid fa-tag"></i>
                  <span>{{ project.category }}</span>
                </div>
              </div>
              <div class="project-card__content">
                <h3 class="project-card__title">{{ project.title }}</h3>
                <p v-if="project.location" class="project-card__location">
                  <i class="fa-solid fa-location-dot"></i>
                  {{ project.location }}
                </p>
                <p class="project-card__desc">{{ project.description }}</p>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="projects-stats section-padding">
      <div class="container">
        <div class="projects-stats__grid">
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-calendar-check"></i>
            </div>
            <div class="projects-stat__body">
              <span class="projects-stat__value">15+</span>
              <span class="projects-stat__label">Años de experiencia</span>
            </div>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <div class="projects-stat__body">
              <span class="projects-stat__value">500+</span>
              <span class="projects-stat__label">Proyectos ejecutados</span>
            </div>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <div class="projects-stat__body">
              <span class="projects-stat__value">10</span>
              <span class="projects-stat__label">Sectores atendidos</span>
            </div>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-headset"></i>
            </div>
            <div class="projects-stat__body">
              <span class="projects-stat__value">24/7</span>
              <span class="projects-stat__label">Soporte técnico</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.projects-page {
  padding-top: 80px;
  background-color: $background;
  overflow: hidden;
}

/* HERO SECTION */
.projects-hero {
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
    max-width: 1000px;
    width: 100%;
    padding: 0 1.5rem;
    box-sizing: border-box;
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
  font-size: clamp(3.5rem, 9vw, 7.5rem);
  font-weight: 500;
  line-height: 1.05;
  letter-spacing: -0.04em;
  color: $black;
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
  max-width: 700px;
  margin: 0 auto;
  line-height: 1.6;
}

.projects-filters {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  margin-top: 4rem;
  width: 100%;
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
}

.category-tab {
  padding: 0.65rem 1.25rem;
  background: rgba($white, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($border, 0.8);
  border-radius: 100px;
  font-family: $font-secondary;
  font-size: 0.85rem;
  font-weight: 500;
  color: $foreground-muted;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  &:hover {
    border-color: $black;
    color: $black;
    transform: translateY(-2px);
  }

  &--active {
    background: $black;
    border-color: $black;
    color: $white;
    box-shadow: 0 10px 20px rgba($black, 0.15);
  }
}

.search-field {
  position: relative;
  width: 100%;
  max-width: 400px;

  &__icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: $gray-400;
    font-size: 1rem;
  }

  &__input {
    width: 100%;
    padding: 1rem 1.5rem 1rem 3rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 1rem;
    color: $black;
    outline: none;
    transition: all 0.4s;
    box-shadow: 0 10px 30px rgba($black, 0.03);

    &::placeholder {
      color: $gray-400;
    }

    &:focus {
      border-color: $black;
      box-shadow: 0 10px 40px rgba($black, 0.1);
      transform: translateY(-2px);
    }
  }
}

.projects-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem;
  text-align: center;

  &__icon {
    font-size: 3rem;
    color: $gray-300;
    margin-bottom: 1.5rem;
  }

  p {
    font-family: $font-secondary;
    font-size: 1.25rem;
    color: $foreground-muted;
  }
}

.projects-grid {
  position: relative;
  z-index: 2;

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;
    width: 100%;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      margin: 0 auto;
      grid-template-columns: repeat(3, 1fr);
      gap: 3rem;
    }
  }
}

.project-card {
  display: flex;
  flex-direction: column;
  width: 100%;
  cursor: default;

  &__frame {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: rgba($white, 0.6);
    backdrop-filter: blur(20px);
    border: 1px solid rgba($white, 0.8);
    border-radius: 32px;
    padding: 1.25rem;
    box-shadow:
      0 20px 40px rgba($black, 0.04),
      inset 0 0 0 1px rgba($white, 0.5);
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover .project-card__frame {
    background: $white;
    transform: translateY(-8px);
    box-shadow: 0 30px 60px rgba($black, 0.08);
  }

  &__visual {
    position: relative;
    width: 100%;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    margin-bottom: 1.5rem;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__image {
    transform: scale(1.08);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba($black, 0.4), transparent 50%);
    opacity: 0;
    transition: opacity 0.5s;
  }

  &:hover &__overlay {
    opacity: 1;
  }

  &__category-badge {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: rgba($white, 0.9);
    backdrop-filter: blur(10px);
    padding: 0.5rem 1rem;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.75rem;
    font-weight: 600;
    color: $black;
    box-shadow: 0 10px 20px rgba($black, 0.1);
    transform: translateY(20px);
    opacity: 0;
    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__category-badge {
    transform: translateY(0);
    opacity: 1;
  }

  &__content {
    display: flex;
    flex-direction: column;
    padding: 0 0.75rem 1rem;
    flex: 1;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 0.5rem;
    letter-spacing: -0.02em;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $gray-500;
    margin: 0 0 1rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.95rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

.projects-stats {
  border-top: 1px solid $border;
  background: $white;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.projects-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.25rem;
  padding: 2.5rem;
  background: $background-soft;
  border-radius: 28px;
  border: 1px solid $border;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: $white;
    border-color: $black;
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba($black, 0.05);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 72px;
    height: 72px;
    background: $black;
    color: $white;
    border-radius: 24px;
    font-size: 1.75rem;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__icon {
    transform: scale(1.1) rotate(-5deg);
  }

  &__body {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  &__value {
    font-family: $font-display;
    font-size: 2.5rem;
    font-weight: 500;
    color: $black;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.95rem;
    color: $foreground-muted;
  }
}
</style>
