<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const navigate = (path: string) => router.push(path)

const triggers: ScrollTrigger[] = []

const products = [
  {
    id: 1,
    title: 'Ozono',
    subtitle: 'Desinfección total',
    description: 'Sistemas de ozono que eliminan bacterias, virus, hongos y olores sin dejar residuos químicos. Ideal para purificación de agua y aire en hogares, oficinas e industrias.',
    features: ['Elimina patógenos', 'Sin químicos', 'Aire y agua', 'Bajo mantenimiento'],
    icon: 'fa-atom',
    image: '/images/patio-naves.webp',
  },
  {
    id: 2,
    title: 'Luz Ultravioleta',
    subtitle: 'Esterilización instantánea',
    description: 'Lámparas UV de alta eficiencia que desactivan microorganismos al instante. Tecnología probada, segura y ecológica para agua potable y procesos industriales.',
    features: ['99.9% efectividad', 'Sin sabor ni olor', 'Eco-amigable', 'Larga vida útil'],
    icon: 'fa-sun',
    image: '/images/nave-supersacos.jpg',
  },
  {
    id: 3,
    title: 'Ósmosis Inversa',
    subtitle: 'Máxima pureza',
    description: 'Sistemas de ósmosis inversa que eliminan sales, metales pesados, cloro y contaminantes. El estándar de oro para agua ultrapura en hogares y negocios.',
    features: ['Agua ultrapura', 'Remueve metales', 'Sabor natural', 'Membranas de alta calidad'],
    icon: 'fa-filter',
    image: '/images/nave-tarimas.jpg',
  },
  {
    id: 4,
    title: 'Filtración Integral',
    subtitle: 'Soluciones completas',
    description: 'Filtros, cartuchos, medios granulares y equipos personalizados para cada necesidad. Con repuestos garantizados y soporte técnico en todo el Ecuador.',
    features: ['Repuestos originales', 'Diseño a medida', 'Soporte nacional', 'Garantía real'],
    icon: 'fa-water',
    image: '/images/curso-carbon.jpg',
  },
]

const whyUs = [
  { icon: 'fa-circle-check', title: 'Calidad certificada', desc: 'Equipos e insumos seleccionados bajo estrictos estándares.' },
  { icon: 'fa-clock', title: 'Respuesta rápida', desc: 'Soporte técnico ágil en todo el territorio nacional.' },
  { icon: 'fa-handshake', title: 'Asesoría personalizada', desc: 'Diseñamos la solución ideal para tu hogar o industria.' },
]

