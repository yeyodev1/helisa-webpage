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
  const tl = gsap.timeline()
  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span > span', { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out', clipPath: 'inset(0% 0% 100% 0%)' }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  document.querySelectorAll('.product-card').forEach((card) => {
    const tween = gsap.fromTo(card, {
      y: 60,
      opacity: 0,
      scale: 0.95
    }, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  document.querySelectorAll('.why-card').forEach((card, i) => {
    const tween = gsap.fromTo(card, {
      y: 40,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.8,
      delay: i * 0.1,
      ease: 'power3.out',
      scrollTrigger: { trigger: '.why-grid', start: 'top 80%', toggleActions: 'play none none none' },
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
    <section class="products-hero">
      <div class="products-hero__bg">
        <div class="products-hero__grid"></div>
        <div class="products-hero__glow"></div>
      </div>
      
      <div class="container products-hero__content">
        <div class="hero-badge">Portafolio</div>
        <h1 class="hero-title">
          <span class="line-wrap"><span>Productos y</span></span>
          <span class="line-wrap"><span class="text-gradient">tecnologías</span></span>
        </h1>
        <p class="hero-desc">
          Soluciones de tratamiento de agua y aire respaldadas por ingeniería, innovación tecnológica y experiencia real.
        </p>
      </div>
    </section>

    <section class="products-list section-padding">
      <div class="container">
        <div class="products-list__items">
          <article
            v-for="product in products"
            :key="product.id"
            class="product-card"
          >
            <div class="product-card__bg">
              <img :src="product.image" :alt="product.title" class="product-card__image" loading="lazy" />
              <div class="product-card__overlay"></div>
            </div>
            
            <div class="product-card__content">
              <div class="product-card__icon">
                <i :class="['fa-solid', product.icon]"></i>
              </div>
              <span class="product-card__subtitle">{{ product.subtitle }}</span>
              <h2 class="product-card__title">{{ product.title }}</h2>
              <p class="product-card__desc">{{ product.description }}</p>
              
              <ul class="product-card__features">
                <li v-for="feature in product.features" :key="feature">
                  <i class="fa-solid fa-check"></i> {{ feature }}
                </li>
              </ul>
              
              <button
                type="button"
                class="btn btn--glass product-card__cta"
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

    <section class="why-section section-padding">
      <div class="why-section__bg"></div>
      <div class="container">
        <div class="why-header">
          <span class="why-label">¿Por qué elegirnos?</span>
          <h2 class="why-title">Compromiso de <span class="text-gradient">principio a fin</span></h2>
        </div>
        <div class="why-grid">
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
.products-page {
  padding-top: 80px;
  background-color: $background;
  overflow: hidden;
}

/* HERO SECTION */
.products-hero {
  position: relative;
  padding: 8rem 0 6rem;
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
    max-width: 900px;
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
  color: $primary;
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
  max-width: 650px;
  margin: 0 auto;
  line-height: 1.6;
}

/* PRODUCTS LIST */
.products-list {
  position: relative;
  z-index: 2;

  &__items {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4rem;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
  }
}

.product-card {
  position: relative;
  width: 100%;
  border-radius: 40px;
  overflow: hidden;
  background: $primary;
  box-shadow: 0 30px 60px rgba($black, 0.15);
  display: flex;
  flex-direction: column;
  min-height: 600px;

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    filter: grayscale(100%);
    opacity: 0.6;
    transition: all 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top,
        rgba($black, 0.95) 0%,
        rgba($black, 0.8) 40%,
        rgba($black, 0.4) 100%);
  }

  &:hover &__image {
    filter: grayscale(0%);
    opacity: 0.8;
    transform: scale(1.05);
  }

  &__content {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 4rem 2rem;
    margin-top: auto;

    @media (min-width: 768px) {
      padding: 5rem 4rem;
    }
  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: rgba($white, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba($white, 0.2);
    color: $white;
    font-size: 2rem;
    margin-bottom: 1.5rem;
    box-shadow: 0 10px 30px rgba($black, 0.2);
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    color: rgba($white, 0.7);
    margin-bottom: 0.5rem;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 6vw, 4.5rem);
    font-weight: 500;
    color: $white;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($white, 0.8);
    line-height: 1.7;
    max-width: 600px;
    margin: 0 0 2.5rem;
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: 0 0 3rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    max-width: 800px;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: $font-secondary;
      font-size: 0.95rem;
      color: $white;
      background: rgba($white, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba($white, 0.15);
      padding: 0.65rem 1.25rem;
      border-radius: 100px;

      i {
        color: rgba($white, 0.7);
      }
    }
  }
}

.btn--glass {
  background: rgba($white, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba($white, 0.2);
  color: $white;
  padding: 1.25rem 2.5rem;
  border-radius: 100px;
  font-family: $font-secondary;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: $white;
    color: $primary;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba($black, 0.3);
  }
}

/* WHY US SECTION */
.why-section {
  position: relative;
  background: $white;
  padding: 8rem 0;

  &__bg {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at top, rgba($gray-100, 0.8) 0%, transparent 70%);
  }

  .container {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }
}

.why-header {
  text-align: center;
  margin-bottom: 4rem;

  .why-label {
    @include label-pill;
    background: $background;
    margin-bottom: 1rem;
  }

  .why-title {
    font-family: $font-display;
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 500;
    letter-spacing: -0.03em;
    margin: 0;
  }
}

.why-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;

  @media (min-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
  }
}

.why-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding: 3rem 2rem;
  background: rgba($white, 0.8);
  backdrop-filter: blur(20px);
  border: 1px solid $border;
  border-radius: 32px;
  flex: 1 1 300px;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    background: $white;
    transform: translateY(-10px);
    box-shadow: 0 30px 60px rgba($black, 0.05);
    border-color: rgba($black, 0.1);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80px;
    height: 80px;
    background: $primary;
    border-radius: 24px;
    color: $white;
    font-size: 1.75rem;
    margin-bottom: 1.5rem;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover &__icon {
    transform: scale(1.1) rotate(5deg);
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $primary;
    margin: 0 0 1rem;
    letter-spacing: -0.02em;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }
}
</style>
