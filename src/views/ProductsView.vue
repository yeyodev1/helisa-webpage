<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { productCategories as staticCategories, productLines, type ProductLine, type CatalogCategory } from '@/data/products'
import { categoriesService } from '@/services/categoriesService'
import { productsService } from '@/services/productsService'

const route = useRoute()
const router = useRouter()
const activeLine = ref<ProductLine>('industrial')
const activeCategorySlug = ref('')
const search = ref('')

const dynamicCategories = ref<CatalogCategory[]>([])

const allCategories = computed<CatalogCategory[]>(() => {
  return dynamicCategories.value.length > 0 ? dynamicCategories.value : staticCategories
})

const fetchDynamicData = async () => {
  try {
    const [cats, prods] = await Promise.all([
      categoriesService.getCategories(),
      productsService.getProducts(),
    ])

    if (cats.length > 0) {
      const merged: CatalogCategory[] = cats.map((c) => ({
        slug: c.slug,
        line: c.line,
        name: c.name,
        sourceUrl: c.sourceUrl || '',
        description: c.description,
        benefits: c.benefits,
        products: prods
          .filter((p) => p.categorySlug === c.slug)
          .map((p) => ({
            slug: p.slug,
            name: p.name,
            image: p.image,
            gallery: p.gallery,
            description: p.description,
            availability: p.availability,
            features: p.features,
            specs: p.specs,
          })),
      }))
      dynamicCategories.value = merged
    }
  } catch (e) {
    // Fallback to staticCategories automatically
  }
}

const lineCategories = computed(() =>
  allCategories.value.filter((category) => category.line === activeLine.value),
)

const activeCategory = computed(() =>
  lineCategories.value.find((category) => category.slug === activeCategorySlug.value)
  ?? lineCategories.value[0],
)

const visibleProducts = computed(() => {
  const term = search.value.trim().toLocaleLowerCase('es')
  if (!term) return activeCategory.value?.products ?? []

  return (activeCategory.value?.products ?? []).filter((product) => {
    const searchable = [
      product.name,
      product.description,
      ...(product.features ?? []),
      ...(product.specs?.flatMap((spec) => [spec.label, spec.value]) ?? []),
    ].filter(Boolean).join(' ').toLocaleLowerCase('es')
    return searchable.includes(term)
  })
})

const totalProducts = computed(() =>
  allCategories.value.reduce((total, category) => total + category.products.length, 0),
)

const selectLine = (line: ProductLine) => {
  activeLine.value = line
  activeCategorySlug.value = allCategories.value.find((category) => category.line === line)?.slug ?? ''
  search.value = ''
}

