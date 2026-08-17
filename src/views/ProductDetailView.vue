<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findProduct, productLines } from '@/data/products'
import { productsService } from '@/services/productsService'
import { categoriesService } from '@/services/categoriesService'
import type { CatalogCategory, CatalogProduct } from '@/data/productTypes'

const route = useRoute()
const router = useRouter()
const selectedImage = ref('')
const loadingProduct = ref(true)

const dynamicProduct = ref<CatalogProduct | null>(null)
const dynamicCategory = ref<CatalogCategory | null>(null)

const staticResult = computed(() => findProduct(String(route.params.category), String(route.params.product)))

const category = computed(() => dynamicCategory.value || staticResult.value?.category)
const product = computed(() => dynamicProduct.value || staticResult.value?.product)
const gallery = computed(() => Array.from(new Set(product.value?.gallery?.length ? product.value.gallery : [product.value?.image ?? ''])).filter(Boolean))
const lineName = computed(() => productLines.find((line) => line.id === category.value?.line)?.name)

const fetchProductFromApi = async () => {
  // Vue Router reuses this component instance when navigating between two
  // /productos/:category/:product URLs, so without resetting these first,
  // `product`/`category` above keep showing the previous page's data (both
  // while this fetch is in flight and, if it fails, indefinitely).
  dynamicProduct.value = null
  dynamicCategory.value = null
  loadingProduct.value = true
  try {
    const catSlug = String(route.params.category)
    const prodSlug = String(route.params.product)
    const p = await productsService.getProductBySlug(catSlug, prodSlug)
    if (p) {
      dynamicProduct.value = {
        slug: p.slug,
        name: p.name,
        image: p.image,
        gallery: p.gallery,
        description: p.description,
        availability: p.availability,
        features: p.features,
        specs: p.specs,
      }
      const c = await categoriesService.getCategoryBySlug(catSlug)
      if (c) {
        dynamicCategory.value = {
          slug: c.slug,
          line: c.line,
          name: c.name,
          sourceUrl: c.sourceUrl || '',
          description: c.description,
          benefits: c.benefits,
          products: [],
        }
      }
    }
  } catch (e) {
    // Fallback to static result
  } finally {
    loadingProduct.value = false
  }
}

onMounted(() => {
  fetchProductFromApi()
})

watch(() => [route.params.category, route.params.product], fetchProductFromApi)

// --- Lógica para Especificaciones Tabulares ---
const searchQuery = ref('')
const sortBy = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const SPEC_PART_MATCHERS: { header: string; test: (part: string) => boolean; extract: (part: string) => string }[] = [
  {
    header: 'Conexión superior/inferior',
    test: (part) => part.startsWith('Conexión '),
    extract: (part) => part.replace('Conexión ', '').trim(),
  },
  {
    header: 'Diámetro x Altura (mm)',
    test: (part) => part.includes('x') && (part.includes('mm') || part.includes('in') || part.includes('"')),
    extract: (part) => part.replace(' mm', '').trim(),
  },
  {
    header: 'Volumen Botella (ft³)',
    test: (part) => part.startsWith('Botella '),
    extract: (part) => part.replace('Botella ', '').trim(),
  },
  {
    header: 'Carga (ft³)',
    test: (part) => part.startsWith('Carga '),
    extract: (part) => part.replace('Carga ', '').trim(),
  },
  {
    header: 'Peso (kg)',
    test: (part) => /kg$/i.test(part.trim()),
    extract: (part) => part.trim(),
  },
]

const parseSpecValue = (valStr: string) => {
  const parts = valStr.split('·').map(part => part.trim()).filter(Boolean)
  const result = []

  for (const part of parts) {
    const matcher = SPEC_PART_MATCHERS.find((m) => m.test(part))
    if (matcher) {
      result.push({ header: matcher.header, val: matcher.extract(part) })
    } else {
      result.push({ header: 'Otro', val: part })
    }
  }
  return result
}

