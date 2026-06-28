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
    id: 2,
    title: 'Campamento Petrolero',
    category: 'Industria Petrolera',
    location: 'Oriente',
    description: 'Planta de potabilización para campamentos en zonas remotas del país.',
    image: '/images/proyectos/repsol-duragas.png',
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
    id: 4,
    title: 'Tratamiento para Laboratorios',
    category: 'Laboratorios',
    location: 'Quito',
    description: 'Agua purificada para laboratorios de productos inyectables y análisis clínicos.',
    image: '/images/proyectos/laboratorio-indunidas.png',
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
    id: 6,
    title: 'Veterinaria Quito',
    category: 'Laboratorios',
    location: 'Quito',
    description: 'Equipo de doble columna para aplicaciones veterinarias especializadas.',
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
    id: 8,
    title: 'Agua Viva Portoviejo',
    category: 'Plantas Envasadoras',
    location: 'Portoviejo',
    description: 'Tratamiento de agua para planta embotelladora en Manabí.',
    image: '/images/proyectos/agua-latina-playas.jpg',
  },
  {
    id: 9,
    title: 'Planta en la Isla Puna',
    category: 'Plantas Envasadoras',
    location: 'Isla Puna',
    description: 'Sistema de purificación para producción de agua embotellada.',
    image: '/images/proyectos/agua-latina-playas.jpg',
  },
  {
    id: 10,
    title: 'Planta en Durán',
    category: 'Plantas Envasadoras',
    location: 'Durán',
    description: 'Planta envasadora con tecnología de ósmosis inversa.',
    image: '/images/proyectos/agua-latina-playas.jpg',
  },
  {
    id: 11,
    title: 'Oriente Orion Agua Residual',
    category: 'Potabilización y PTAR',
    location: 'Oriente',
    description: 'Planta de tratamiento de aguas residuales para operación petrolera.',
    image: '/images/proyectos/avicola-2007.jpg',
  },
  {
    id: 12,
    title: 'Tabacalera Bucay',
    category: 'Potabilización y PTAR',
    location: 'Bucay',
    description: 'Sistema de potabilización para procesos industriales de tabaco.',
    image: '/images/proyectos/avicola-2007.jpg',
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
    id: 14,
    title: 'Avícola en Bucay',
    category: 'Sector Agrícola',
    location: 'Bucay',
    description: 'Purificación de agua para producción avícola de alta escala.',
    image: '/images/proyectos/avicola-2007.jpg',
  },
  {
    id: 15,
    title: 'Avícola la Gloria',
    category: 'Sector Agrícola',
    location: 'Ecuador',
    description: 'Sistema integral de tratamiento para planta avícola.',
    image: '/images/proyectos/avicola-2007.jpg',
  },
  {
    id: 16,
    title: 'Centro de Diálisis',
    category: 'Sector de Salud',
    location: 'Ecuador',
    description: 'Agua ultrapura para equipos médicos de diálisis.',
    image: '/images/proyectos/hospital-alcivar.jpg',
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
    id: 18,
    title: 'Hospital Pasaje',
    category: 'Sector de Salud',
    location: 'Pasaje',
    description: 'Área de salud equipada con purificación especializada.',
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
    id: 21,
    title: 'Universidad de Guayaquil',
    category: 'Sector Educativo',
    location: 'Guayaquil',
    description: 'Planta de tratamiento para campus universitario.',
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
    { opacity: 1, y: 24 },
    { opacity: 1, y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out' },
  )
}