const selectCategory = async (slug: string) => {
  activeCategorySlug.value = slug
  search.value = ''
  await router.replace({ hash: `#${slug}` })
  await nextTick()
  document.querySelector('.catalog-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const setCategoryFromHash = () => {
  const slug = route.hash.slice(1)
  const category = allCategories.value.find((item) => item.slug === slug)
  if (!category) {
    activeCategorySlug.value = lineCategories.value[0]?.slug ?? ''
    return
  }

  activeLine.value = category.line
  activeCategorySlug.value = category.slug
}

watch(() => route.hash, setCategoryFromHash)
onMounted(async () => {
  await fetchDynamicData()
  setCategoryFromHash()
})
</script>

<template>
  <main class="products-page">
    <section class="catalog-hero">
      <div class="catalog-hero__orb catalog-hero__orb--one" />
      <div class="catalog-hero__orb catalog-hero__orb--two" />
      <div class="container catalog-hero__content">
        <span class="catalog-hero__eyebrow">Catálogo HELISA</span>
        <h1>Soluciones para cada <span>tipo de agua</span></h1>
        <p>
          Explora el catálogo completo de equipos, sistemas, accesorios y repuestos para tratamiento
          de agua y aire.
        </p>
        <div class="catalog-hero__stats" aria-label="Resumen del catálogo">
          <div><strong>{{ allCategories.length }}</strong><span>Categorías</span></div>
          <div><strong>{{ totalProducts }}</strong><span>Productos y modelos</span></div>
          <div><strong>3</strong><span>Líneas especializadas</span></div>
        </div>
      </div>
    </section>

    <section class="catalog-browser section-padding">
      <div class="container catalog-browser__inner">
        <div class="line-tabs" role="tablist" aria-label="Líneas de productos">
          <button
            v-for="line in productLines"
            :key="line.id"
            type="button"
            :class="['line-tabs__button', { 'line-tabs__button--active': activeLine === line.id }]"
            role="tab"
            :aria-selected="activeLine === line.id"
            @click="selectLine(line.id)"
          >
            <span>{{ line.name }}</span>
            <small>{{ allCategories.filter((category: CatalogCategory) => category.line === line.id).length }} categorías</small>
          </button>
        </div>

        <p class="line-description">
          {{ productLines.find((line) => line.id === activeLine)?.description }}
        </p>

        <nav class="category-list" aria-label="Categorías del catálogo">
          <button
            v-for="category in lineCategories"
            :key="category.slug"
            type="button"
            :class="['category-list__button', { 'category-list__button--active': activeCategory?.slug === category.slug }]"
            @click="selectCategory(category.slug)"
          >
            {{ category.name }}
            <span>{{ category.products.length }}</span>
          </button>
        </nav>

        <div v-if="activeCategory" class="catalog-content">
          <header class="category-header">
            <div class="category-header__copy">
              <span>{{ productLines.find((line) => line.id === activeCategory?.line)?.name }}</span>
              <h2>{{ activeCategory.name }}</h2>
              <p v-if="activeCategory.description">{{ activeCategory.description }}</p>
            </div>

            <label class="catalog-search">
              <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
              <span class="sr-only">Buscar en {{ activeCategory.name }}</span>
              <input v-model="search" type="search" :placeholder="`Buscar entre ${activeCategory.products.length} productos`" />
            </label>
          </header>

          <div v-if="activeCategory.benefits?.length" class="category-benefits">
            <div v-for="benefit in activeCategory.benefits" :key="benefit">
              <i class="fa-solid fa-check" aria-hidden="true" />
              <span>{{ benefit }}</span>
            </div>
          </div>

          <div v-if="visibleProducts.length" class="product-list">
            <RouterLink
              v-for="(product, index) in visibleProducts"
              :key="product.slug"
              :to="`/productos/${activeCategory.slug}/${product.slug}`"
              class="product-card"
            >
              <div class="product-card__visual">
                <img
                  :src="product.image"
                  :alt="product.name"
                  loading="eager"
                  :fetchpriority="index < 4 ? 'high' : 'auto'"
                />
                <span v-if="product.gallery && product.gallery.length > 1" class="product-card__gallery-count">
                  <i class="fa-regular fa-images" aria-hidden="true" />
                  {{ product.gallery.length }}
                </span>
              </div>
              <div class="product-card__body">
                <span class="product-card__category">{{ activeCategory.name }}</span>
                <h3>{{ product.name }}</h3>
                <p v-if="product.description">{{ product.description }}</p>
                <p v-else>Consulta disponibilidad, compatibilidad y asesoría técnica con nuestro equipo.</p>
                <div class="product-card__footer">
                  <span>{{ product.specs?.length ?? 0 }} datos técnicos</span>
                  <span class="product-card__link">Ver producto <i class="fa-solid fa-arrow-right" aria-hidden="true" /></span>
                </div>
              </div>
            </RouterLink>
          </div>

          <div v-else class="empty-state">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true" />
            <h3>No encontramos coincidencias</h3>
            <p>Prueba con otro nombre, modelo o especificación.</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.products-page {
  width: 100%;
  min-height: 100vh;
  padding-top: 80px;
  background: $background;
  overflow: hidden;
}

.container {
  width: min(100% - 2rem, 1320px);
  margin: 0 auto;
}

.catalog-hero {
  position: relative;
  min-height: 620px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: $primary;
  color: $white;
  overflow: hidden;

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 7rem 0 5rem;
    text-align: center;
  }

  &__eyebrow {
    padding: 0.6rem 1rem;
    border: 1px solid rgba($white, 0.2);
    border-radius: 999px;
    font-family: $font-secondary;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.16em;
    text-transform: uppercase;
  }

  h1 {
    max-width: 980px;
    margin: 1.5rem 0;
    font-family: $font-display;
    font-size: clamp(3rem, 8vw, 7rem);
    font-weight: 500;
    line-height: 0.98;
    letter-spacing: -0.055em;

    span { color: $celeste-claro; }
  }

  p {
    max-width: 680px;
    margin: 0;
    color: rgba($white, 0.7);
    font-family: $font-secondary;
    font-size: clamp(1rem, 2vw, 1.2rem);
    line-height: 1.7;
  }

  &__stats {
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 3rem;

    div {
      min-width: 170px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 1.1rem 1.5rem;
      border: 1px solid rgba($white, 0.12);
      border-radius: 18px;
      background: rgba($white, 0.06);
      backdrop-filter: blur(12px);
    }

    strong { font: 600 1.75rem/1 $font-display; }
    span { margin-top: 0.5rem; color: rgba($white, 0.55); font: 0.75rem $font-secondary; }
  }

  &__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(2px);
    border: 1px solid rgba($white, 0.1);

    &--one { width: 520px; height: 520px; top: -280px; right: -100px; }
    &--two { width: 360px; height: 360px; bottom: -210px; left: 5%; }
  }
}

