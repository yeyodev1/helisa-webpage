<script setup lang="ts">
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { projects as staticProjects, type Project } from '@/data/projects'
import { projectsService } from '@/services/projectsService'

const route = useRoute()
const router = useRouter()

const dynamicProject = ref<Project | null>(null)

const staticProject = computed(() => staticProjects.find((p) => p.slug === String(route.params.slug || '')))
const project = computed(() => dynamicProject.value || staticProject.value)

const fetchDynamicProject = async () => {
  try {
    const slug = String(route.params.slug || '')
    const p = await projectsService.getProjectBySlug(slug)
    if (p) {
      dynamicProject.value = {
        id: 1,
        slug: p.slug,
        title: p.title,
        category: p.category,
        location: p.location,
        description: p.description,
        image: p.image,
        gallery: p.gallery || [p.image],
        highlights: p.highlights || [],
        relatedProducts: p.relatedProducts || [],
      }
    }
  } catch (e) {
    // Fallback to staticProject
  }
}

onMounted(() => {
  fetchDynamicProject()
})

const mediaImages = computed(() => {
  const current = project.value
  if (!current) return []

  return Array.from(new Set([current.image, ...current.gallery].filter(Boolean)))
})

const heroImage = computed(() => mediaImages.value[0] ?? '')

const setTitle = () => {
  document.title = project.value ? `${project.value.title} | HELISA` : 'Proyecto | HELISA'
}

watch(project, setTitle, { immediate: true })
onMounted(setTitle)
</script>

