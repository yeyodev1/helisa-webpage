<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getProjectBySlug } from '@/data/projects'
import { cloudinaryVariant } from '@/utils/cloudinary'

const route = useRoute()
const router = useRouter()

const project = computed(() => getProjectBySlug(String(route.params.slug || '')))

const mediaImages = computed(() => {
  const current = project.value
  if (!current) return []

  const baseImages = [current.image, ...current.gallery].filter(Boolean)
  const variants = baseImages.flatMap((url) => [
    url,
    cloudinaryVariant(url, 'c_fill,w_1400,h_980,g_auto'),
    cloudinaryVariant(url, 'c_fill,w_900,h_900,g_auto'),
  ])

  return Array.from(new Set(variants))
})

const heroImage = computed(() => mediaImages.value[0] ?? '')
const sideImages = computed(() => mediaImages.value.slice(1, 4))

const setTitle = () => {
  document.title = project.value ? `${project.value.title} | HELISA` : 'Proyecto | HELISA'
}

watch(project, setTitle, { immediate: true })
onMounted(setTitle)
</script>

<template>
  <main class="project-detail">
    <template v-if="project">
      <section class="project-detail__hero section-padding">
        <div class="container project-detail__back-row">
          <button type="button" class="project-detail__back" @click="router.push('/proyectos')">
            <i class="fa-solid fa-arrow-left"></i>
            Volver a proyectos
          </button>
        </div>

        <div class="container project-detail__hero-shell">
          <div class="project-detail__media">
            <div class="project-detail__media-main">
              <img :src="heroImage" :alt="project.title" class="project-detail__image" />
              <div class="project-detail__media-overlay">
                <span class="project-detail__eyebrow">{{ project.category }}</span>
                <h1 class="project-detail__title">{{ project.title }}</h1>
                <p class="project-detail__subtitle">{{ project.location }}</p>
              </div>
            </div>

            <div class="project-detail__media-stack">
              <img v-for="image in sideImages" :key="image" :src="image" :alt="project.title" class="project-detail__stack-image" />
            </div>
          </div>

          <aside class="project-detail__panel">
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
              <button type="button" class="btn btn--outline" @click="router.push('/proyectos')">Ver más proyectos</button>
            </div>
          </aside>
        </div>
      </section>

      <section class="project-detail__gallery section-padding">
        <div class="container">
          <div class="section-header">
            <span class="section-label">Galería</span>
            <h2 class="section-title">Más vistas del proyecto</h2>
          </div>

          <div class="project-detail__gallery-grid">
            <figure v-for="image in mediaImages.slice(0, 6)" :key="image" class="project-detail__gallery-item">
              <img :src="image" :alt="project.title" class="project-detail__gallery-image" />
            </figure>
          </div>
        </div>
      </section>

      <section class="project-detail__related section-padding">
        <div class="container project-detail__related-shell">
          <div>
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
        </div>
      </section>
    </template>

    <section v-else class="project-detail__empty section-padding">
      <div class="container project-detail__empty-card">
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
  background:
    radial-gradient(circle at top center, rgba($azul-medio, 0.07), transparent 35%),
    linear-gradient(180deg, $background 0%, rgba($white, 0.82) 100%);
  text-align: center;

  &__back-row {
    margin-bottom: 2rem;
    display: flex;
    justify-content: center;
  }

  &__back {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.85rem 1.5rem;
    border-radius: 999px;
    border: 1px solid $border;
    background: rgba($white, 0.9);
    color: $primary;
    font-family: $font-secondary;
    font-weight: 700;
    box-shadow: 0 10px 24px rgba($black, 0.05);
    transition: all 0.3s ease;

    &:hover {
      background: $white;
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba($black, 0.1);
    }
  }

  &__hero-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;

    @media (min-width: 1100px) {
      flex-direction: row;
      align-items: stretch;
      text-align: left;
    }
  }

  &__media {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    
    @media (min-width: 1100px) {
      flex: 1.15;
    }
  }

  &__media-main {
    position: relative;
    overflow: hidden;
    border-radius: 32px;
    min-height: 400px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    border: 1px solid $border;
    background: $white;
    box-shadow: 0 28px 60px rgba($black, 0.1);

    @media (min-width: 768px) {
      min-height: 520px;
    }
  }

  &__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__media-overlay {
    position: relative;
    padding: 2rem;
    background: linear-gradient(to top, rgba($black, 0.85), rgba($black, 0.2) 70%, transparent);
    color: $white;
    display: flex;
    flex-direction: column;
    align-items: center;

    @media (min-width: 1100px) {
      align-items: flex-start;
    }
  }

  &__eyebrow {
    display: inline-flex;
    padding: 0.5rem 1rem;
    border-radius: 999px;
    background: rgba($white, 0.15);
    backdrop-filter: blur(16px);
    font-family: $font-secondary;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 4.5rem);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin: 0 0 0.5rem;
  }

  &__subtitle {
    margin: 0;
    font-family: $font-secondary;
    font-size: 1rem;
    color: rgba($white, 0.9);
  }

  &__media-stack {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: center;
    }
  }

  &__stack-image {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 24px;
    border: 1px solid $border;
    background: $white;
    box-shadow: 0 18px 40px rgba($black, 0.08);

    @media (min-width: 640px) {
      flex: 1;
    }
  }

  &__panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
    padding: 2rem;
    border-radius: 30px;
    border: 1px solid $border;
    background: rgba($white, 0.95);
    box-shadow: 0 22px 45px rgba($black, 0.06);
    width: 100%;

    @media (min-width: 1100px) {
      flex: 0.85;
      position: sticky;
      top: 120px;
      align-items: flex-start;
      text-align: left;
    }
  }

  &__description {
    font-family: $font-secondary;
    font-size: 1.05rem;
    line-height: 1.8;
    color: $foreground-muted;
    margin: 0;
  }

  &__chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;

    @media (min-width: 1100px) {
      justify-content: flex-start;
    }
  }

  &__chip {
    padding: 0.6rem 1rem;
    border-radius: 999px;
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
    gap: 0.75rem;
    width: 100%;
  }

  &__highlight {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 1rem 1.25rem;
    border-radius: 18px;
    border: 1px solid rgba($border, 0.9);
    background: rgba($gris-fondo, 0.7);
    font-family: $font-secondary;
    color: $foreground;
    text-align: left;

    @media (min-width: 1100px) {
      justify-content: flex-start;
    }

    i {
      color: $azul-medio;
      font-size: 1.1rem;
    }
  }

  &__actions,
  &__related-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    @media (min-width: 640px) {
      flex-direction: row;
      justify-content: center;
    }

    @media (min-width: 1100px) {
      justify-content: flex-start;
    }
  }

  .btn {
    width: 100%;
    justify-content: center;

    @media (min-width: 640px) {
      width: auto;
    }
  }

  &__gallery {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__gallery-grid {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;

    @media (min-width: 640px) {
      flex-direction: row;
      flex-wrap: wrap;
      justify-content: center;
    }
  }

  &__gallery-item {
    margin: 0;
    width: 100%;

    @media (min-width: 640px) {
      width: calc(50% - 0.75rem);
    }

    @media (min-width: 1100px) {
      width: calc(33.333% - 1rem);
    }
  }

  &__gallery-image {
    width: 100%;
    display: block;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 24px;
    border: 1px solid $border;
    background: $white;
    box-shadow: 0 18px 36px rgba($black, 0.06);
    transition: transform 0.3s ease;

    &:hover {
      transform: scale(1.02);
    }
  }

  &__related {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__related-shell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    padding: 2.5rem 2rem;
    border-radius: 28px;
    border: 1px solid $border;
    background: rgba($white, 0.95);
    box-shadow: 0 18px 40px rgba($black, 0.05);
    width: 100%;

    @media (min-width: 900px) {
      flex-direction: row;
      justify-content: space-between;
      text-align: left;
    }
  }

  &__related-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 1.5rem;
    border-radius: 999px;
    border: 1px solid $border;
    background: $white;
    color: $primary;
    font-family: $font-secondary;
    font-weight: 700;
    box-shadow: 0 10px 24px rgba($black, 0.04);
    transition: all 0.3s ease;
    width: 100%;

    @media (min-width: 640px) {
      width: auto;
    }

    &:hover {
      background: rgba($primary, 0.05);
      transform: translateY(-2px);
    }
  }

  &__empty {
    width: 100%;
    display: flex;
    justify-content: center;
  }

  &__empty-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    max-width: 680px;
    padding: 3rem 2rem;
    border-radius: 28px;
    border: 1px solid $border;
    background: rgba($white, 0.95);
    box-shadow: 0 18px 40px rgba($black, 0.06);
    width: 100%;
  }
}
</style>