onMounted(() => {
  const headerTl = gsap.timeline()
  headerTl
    .from('.projects-header__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.projects-header__title', { y: 80, opacity: 0, duration: 1.2, ease: 'power4.out' }, '-=0.5')
    .from('.projects-header__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.7')
    .from('.projects-header__filters', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.projects-header__visual', { scale: 1.05, opacity: 0, duration: 1.2, ease: 'power3.out' }, '-=1')

  document.querySelectorAll('.project-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 40,
      opacity: 1,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' },
      delay: (i % 3) * 0.06,
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.projects-stat').forEach((stat, i) => {
    const tween = gsap.fromTo(stat, {
      y: 24,
      opacity: 1,
    }, {
      y: 0,
      opacity: 1,
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
    <section class="projects-header">
      <div class="projects-header__bg">
        <div class="projects-header__grid" />
      </div>

      <div class="container projects-header__content">
        <div class="projects-header__copy">
          <span class="projects-header__label">Portafolio</span>
          <h1 class="projects-header__title">
            <span class="split-line">Proyectos que</span>
            <span class="split-line text-gradient">transforman vidas</span>
          </h1>
          <p class="projects-header__desc">
            Más de 15 años instalando sistemas de tratamiento de agua y aire en los sectores más exigentes del Ecuador.
          </p>

          <div class="projects-header__filters">
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

        <div class="projects-header__visual">
          <div class="projects-header__frame">
            <img src="/images/proyectos/petro-ecuador.png" alt="Proyecto destacado HELISA" class="projects-header__image" />

            <div class="projects-header__badge projects-header__badge--top">
              <span class="projects-header__badge-dot"></span>
              <span class="projects-header__badge-text">En operación</span>
            </div>

            <div class="projects-header__badge projects-header__badge--bottom">
              <div class="projects-header__badge-icon">
                <i class="fa-solid fa-industry"></i>
              </div>
              <div class="projects-header__badge-body">
                <span class="projects-header__badge-number">500+</span>
                <span class="projects-header__badge-label">Proyectos ejecutados</span>
              </div>
            </div>
          </div>

          <div class="projects-header__ring" aria-hidden="true"></div>
        </div>
      </div>
    </section>

    <section class="projects-grid section-padding">
      <div class="container">
        <div v-if="filteredProjects.length === 0" class="projects-empty">
          <p>No encontramos proyectos para esta búsqueda.</p>
        </div>
        <div v-else class="projects-grid__layout">
          <article
            v-for="(project, index) in filteredProjects"
            :key="project.id"
            :class="['project-card', { 'project-card--large': index % 5 === 0 }]"
          >
            <div class="project-card__frame">
              <div class="project-card__visual">
                <img :src="project.image" :alt="project.title" class="project-card__image" loading="lazy" />
                <div class="project-card__overlay" />
                <span class="project-card__category">{{ project.category }}</span>
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
            <span class="projects-stat__value">15+</span>
            <span class="projects-stat__label">Años de experiencia</span>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-clipboard-check"></i>
            </div>
            <span class="projects-stat__value">500+</span>
            <span class="projects-stat__label">Proyectos ejecutados</span>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-layer-group"></i>
            </div>
            <span class="projects-stat__value">10</span>
            <span class="projects-stat__label">Sectores atendidos</span>
          </div>
          <div class="projects-stat">
            <div class="projects-stat__icon">
              <i class="fa-solid fa-headset"></i>
            </div>
            <span class="projects-stat__value">24/7</span>
            <span class="projects-stat__label">Soporte técnico</span>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.projects-page {
  padding-top: 80px;
}

.projects-header {
  position: relative;
  min-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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
    opacity: 0.6;
    mask-image: radial-gradient(ellipse 80% 70% at 20% 0%, $black 0%, transparent 70%);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    width: 100%;
    max-width: 1280px;
    padding: 8rem 1.5rem 5rem;
    box-sizing: border-box;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      text-align: left;
      padding: 10rem 3rem 6rem;
      gap: 5rem;
    }
  }

  &__copy {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1.5rem;
    max-width: 640px;

    @media (min-width: 1024px) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__label {
    @include label-pill;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.75rem, 9vw, 5.5rem);
    font-weight: 500;
    letter-spacing: -0.05em;
    line-height: 1.05;
    margin: 0;

    .split-line {
      display: block;
    }
  }

  &__desc {
    font-family: $font-secondary;
    font-size: clamp(1rem, 1.5vw, 1.25rem);
    color: $foreground-muted;
    max-width: 520px;
    margin: 0;
    line-height: 1.7;
  }

  &__filters {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    width: 100%;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
    }
  }

  &__visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    max-width: 480px;
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
    animation: projectsRingRotate 60s linear infinite;
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

  @keyframes projectsRingRotate {
    from { transform: translate(15%, -10%) rotate(0deg); }
    to { transform: translate(15%, -10%) rotate(360deg); }
  }
}

.category-tabs {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;

  @media (min-width: 1024px) {
    justify-content: flex-start;
  }
}

.category-tab {
  padding: 0.55rem 1rem;
  background: transparent;
  border: 1px solid $border;
  border-radius: 100px;
  font-family: $font-secondary;
  font-size: 0.75rem;
  font-weight: 500;
  color: $foreground-muted;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  white-space: nowrap;

  &:hover {
    border-color: $black;
    color: $black;
  }

  &--active {
    background: $black;
    border-color: $black;
    color: $white;
  }
}

.search-field {
  position: relative;
  width: 100%;
  max-width: 320px;

  &__icon {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: $gray-400;
    font-size: 0.85rem;
  }

  &__input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $black;
    outline: none;
    transition: all 0.3s;

    &::placeholder {
      color: $gray-400;
    }

    &:focus {
      border-color: $black;
      box-shadow: 0 0 0 3px $ring;
    }
  }
}

.projects-grid {
  background: $background-soft;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1280px;
  }

  &__layout {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    width: 100%;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.projects-empty {
  text-align: center;
  padding: 5rem 1rem;
  color: $foreground-muted;
  font-family: $font-secondary;
}

.project-card {
  position: relative;
  padding: 0.75rem;
  background: $white;
  border: 1px solid $border;
  border-radius: 28px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $gray-300;
    transform: translateY(-6px);
    box-shadow: 0 30px 60px rgba($black, 0.08);

    .project-card__image {
      transform: scale(1.05);
    }
  }

  &--large {
    @media (min-width: 1024px) {
      grid-column: span 2;

      .project-card__visual {
        aspect-ratio: 21 / 9;
      }
    }
  }

  &__frame {
    overflow: hidden;
    border-radius: 20px;
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
    background: linear-gradient(to top, rgba($black, 0.5) 0%, transparent 50%);
  }

  &__category {
    position: absolute;
    top: 1rem;
    left: 1rem;
    padding: 0.4rem 0.8rem;
    background: $white;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.65rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: $black;
  }

  &__content {
    padding: 1.5rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 500;
    letter-spacing: -0.02em;
    color: $black;
    margin: 0 0 0.35rem;
  }

  &__location {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-family: $font-secondary;
    font-size: 0.75rem;
    color: $gray-500;
    margin: 0 0 0.75rem;

    i {
      font-size: 0.7rem;
    }
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}

.projects-stats {
  background: $white;
  border-top: 1px solid $border;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1280px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    width: 100%;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.projects-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  text-align: center;
  padding: 2rem 1rem;
  border: 1px solid $border;
  border-radius: 20px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $black;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 48px;
    height: 48px;
    background: $black;
    border-radius: 14px;
    color: $white;
    font-size: 1.1rem;
  }

  &__value {
    display: block;
    font-family: $font-display;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 500;
    letter-spacing: -0.04em;
    color: $black;
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: $foreground-muted;
  }
}
</style>