<template>
  <main class="project-detail">
    <template v-if="project">
      
      <!-- Back Button Section -->
      <section class="project-detail__top">
        <button type="button" class="project-detail__back" aria-label="Volver atrás" title="Volver" @click="router.back()">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
      </section>

      <!-- Hero & Info Section -->
      <section class="project-detail__hero">
        <div class="project-detail__hero-content">
          <span class="project-detail__eyebrow">{{ project.category }}</span>
          <h1 class="project-detail__title">{{ project.title }}</h1>
          <p class="project-detail__subtitle">{{ project.location }}</p>
        </div>

        <div class="project-detail__main-image-wrapper">
          <img :src="heroImage" :alt="project.title" class="project-detail__main-image" />
        </div>

        <div class="project-detail__info-panel">
          <span class="section-label">Ficha técnica</span>
          <p class="project-detail__description">{{ project.description }}</p>
          
          <div class="project-detail__chips">
            <span class="project-detail__chip">{{ project.category }}</span>
            <span v-if="project.location" class="project-detail__chip">{{ project.location }}</span>
            <span class="project-detail__chip">{{ project.gallery.length }} imagen(es)</span>
          </div>

          <div class="project-detail__highlights">
            <article v-for="item in project.highlights" :key="item" class="project-detail__highlight">
              <i class="fa-solid fa-circle-check"></i>
              <span>{{ item }}</span>
            </article>
          </div>

          <div class="project-detail__actions">
            <button type="button" class="btn btn--primary" @click="router.push('/calificar')">
              Solicitar información
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button type="button" class="btn btn--outline" @click="router.push('/proyectos')">
              Ver más proyectos
            </button>
          </div>
        </div>
      </section>

      <!-- Gallery Section -->
      <section class="project-detail__gallery">
        <div class="project-detail__section-header">
          <span class="section-label">Galería</span>
          <h2 class="section-title">Más vistas del proyecto</h2>
        </div>

        <div class="project-detail__gallery-grid">
          <figure v-for="image in mediaImages.slice(0, 6)" :key="image" class="project-detail__gallery-item">
            <img :src="image" :alt="project.title" class="project-detail__gallery-image" />
          </figure>
        </div>
      </section>

      <!-- Related Section -->
      <section class="project-detail__related">
        <div class="project-detail__section-header">
          <span class="section-label">Solución</span>
          <h2 class="section-title">Tecnologías relacionadas</h2>
        </div>

        <div class="project-detail__related-list">
          <button
            v-for="product in project.relatedProducts"
            :key="product.to"
            type="button"
            class="project-detail__related-link"
            @click="router.push(product.to)"
          >
            {{ product.label }}
          </button>
        </div>
      </section>
    </template>

    <section v-else class="project-detail__empty">
      <div class="project-detail__empty-card">
        <span class="section-label">Proyecto</span>
        <h1 class="section-title">Proyecto no encontrado</h1>
        <p>No encontramos ese proyecto dentro del portafolio disponible.</p>
        <button type="button" class="btn btn--primary" @click="router.push('/proyectos')">Volver</button>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.project-detail {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background:
    radial-gradient(circle at top center, rgba($azul-medio, 0.07), transparent 35%),
    linear-gradient(180deg, $background 0%, rgba($white, 0.82) 100%);
  padding: 6rem 1rem 3rem;
  
  &__top {
    width: 100%;
    max-width: 1200px;
    display: flex;
    justify-content: flex-start;
    margin-bottom: 2rem;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    padding: 0;
    border-radius: 50%;
    border: 1px solid $border;
    background: $white;
    color: $primary;
    box-shadow: 0 4px 15px rgba($black, 0.05);
    transition: all 0.3s ease;
    cursor: pointer;
    font-size: 1.1rem;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba($black, 0.1);
      background: $primary;
      color: $white;
    }
  }

  &__hero {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    margin-bottom: 4rem;
  }

  &__hero-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  &__eyebrow {
    padding: 0.5rem 1rem;
    border-radius: 99px;
    background: $primary;
    color: $white;
    font-family: $font-secondary;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 4rem);
    line-height: 1.1;
    color: $foreground;
    margin: 0;
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: $foreground-muted;
    margin: 0;
  }

  &__main-image-wrapper {
    width: 100%;
    max-width: 900px;
    overflow: hidden;
    border-radius: 24px;
    box-shadow: 0 20px 40px rgba($black, 0.1);
    display: flex;
    justify-content: center;
  }

  &__main-image {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
    object-fit: cover;
    display: block;
  }

  &__info-panel {
    width: 100%;
    max-width: 800px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 24px;
    background: rgba($white, 0.9);
    border: 1px solid $border;
    box-shadow: 0 10px 30px rgba($black, 0.05);
  }

  &__description {
    font-family: $font-secondary;
    font-size: 1.1rem;
    line-height: 1.8;
    color: $foreground-muted;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
  }

  &__chip {
    padding: 0.5rem 1rem;
    border-radius: 99px;
    border: 1px solid $border;
    background: $white;
    color: $primary;
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 700;
  }

  &__highlights {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  &__highlight {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    background: rgba($gris-fondo, 0.5);
    border: 1px solid rgba($border, 0.5);
    color: $foreground;
    font-family: $font-secondary;
    width: 100%;
    max-width: 400px;

    i {
      color: $primary;
      font-size: 1.2rem;
    }
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    margin-top: 1rem;

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 2rem;
    border-radius: 99px;
    font-family: $font-secondary;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    border: none;
    text-decoration: none;

    &--primary {
      background: $primary;
      color: $white;
      &:hover {
        background: darken($primary, 10%);
        transform: translateY(-2px);
      }
    }

    &--outline {
      background: transparent;
      border: 2px solid $primary;
      color: $primary;
      &:hover {
        background: $primary;
        color: $white;
        transform: translateY(-2px);
      }
    }
  }

  &__section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
  }

  .section-label {
    font-family: $font-secondary;
    font-weight: 700;
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    font-size: 0.85rem;
  }

  .section-title {
    font-family: $font-display;
    font-size: clamp(1.8rem, 4vw, 2.5rem);
    color: $foreground;
    margin: 0;
  }

  &__gallery {
    width: 100%;
    max-width: 1200px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4rem;
  }

  &__gallery-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    width: 100%;

    @media (min-width: 768px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  &__gallery-item {
    width: 100%;
    max-width: 500px;
    margin: 0;
    display: flex;
    justify-content: center;

    @media (min-width: 768px) {
      width: calc(50% - 1rem);
    }
    
    @media (min-width: 1024px) {
      width: calc(33.333% - 1rem);
    }
  }

  &__gallery-image {
    width: 100%;
    height: auto;
    aspect-ratio: 4/3;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 10px 20px rgba($black, 0.08);
  }

  &__related {
    width: 100%;
    max-width: 1000px;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 3rem 1.5rem;
    background: rgba($white, 0.8);
    border: 1px solid $border;
    border-radius: 24px;
    box-shadow: 0 15px 30px rgba($black, 0.05);
    margin-bottom: 2rem;
  }

  &__related-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;

    @media (min-width: 640px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  &__related-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 2rem;
    border-radius: 99px;
    background: $white;
    border: 1px solid $border;
    color: $primary;
    font-family: $font-secondary;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 5px 15px rgba($black, 0.05);
    transition: all 0.3s ease;
    width: 100%;
    max-width: 300px;

    &:hover {
      background: $primary;
      color: $white;
      transform: translateY(-3px);
    }
  }

  &__empty {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 50vh;
  }

  &__empty-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 1rem;
    padding: 3rem 2rem;
    background: $white;
    border-radius: 24px;
    border: 1px solid $border;
    box-shadow: 0 20px 40px rgba($black, 0.05);
    width: 100%;
    max-width: 600px;
  }
}
</style>