const isTabularSpecs = computed(() => {
  return product.value?.specs?.some(spec => spec.value.includes('·')) ?? false
})

const parsedSpecs = computed(() => {
  if (!product.value?.specs) return []
  return product.value.specs.map(spec => {
    const parsedParts = spec.value.includes('·')
      ? parseSpecValue(spec.value)
      : [{ header: 'Valor', val: spec.value }]
    return {
      label: spec.label,
      parts: parsedParts
    }
  })
})

const tableHeaders = computed(() => {
  if (!isTabularSpecs.value) return []
  const headerOrder = SPEC_PART_MATCHERS.map((m) => m.header)
  const seen = new Set<string>()
  for (const row of parsedSpecs.value) {
    for (const part of row.parts) seen.add(part.header)
  }
  if (seen.size === 0) return []
  const ordered = headerOrder.filter((h) => seen.has(h))
  const extra = [...seen].filter((h) => !headerOrder.includes(h))
  return ['Tamaño(pul)', ...ordered, ...extra]
})

const filteredAndSortedSpecs = computed(() => {
  let result = parsedSpecs.value

  // Filtrado por búsqueda
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase().trim()
    result = result.filter(row => {
      const matchesLabel = row.label.toLowerCase().includes(query)
      const matchesParts = row.parts.some(p => p.val.toLowerCase().includes(query))
      return matchesLabel || matchesParts
    })
  }

  // Ordenación
  if (sortBy.value) {
    const sortCol = sortBy.value
    const order = sortOrder.value === 'asc' ? 1 : -1

    result = [...result].sort((a, b) => {
      if (sortCol === 'Tamaño(pul)') {
        return a.label.localeCompare(b.label, undefined, { numeric: true, sensitivity: 'base' }) * order
      } else {
        const valA = a.parts.find(p => p.header === sortCol)?.val || ''
        const valB = b.parts.find(p => p.header === sortCol)?.val || ''
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' }) * order
      }
    })
  }

  return result
})

const handleSort = (header: string) => {
  if (sortBy.value === header) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value = header
    sortOrder.value = 'asc'
  }
}