onMounted(() => {
  const headerTl = gsap.timeline()
  headerTl
    .from('.page-header__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.page-header__title', { y: 80, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('.page-header__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  document.querySelectorAll('.product-row').forEach((row, i) => {
    const tween = gsap.fromTo(row, {
      y: 40,
      opacity: 1,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: row, start: 'top 85%', toggleActions: 'play none none none' },
      delay: i % 2 === 0 ? 0 : 0.1,
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.why-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 30,
      opacity: 1,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.7,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.why__grid', start: 'top 80%', toggleActions: 'play none none none' },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <main class="products-page">
    <section class="page-header">
      <div class="page-header__bg">
        <div class="page-header__grid" />
      </div>
      <div class="container page-header__content">
        <span class="page-header__label">Portafolio</span>
        <h1 class="page-header__title">Productos y <span class="text-gradient">tecnologías</span></h1>
        <p class="page-header__desc">
          Soluciones de tratamiento de agua y aire respaldadas por ingeniería y experiencia.
        </p>
      </div>
    </section>

    <section class="products-list section-padding">
      <div class="container">
        <div class="products-list__items">
          <article
            v-for="(product, index) in products"
            :key="product.id"
            class="product-row"
            :class="{ 'product-row--reverse': index % 2 !== 0 }"
          >
            <div class="product-row__visual">
              <div class="product-row__frame">
                <div class="product-row__image-wrapper">
                  <img :src="product.image" :alt="product.title" class="product-row__image" />
                </div>
                <div class="product-row__badge">
                  <i :class="['fa-solid', product.icon]"></i>
                </div>
              </div>
              <div class="product-row__ring" aria-hidden="true"></div>
            </div>
            <div class="product-row__content">
              <span class="product-row__subtitle">{{ product.subtitle }}</span>
              <h2 class="product-row__title">{{ product.title }}</h2>
              <p class="product-row__desc">{{ product.description }}</p>
              <ul class="product-row__features">
                <li v-for="feature in product.features" :key="feature" class="product-row__feature">
                  <i class="fa-solid fa-circle-check product-row__check"></i>
                  {{ feature }}
                </li>
              </ul>
              <button
                type="button"
                class="btn btn--outline product-row__cta"
                :aria-label="`Solicitar cotización de ${product.title}`"
                @click="navigate('/calificar')"
              >
                Solicitar cotización
                <i class="fa-solid fa-arrow-right"></i>
              </button>
            </div>
          </article>
        </div>
      </div>
    </section>

    <section class="why section-padding">
      <div class="container">
        <div class="section-header">
          <span class="section-label">¿Por qué elegirnos?</span>
          <h2 class="section-title">Compromiso de <span class="text-gradient">principio a fin</span></h2>
        </div>
        <div class="why__grid">
          <div v-for="item in whyUs" :key="item.title" class="why-card">
            <div class="why-card__icon">
              <i :class="['fa-solid', item.icon]"></i>
            </div>
            <h3 class="why-card__title">{{ item.title }}</h3>
            <p class="why-card__desc">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.products-page {
  padding-top: 80px;
}

.page-header {
  position: relative;
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  text-align: center;
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
    opacity: 0.5;
    mask-image: radial-gradient(ellipse 80% 70% at 50% 0%, $black 0%, transparent 70%);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1.5rem;
    width: 100%;
    max-width: 900px;
    padding: 8rem 1.5rem 5rem;
    box-sizing: border-box;
  }

  &__label {
    @include label-pill;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 8vw, 5rem);
    font-weight: 500;
    letter-spacing: -0.05em;
    line-height: 1.05;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: $foreground-muted;
    max-width: 550px;
    margin: 0;
    line-height: 1.7;
  }
}

.products-list {
  background: $background-soft;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1280px;
  }

  &__items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6rem;
    width: 100%;

    @media (min-width: 1024px) {
      gap: 8rem;
    }
  }
}

.product-row {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3rem;
  width: 100%;

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 6rem;
  }

  &--reverse {
    @media (min-width: 1024px) {
      flex-direction: row-reverse;
    }
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
    border-radius: 32px;
    box-shadow:
      0 40px 80px -20px rgba($black, 0.08),
      0 24px 40px -24px rgba($black, 0.04);
    z-index: 1;
  }

  &__image-wrapper {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: grayscale(20%);
    transition: transform 0.8s ease;

    &:hover {
      transform: scale(1.05);
    }
  }

  &__badge {
    position: absolute;
    bottom: -0.75rem;
    right: -0.75rem;
    width: 64px;
    height: 64px;
    border-radius: 20px;
    background: $black;
    border: 4px solid $white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    color: $white;
    box-shadow: 0 20px 50px rgba($black, 0.1);
    z-index: 2;
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
    animation: productRingRotate 60s linear infinite;
  }

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 1rem;
    max-width: 520px;

    @media (min-width: 1024px) {
      align-items: flex-start;
      text-align: left;
    }
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: $foreground-muted;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.75rem, 3.5vw, 2.5rem);
    font-weight: 500;
    color: $black;
    letter-spacing: -0.03em;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1rem;
    color: $foreground-muted;
    line-height: 1.8;
    margin: 0;
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: 0.5rem 0 0;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;

    @media (min-width: 1024px) {
      justify-content: flex-start;
    }
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $foreground-muted;
    background: $white;
    border: 1px solid $border;
    padding: 0.5rem 1rem;
    border-radius: 100px;
  }

  &__check {
    color: $black;
    font-size: 0.75rem;
  }

  &__cta {
    margin-top: 0.75rem;
  }
}

.why {
  background: $white;
  border-top: 1px solid $border;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;
    max-width: 1280px;
  }

  .section-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1.25rem;
    width: 100%;
  }
}

.why-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1rem;
  flex: 1 1 260px;
  max-width: 360px;
  background: $background-soft;
  border: 1px solid $border;
  border-radius: 24px;
  padding: 2.5rem 2rem;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: $white;
    border-color: $black;
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 56px;
    height: 56px;
    background: $black;
    border-radius: 16px;
    color: $white;
    font-size: 1.35rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.15rem;
    font-weight: 500;
    color: $black;
    margin: 0;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
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

@keyframes productRingRotate {
  from { transform: translate(15%, -10%) rotate(0deg); }
  to { transform: translate(15%, -10%) rotate(360deg); }
}
</style>