.catalog-browser {
  display: flex;
  justify-content: center;
  width: 100%;
  padding: 3.5rem 0 7rem;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}

.line-tabs {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;

  &__button {
    flex: 1 1 260px;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
    padding: 1.35rem 1.5rem;
    border: 1px solid $border;
    border-radius: 20px;
    background: $white;
    color: $primary;
    cursor: pointer;
    text-align: left;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;

    span { font: 600 1rem $font-display; }
    small { color: $foreground-muted; font: 0.78rem $font-secondary; }

    &:hover { transform: translateY(-3px); border-color: rgba($primary, 0.35); }

    &--active {
      border-color: $primary;
      background: $primary;
      color: $white;
      small { color: rgba($white, 0.6); }
    }
  }
}

.line-description {
  max-width: 740px;
  margin: 1.5rem auto 2rem;
  color: $foreground-muted;
  font: 1rem/1.7 $font-secondary;
  text-align: center;
}

.category-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  padding-bottom: 3rem;
  border-bottom: 1px solid $border;

  &__button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.6rem;
    padding: 0.7rem 0.9rem;
    border: 1px solid $border;
    border-radius: 999px;
    background: transparent;
    color: $foreground-muted;
    font: 600 0.78rem $font-secondary;
    cursor: pointer;

    span {
      min-width: 22px;
      padding: 0.18rem 0.35rem;
      border-radius: 999px;
      background: $background-soft;
      color: $primary;
      font-size: 0.68rem;
    }

    &:hover, &--active { border-color: $primary; color: $primary; }
    &--active { background: rgba($primary, 0.05); }
  }
}

.catalog-content {
  width: 100%;
  scroll-margin-top: 110px;
  padding-top: 4rem;
}

.category-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 2rem;
  margin-bottom: 2rem;

  &__copy {
    max-width: 780px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    > span { color: $foreground-muted; font: 700 0.72rem $font-secondary; letter-spacing: 0.14em; text-transform: uppercase; }
    h2 { margin: 0.6rem 0 0.8rem; color: $primary; font: 500 clamp(2.2rem, 5vw, 4.5rem)/1 $font-display; letter-spacing: -0.04em; }
    p { margin: 0; color: $foreground-muted; font: 1rem/1.7 $font-secondary; }
  }
}