watch([product, loadingProduct], ([value, isLoading]) => {
  if (!isLoading && !value) {
    router.replace('/productos')
    return
  }
  if (value) {
    selectedImage.value = value.image
  }
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

        <article 
          v-if="product.specs?.length" 
          class="detail-panel detail-panel--specs"
          :class="{ 'detail-panel--tabular': isTabularSpecs }"
        >
          <div class="specs-header-row">
            <div class="specs-header-titles">
              <span>Ficha técnica</span>
              <h2>Especificaciones</h2>
            </div>
          </div>

          <!-- Vista Tabular Interactiva -->
          <div v-if="isTabularSpecs" class="table-responsive">
            <table class="specs-table">
              <thead>
                <tr>
                  <th 
                    v-for="header in tableHeaders" 
                    :key="header"
                    @click="handleSort(header)"
                    :class="{ 'sortable': true, 'active-sort': sortBy === header }"
                  >
                    <div class="th-content">
                      <span>{{ header }}</span>
                      <span class="sort-indicator">
                        <i 
                          v-if="sortBy !== header" 
                          class="fa-solid fa-sort sort-icon-inactive" 
                        />
                        <i 
                          v-else-if="sortOrder === 'asc'" 
                          class="fa-solid fa-sort-up sort-icon-active" 
                        />
                          <i 
                          v-else 
                          class="fa-solid fa-sort-down sort-icon-active" 
                        />
                      </span>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr 
                  v-for="row in filteredAndSortedSpecs" 
                  :key="row.label"
                  class="spec-table-row"
                >
                  <td class="font-bold spec-model-cell">{{ row.label.replace(' - conexión 4"', '') }}</td>
                  <td
                    v-for="header in tableHeaders.slice(1)"
                    :key="header"
                    :data-label="header"
                  >
                    {{ row.parts.find((p) => p.header === header)?.val || '—' }}
                  </td>
                </tr>
                <tr v-if="filteredAndSortedSpecs.length === 0">
                  <td :colspan="tableHeaders.length" class="no-results-cell">
                    <div class="no-results-content">
                      <i class="fa-solid fa-circle-info" />
                      <span>No se encontraron especificaciones que coincidan con "{{ searchQuery }}".</span>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Vista Tradicional DL para especificaciones simples -->
          <dl v-else class="spec-list">
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

/* --- Estilos para Especificaciones Tabulares --- */
.detail-panel--tabular {
  flex: 1 1 100% !important; // Ocupa el 100% de la anchura para dar espacio a la tabla
}

.specs-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 2rem;
  border-bottom: 1px solid $border;
  padding-bottom: 1.5rem;
}

.specs-header-titles {
  h2 {
    margin: 0.5rem 0 0;
  }
}

.specs-search-container {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 380px;

  .search-icon {
    position: absolute;
    left: 1rem;
    color: $foreground-subtle;
    font-size: 0.9rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 0.75rem 2.5rem 0.75rem 2.5rem;
    border: 1px solid $border;
    border-radius: 12px;
    font: 0.9rem $font-secondary;
    color: $foreground;
    background: $background-soft;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: $primary;
      background: $white;
      box-shadow: 0 0 0 3px rgba($primary, 0.12);
    }
  }

  .clear-search-btn {
    position: absolute;
    right: 0.75rem;
    background: none;
    border: none;
    color: $foreground-subtle;
    cursor: pointer;
    padding: 0.25rem;
    font-size: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease;

    &:hover {
      color: $accent;
    }
  }
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border-radius: 16px;
  border: 1px solid $border;
  background: $white;
  box-shadow: 0 4px 20px rgba($black, 0.02);

  // Personalización de la barra de desplazamiento
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-track {
    background: $background-soft;
  }
  &::-webkit-scrollbar-thumb {
    background: $border-strong;
    border-radius: 99px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: $foreground-subtle;
  }
}

.specs-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font: 0.9rem $font-secondary;

  th {
    background: lighten($primary, 92%); // Un celeste/azul sutilísimo para la cabecera
    color: $primary-dark;
    font-weight: 700;
    padding: 1.25rem 1rem;
    border: 1px solid $border;
    user-select: none;
    white-space: nowrap;

    &.sortable {
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background: lighten($primary, 88%);
      }
    }

    &.active-sort {
      background: lighten($primary, 86%);
      color: $primary;
    }
  }

  .th-content {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .sort-indicator {
    display: inline-flex;
    font-size: 0.8rem;
    
    .sort-icon-inactive {
      color: rgba($primary-dark, 0.25);
    }
    
    .sort-icon-active {
      color: $primary;
    }
  }

  td {
    padding: 1.1rem 1rem;
    border: 1px solid $border;
    color: $foreground-muted;
    white-space: nowrap;
    transition: background-color 0.15s ease;
  }

  .spec-model-cell {
    color: $primary-dark;
    font-weight: 600;
    background: $background-soft;
  }

  .spec-table-row {
    &:hover td {
      background-color: rgba($primary, 0.03);
    }
  }

  // Celda de no resultados
  .no-results-cell {
    text-align: center;
    padding: 3rem 1.5rem;
    color: $foreground-muted;

    .no-results-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
      
      i {
        font-size: 1.8rem;
        color: $foreground-subtle;
      }
      
      span {
        font-size: 0.95rem;
      }
    }
  }
}

@media (max-width: 600px) {
  .specs-table {
    font-size: 0.8rem;
    
    th, td {
      padding: 0.75rem 0.5rem;
      white-space: normal;
      word-break: break-word;
      text-align: center;
    }

    .th-content {
      justify-content: center;
    }
  }
}

@media (max-width: 520px) {
  .specs-header-row {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
}
</style>
