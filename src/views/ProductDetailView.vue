<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findProduct, productLines } from '@/data/products'

const route = useRoute()
const router = useRouter()
const selectedImage = ref('')

const result = computed(() => findProduct(String(route.params.category), String(route.params.product)))
const category = computed(() => result.value?.category)
const product = computed(() => result.value?.product)
const gallery = computed(() => Array.from(new Set(product.value?.gallery?.length ? product.value.gallery : [product.value?.image ?? ''])).filter(Boolean))
const lineName = computed(() => productLines.find((line) => line.id === category.value?.line)?.name)

watch(product, (value) => {
  if (!value) {
    router.replace('/productos')
    return
  }
  selectedImage.value = value.image
}, { immediate: true })
</script>

<template>
  <main v-if="product && category" class="detail-page">
    <section class="detail-hero">
      <div class="container detail-hero__inner">
        <nav class="breadcrumbs" aria-label="Migas de pan">
          <RouterLink to="/productos">Productos</RouterLink>
          <i class="fa-solid fa-chevron-right" aria-hidden="true" />
          <RouterLink :to="`/productos#${category.slug}`">{{ category.name }}</RouterLink>
          <i class="fa-solid fa-chevron-right" aria-hidden="true" />
          <span>{{ product.name }}</span>
        </nav>

        <div class="product-showcase">
          <div class="product-gallery">
            <div class="product-gallery__main">
              <img :src="selectedImage" :alt="product.name" />
            </div>
            <div v-if="gallery.length > 1" class="product-gallery__thumbs">
              <button
                v-for="image in gallery"
                :key="image"
                type="button"
                :class="{ active: selectedImage === image }"
                @click="selectedImage = image"
              >
                <img :src="image" :alt="`Vista de ${product.name}`" loading="lazy" />
              </button>
            </div>
          </div>

          <div class="product-info">
            <span class="product-info__line">{{ lineName }} / {{ category.name }}</span>
            <h1>{{ product.name }}</h1>
            <p v-if="product.description" class="product-info__description">{{ product.description }}</p>
            <p v-else class="product-info__description">Solicita información sobre disponibilidad, compatibilidad y aplicación de este producto.</p>
            <div v-if="product.availability" class="availability">
              <i class="fa-regular fa-clock" aria-hidden="true" />
              <span>{{ product.availability }}</span>
            </div>
            <RouterLink to="/calificar" class="quote-button">
              Solicitar cotización
              <i class="fa-solid fa-arrow-right" aria-hidden="true" />
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="product.features?.length || product.specs?.length" class="product-details section-padding">
      <div class="container product-details__inner">
        <article v-if="product.features?.length" class="detail-panel">
          <span>Información del producto</span>
          <h2>Características</h2>
          <div class="feature-list">
            <div v-for="feature in product.features" :key="feature">
              <i class="fa-solid fa-check" aria-hidden="true" />
              <p>{{ feature }}</p>
            </div>
          </div>
        </article>

        <article v-if="product.specs?.length" class="detail-panel detail-panel--specs">
          <span>Ficha técnica</span>
          <h2>Especificaciones</h2>
          <dl class="spec-list">
            <div v-for="spec in product.specs" :key="`${spec.label}-${spec.value}`">
              <dt>{{ spec.label }}</dt>
              <dd>{{ spec.value }}</dd>
            </div>
          </dl>
        </article>
      </div>
    </section>

    <section class="detail-cta">
      <div class="container detail-cta__inner">
        <div>
          <span>Asesoría especializada</span>
          <h2>¿Este equipo es adecuado para tu proyecto?</h2>
        </div>
        <RouterLink to="/calificar">Hablar con un asesor</RouterLink>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.detail-page {
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  background: $background;
}

.container { width: min(100% - 2rem, 1320px); margin: 0 auto; }

.detail-hero {
  padding: 3.5rem 0 3.5rem;

  &__inner { display: flex; flex-direction: column; }
}

.breadcrumbs {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  margin-bottom: 2.5rem;
  overflow: hidden;
  color: $foreground-muted;
  font: 0.75rem $font-secondary;
  white-space: nowrap;

  a { color: $foreground-muted; text-decoration: none; }
  a:hover { color: $primary; }
  span { overflow: hidden; color: $primary; text-overflow: ellipsis; }
  i { font-size: 0.55rem; }
}

.product-showcase {
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: clamp(2rem, 4vw, 4rem);
}