.catalog-search {
  min-width: min(100%, 320px);
  display: flex;
  align-items: center;
  gap: 0.7rem;
  padding: 0.9rem 1rem;
  border: 1px solid $border;
  border-radius: 14px;
  background: $white;
  color: $foreground-muted;

  input {
    width: 100%;
    border: 0;
    outline: 0;
    background: transparent;
    color: $primary;
    font: 0.9rem $font-secondary;
  }
}

.category-benefits {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 0.65rem;
  margin-bottom: 2rem;

  div {
    flex: 1 1 260px;
    display: flex;
    align-items: flex-start;
    gap: 0.65rem;
    padding: 0.85rem 1rem;
    border-radius: 12px;
    background: $background-soft;
    color: $foreground-muted;
    font: 0.82rem/1.5 $font-secondary;
  }

  i { margin-top: 0.15rem; color: $verde; }
}

.product-list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: stretch;
  justify-content: center;
  gap: 1.75rem;
}

.product-card {
  flex: 0 1 calc(33.333% - 1.2rem);
  max-width: calc(33.333% - 1.2rem);
  min-width: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid $border;
  border-radius: 22px;
  background: $white;
  color: inherit;
  text-decoration: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;

  &:hover {
    transform: translateY(-6px);
    border-color: rgba($primary, 0.25);
    box-shadow: 0 22px 55px rgba($black, 0.09);
  }

  &__visual {
    position: relative;
    height: 220px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.25rem;
    background: linear-gradient(145deg, $background-soft, $white);

    img { width: 100%; height: 100%; object-fit: contain; transition: transform 0.4s ease; }
  }

  &:hover &__visual img { transform: scale(1.04); }

  &__gallery-count {
    position: absolute;
    right: 0.8rem;
    bottom: 0.8rem;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    padding: 0.4rem 0.6rem;
    border-radius: 999px;
    background: rgba($primary, 0.8);
    color: $white;
    font: 0.72rem $font-secondary;
  }

  &__body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1.35rem;

    h3 { margin: 0.45rem 0 0.75rem; color: $primary; font: 600 1.25rem/1.25 $font-display; }
    p { display: -webkit-box; overflow: hidden; margin: 0; color: $foreground-muted; font: 0.86rem/1.65 $font-secondary; -webkit-box-orient: vertical; -webkit-line-clamp: 3; }
  }

  &__category { color: $foreground-muted; font: 700 0.65rem $font-secondary; letter-spacing: 0.1em; text-transform: uppercase; }

  &__footer {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: auto;
    padding-top: 1.25rem;
    color: $foreground-muted;
    font: 0.72rem $font-secondary;
  }

  &__link { color: $primary; font-weight: 700; white-space: nowrap; }
}

.empty-state {
  min-height: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: $foreground-muted;
  text-align: center;

  i { font-size: 2rem; }
  h3 { margin: 1rem 0 0.5rem; color: $primary; font: 600 1.4rem $font-display; }
  p { margin: 0; font: 0.9rem $font-secondary; }
}

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

@media (max-width: 960px) {
  .product-card {
    flex-basis: calc(50% - 0.9rem);
    max-width: calc(50% - 0.9rem);
  }
}

@media (max-width: 640px) {
  .products-page { padding-top: 70px; }
  .catalog-hero { min-height: 560px; }
  .catalog-hero__stats { width: 100%; }
  .catalog-hero__stats div { flex: 1 1 120px; min-width: 0; padding-inline: 0.7rem; }
  .catalog-browser { padding: 2rem 0 4.5rem; }
  .line-tabs__button { max-width: none; }
  .category-list { justify-content: flex-start; flex-wrap: nowrap; overflow-x: auto; padding-bottom: 1.5rem; }
  .category-list__button { flex: 0 0 auto; }
  .category-header { align-items: stretch; }
  .catalog-search { width: 100%; }
  .product-card { flex-basis: 100%; max-width: 100%; }
}
</style>
