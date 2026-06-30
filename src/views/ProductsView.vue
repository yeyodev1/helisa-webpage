<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const navigate = (path: string) => router.push(path)
const scrollToSection = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

const triggers: ScrollTrigger[] = []

interface TechnologySection {
  slug: string
  eyebrow: string
  title: string
  summary: string
  intro: string
  image: string
  equipment: string[]
  spareParts: string[]
  subproducts: string[]
}

const catalogSections: TechnologySection[] = [
  {
    slug: 'osmosis-inversa',
    eyebrow: 'Sistema principal',
    title: 'Sistemas de Ósmosis Inversa',
    summary: 'Soluciones compactas e industriales para agua de alta pureza con control de sales, metales y contaminantes.',
    intro: 'Diseñamos e instalamos sistemas de ósmosis inversa para hogares, industrias, laboratorios y plantas de agua. El catálogo incluye desde equipos domésticos hasta skids industriales listos para operación.',
    image: '/images/curso-carbon.jpg',
    equipment: ['Equipos domésticos de 1 a 5 etapas', 'Sistemas compactos para oficina y comercio', 'Skids industriales de alta capacidad', 'Bombas presurizadoras y multietapa'],
    spareParts: ['Membranas RO', 'Cartuchos sedimentadores', 'Carcasas porta membrana', 'Manómetros y válvulas check'],
    subproducts: ['Bebederos', 'Tanques presurizados', 'Grifos para agua purificada', 'Kits de conexión e instalación'],
  },
  {
    slug: 'ozono',
    eyebrow: 'Oxidación avanzada',
    title: 'Ozono',
    summary: 'Desinfección sin químicos para agua y aire con alto poder oxidante y bajo mantenimiento.',
    intro: 'El ozono es ideal para eliminar bacterias, virus, hongos, olores y compuestos orgánicos. Lo aplicamos en agua, ambientes y procesos industriales donde se requiere sanidad y control microbiológico.',
    image: '/images/patio-naves.webp',
    equipment: ['Generadores de ozono corona', 'Inyectores Venturi', 'Contactores y tanques de reacción', 'Destructores de ozono'],
    spareParts: ['Piedras difusoras', 'Mangueras y conectores', 'Válvulas check', 'Placas y celdas de reemplazo'],
    subproducts: ['Difusores para tanques', 'Paneles de control', 'Filtros de pretratamiento', 'Kits de ozonización para agua y aire'],
  },
  {
    slug: 'esterilizacion-uv',
    eyebrow: 'Desinfección final',
    title: 'Esterilización UV',
    summary: 'Tecnología segura y ecológica para desactivar microorganismos sin alterar el sabor, olor o composición del agua.',
    intro: 'La esterilización UV es el complemento ideal para plantas de agua, laboratorios, clínicas y sistemas industriales que necesitan una barrera sanitaria confiable y continua.',
    image: '/images/nave-supersacos.jpg',
    equipment: ['Reactores UV de baja y alta presión', 'Lámparas UV-C', 'Balastros electrónicos', 'Sensores y cámaras de desinfección'],
    spareParts: ['Camisas de cuarzo', 'Lámparas de reemplazo', 'O-rings y sellos', 'Controladores de intensidad'],
    subproducts: ['Prefiltros para UV', 'Monitores de dosis', 'Cámaras de paso en acero', 'Sistemas para agua potable y procesos'],
  },
]

const whyUs = [
  { icon: 'fa-circle-check', title: 'Catálogo técnico', desc: 'Desglose claro de tecnologías, equipos, repuestos y subproductos.' },
  { icon: 'fa-clock', title: 'Respuesta rápida', desc: 'Soporte técnico ágil en todo el territorio nacional.' },
  { icon: 'fa-handshake', title: 'Asesoría personalizada', desc: 'Diseñamos la solución ideal para tu hogar, industria o laboratorio.' },
]