.product-gallery {
  flex: 1 1 55%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;

  &__main {
    height: clamp(400px, 48vw, 580px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: clamp(1rem, 4vw, 3rem);
    border: 1px solid $border;
    border-radius: 30px;
    background: linear-gradient(145deg, $background-soft, $white);
    overflow: hidden;

    img { width: 100%; height: 100%; object-fit: contain; }
  }

  &__thumbs {
    display: flex;
    gap: 0.75rem;
    overflow-x: auto;

    button {
      flex: 0 0 82px;
      height: 82px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem;
      border: 1px solid $border;
      border-radius: 12px;
      background: $white;
      cursor: pointer;
    }

    button.active { border-color: $primary; }
    img { width: 100%; height: 100%; object-fit: contain; }
  }
}

.product-info {
  flex: 1 1 45%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;

  &__line { color: $foreground-muted; font: 700 0.72rem $font-secondary; letter-spacing: 0.12em; text-transform: uppercase; }
  h1 { margin: 1rem 0 1.5rem; color: $primary; font: 500 clamp(2.7rem, 6vw, 5.8rem)/0.98 $font-display; letter-spacing: -0.05em; }
  &__description { max-width: 600px; margin: 0; color: $foreground-muted; font: 1rem/1.8 $font-secondary; }
}

.availability {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  margin-top: 1.5rem;
  padding: 0.9rem 1rem;
  border-radius: 12px;
  background: $background-soft;
  color: $foreground-muted;
  font: 0.82rem/1.5 $font-secondary;
}

.quote-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2rem;
  padding: 1rem 1.5rem;
  border-radius: 999px;
  background: $primary;
  color: $white;
  font: 700 0.9rem $font-secondary;
  text-decoration: none;
  transition: transform 0.25s ease, box-shadow 0.25s ease;

  &:hover { transform: translateY(-3px); box-shadow: 0 14px 30px rgba($black, 0.18); }
}

.product-details {
  background: $white;
  padding: 4rem 0 5rem;

  &__inner {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: center;
    gap: 1.5rem;
  }
}

.detail-panel {
  flex: 1 1 440px;
  padding: clamp(1.5rem, 4vw, 3rem);
  border: 1px solid $border;
  border-radius: 24px;

  > span { color: $foreground-muted; font: 700 0.7rem $font-secondary; letter-spacing: 0.12em; text-transform: uppercase; }
  h2 { margin: 0.65rem 0 2rem; color: $primary; font: 500 clamp(2rem, 4vw, 3.2rem) $font-display; letter-spacing: -0.035em; }
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;

  div { display: flex; align-items: flex-start; gap: 0.8rem; }
  i { width: 26px; height: 26px; flex: 0 0 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; background: rgba($verde, 0.12); color: $verde; font-size: 0.7rem; }
  p { margin: 0; color: $foreground-muted; font: 0.9rem/1.65 $font-secondary; }
}

.spec-list {
  display: flex;
  flex-direction: column;
  margin: 0;

  div { display: flex; align-items: baseline; justify-content: space-between; gap: 1.5rem; padding: 1rem 0; border-bottom: 1px solid $border; }
  div:first-child { padding-top: 0; }
  dt { color: $foreground-muted; font: 0.82rem $font-secondary; }
  dd { margin: 0; color: $primary; font: 700 0.88rem $font-secondary; text-align: right; }
}

.detail-cta {
  padding: 5rem 0;
  background: $primary;
  color: $white;

  &__inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 2rem; }
  span { color: rgba($white, 0.55); font: 700 0.7rem $font-secondary; letter-spacing: 0.12em; text-transform: uppercase; }
  h2 { max-width: 700px; margin: 0.8rem 0 0; font: 500 clamp(2rem, 4vw, 3.5rem)/1.1 $font-display; letter-spacing: -0.04em; }
  a { display: inline-flex; padding: 1rem 1.4rem; border-radius: 999px; background: $white; color: $primary; font: 700 0.88rem $font-secondary; text-decoration: none; }
}

@media (max-width: 800px) {
  .detail-page { padding-top: 70px; }
  .product-showcase { flex-direction: column; }
  .detail-hero { padding: 2.5rem 0 3rem; }
  .product-gallery__main { height: 420px; }
  .product-details { padding: 3.5rem 0 4rem; }
  .product-info { padding-top: 1rem; }
}

@media (max-width: 520px) {
  .detail-hero { padding-top: 2rem; }
  .product-gallery__main { height: 340px; border-radius: 20px; }
  .detail-panel { flex-basis: 100%; }
  .spec-list div { align-items: flex-start; flex-direction: column; gap: 0.3rem; }
  .spec-list dd { text-align: left; }
}
</style>