onMounted(() => {
  const tl = gsap.timeline()
  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span > span', { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out', clipPath: 'inset(0% 0% 100% 0%)' }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.catalog-index__item', { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' }, '-=0.2')

  document.querySelectorAll('.technology-card').forEach((card) => {
    const tween = gsap.fromTo(card, {
      y: 60,
      opacity: 0,
      scale: 0.96,
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
        <div class="hero-badge">Catálogo técnico</div>
        <h1 class="hero-title">
          <span class="line-wrap"><span>Productos y</span></span>
          <span class="line-wrap"><span class="text-gradient">tecnologías</span></span>
        </h1>
        <p class="hero-desc">
          Más de 20 años instalando sistemas de tratamiento de agua y aire para hogares, industrias, laboratorios y plantas de producción.
        </p>
        <div class="catalog-index">
          <button v-for="section in catalogSections" :key="section.slug" type="button" class="catalog-index__item" @click="scrollToSection(section.slug)">
            {{ section.title }}
          </button>
        </div>
      </div>
    </section>

    <section class="catalog section-padding">
      <div class="container catalog__inner">
        <article v-for="section in catalogSections" :id="section.slug" :key="section.slug" class="technology-card">
          <div class="technology-card__visual">
            <img :src="section.image" :alt="section.title" class="technology-card__image" loading="lazy" />
            <span class="technology-card__eyebrow">{{ section.eyebrow }}</span>
          </div>

          <div class="technology-card__content">
            <h2 class="technology-card__title">{{ section.title }}</h2>
            <p class="technology-card__summary">{{ section.summary }}</p>
            <p class="technology-card__intro">{{ section.intro }}</p>

            <div class="technology-card__groups">
              <div class="technology-card__group">
                <h3>Equipos</h3>
                <ul>
                  <li v-for="item in section.equipment" :key="item">{{ item }}</li>
                </ul>
              </div>

              <div class="technology-card__group">
                <h3>Repuestos</h3>
                <ul>
                  <li v-for="item in section.spareParts" :key="item">{{ item }}</li>
                </ul>
              </div>

              <div class="technology-card__group">
                <h3>Subproductos</h3>
                <ul>
                  <li v-for="item in section.subproducts" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>

            <div class="technology-card__actions">
              <button type="button" class="btn btn--glass" @click="navigate('/calificar')">
                Solicitar cotización
                <i class="fa-solid fa-arrow-right"></i>
              </button>
              <button type="button" class="btn btn--outline" @click="navigate('/proyectos')">
                Ver proyectos relacionados
              </button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="why-section section-padding">
      <div class="why-section__bg"></div>
      <div class="container">
        <div class="why-header">
          <span class="why-label">¿Por qué elegirnos?</span>
          <h2 class="why-title">Catálogo pensado para <span class="text-gradient">convertir visitas en ventas</span></h2>
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;

  .container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }
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

.catalog-index {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.75rem;
  margin-top: 2.5rem;

  &__item {
    padding: 0.8rem 1.1rem;
    border: 1px solid $border;
    border-radius: 999px;
    background: rgba($white, 0.65);
    color: $primary;
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      border-color: $primary;
      box-shadow: 0 10px 24px rgba($black, 0.08);
    }
  }
}

.catalog {
  position: relative;
  z-index: 2;

  &__inner {
    display: flex;
    flex-direction: column;
    gap: 3rem;
  }
}

.technology-card {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.25rem;
  border: 1px solid $border;
  border-radius: 28px;
  background: $white;
  box-shadow: 0 20px 40px rgba($black, 0.05);

  @media (min-width: 900px) {
    grid-template-columns: minmax(280px, 360px) 1fr;
    align-items: stretch;
    padding: 1.5rem;
  }

  &__visual {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    min-height: 280px;
    background: $background-soft;
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  &__eyebrow {
    position: absolute;
    left: 1rem;
    top: 1rem;
    padding: 0.45rem 0.8rem;
    border-radius: 999px;
    background: rgba($white, 0.92);
    font-family: $font-secondary;
    font-size: 0.72rem;
    font-weight: 700;
    color: $primary;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 0.5rem 0.25rem;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(1.8rem, 4vw, 3rem);
    font-weight: 500;
    color: $primary;
    margin: 0;
    letter-spacing: -0.03em;
  }

  &__summary,
  &__intro {
    font-family: $font-secondary;
    line-height: 1.7;
    color: $foreground-muted;
    margin: 0;
  }

  &__summary {
    font-size: 1.05rem;
  }

  &__intro {
    font-size: 0.98rem;
  }

  &__groups {
    display: grid;
    gap: 1rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__group {
    padding: 1rem;
    border-radius: 18px;
    background: $background-soft;
    border: 1px solid $border;

    h3 {
      font-family: $font-secondary;
      font-size: 0.85rem;
      font-weight: 700;
      color: $primary;
      margin: 0 0 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    ul {
      margin: 0;
      padding-left: 1.1rem;
      display: grid;
      gap: 0.45rem;
      font-family: $font-secondary;
      color: $foreground-muted;
      line-height: 1.5;
    }
  }

  &__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    margin-top: 0.5rem;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  border-radius: 999px;
  padding: 0.95rem 1.4rem;
  border: 1px solid transparent;
  font-family: $font-secondary;
  font-size: 0.92rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn--glass {
  background: $primary;
  color: $white;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 28px rgba($black, 0.12);
  }
}

.btn--outline {
  background: transparent;
  border-color: $border;
  color: $primary;

  &:hover {
    border-color: $primary;
    background: rgba($primary, 0.04);
    transform: translateY(-2px);
  }
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
    margin: 0 auto 3rem;
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
    justify-content: center;
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
