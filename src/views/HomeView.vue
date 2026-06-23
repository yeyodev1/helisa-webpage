<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const router = useRouter()
const triggers: ScrollTrigger[] = []

const navigate = (path: string) => router.push(path)

onMounted(() => {
  // Hero entrance
  gsap.timeline({ delay: 0.2 })
    .from('.hero__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero__title-line', { y: 100, opacity: 0, duration: 1.2, stagger: 0.1, ease: 'power4.out' }, '-=0.4')
    .from('.hero__subtitle', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.hero__actions', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    .from('.hero__image', { scale: 1.15, opacity: 0, duration: 1.5, ease: 'power3.out' }, '-=1.2')

  // Marquee
  gsap.to('.marquee__track', { xPercent: -50, duration: 25, repeat: -1, ease: 'none' })

  // Reveal sections
  document.querySelectorAll('[data-reveal]').forEach((section) => {
    const items = section.querySelectorAll('.reveal-item')
    const tween = gsap.fromTo(items, {
      y: 60,
      opacity: 0,
    }, {
      y: 0,
      opacity: 1,
      duration: 0.9,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none none',
      },
    })
    if (tween.scrollTrigger) triggers.push(tween.scrollTrigger)
  })

  // Stats counter
  document.querySelectorAll('.stat__value').forEach((stat) => {
    const target = parseInt(stat.getAttribute('data-value') || '0', 10)
    const suffix = stat.getAttribute('data-suffix') || ''
    const counter = gsap.to(stat, {
      innerText: target,
      duration: 2,
      ease: 'power2.out',
      snap: { innerText: 1 },
      scrollTrigger: { trigger: stat, start: 'top 85%', toggleActions: 'play none none none' },
      onUpdate: () => { stat.textContent = Math.ceil(parseFloat(stat.textContent || '0')) + suffix },
    })
    if (counter.scrollTrigger) triggers.push(counter.scrollTrigger)
  })
})

onUnmounted(() => {
  triggers.forEach((t) => t.kill())
})
</script>

<template>
  <main class="home">
    <section class="hero">
      <div class="hero__bg">
        <div class="hero__gradient" />
        <div class="hero__orb hero__orb--1" />
        <div class="hero__orb hero__orb--2" />
      </div>

      <div class="container hero__grid">
        <div class="hero__content">
          <span class="hero__label">Health &amp; Life S.A.</span>
          <h1 class="hero__title">
            <span class="hero__title-line">Agua Pura.</span>
            <span class="hero__title-line text-gradient">Aire Limpio.</span>
            <span class="hero__title-line">Vida Sana.</span>
          </h1>
          <p class="hero__subtitle">
            Sistemas de tratamiento y purificaci&oacute;n con respaldo t&eacute;cnico
            y atenci&oacute;n personalizada en todo el Ecuador.
          </p>
          <div class="hero__actions">
            <button class="btn btn--primary" @click="navigate('/productos')">
              Explorar productos
              <i class="fa-solid fa-arrow-right"></i>
            </button>
            <button class="btn btn--ghost" @click="navigate('/calificar')">
              Calificar atenci&oacute;n
            </button>
          </div>
        </div>

        <div class="hero__visual">
          <div class="hero__image-wrapper">
            <img src="/images/nave-supersacos.jpg" alt="Instalaciones de tratamiento de agua" class="hero__image" />
            <div class="hero__image-overlay" />
          </div>
          <div class="hero__floating-card">
            <i class="fa-solid fa-droplet hero__floating-icon"></i>
            <div>
              <span class="hero__floating-value">15+</span>
              <span class="hero__floating-label">A&ntilde;os de experiencia</span>
            </div>
          </div>
        </div>
      </div>

      <div class="hero__scroll">
        <span class="hero__scroll-text">Scroll</span>
        <div class="hero__scroll-line" />
      </div>
    </section>

    <section class="marquee">
      <div class="marquee__track">
        <span v-for="n in 4" :key="n" class="marquee__item">
          <i class="fa-solid fa-droplet"></i> Ozono <i class="fa-solid fa-sun"></i> UV <i class="fa-solid fa-filter"></i> &Oacute;smosis Inversa <i class="fa-solid fa-water"></i> Filtraci&oacute;n
        </span>
      </div>
    </section>

    <section class="features-bar section-padding">
      <div class="container">
        <div class="features-bar__grid" data-reveal>
          <div class="feature-mini reveal-item">
            <i class="fa-solid fa-circle-check feature-mini__icon"></i>
            <div>
              <h4 class="feature-mini__title">Calidad certificada</h4>
              <p class="feature-mini__desc">Equipos e insumos bajo est&aacute;ndares internacionales.</p>
            </div>
          </div>
          <div class="feature-mini reveal-item">
            <i class="fa-solid fa-headset feature-mini__icon"></i>
            <div>
              <h4 class="feature-mini__title">Soporte 24/7</h4>
              <p class="feature-mini__desc">Atenci&oacute;n t&eacute;cnica en todo el Ecuador.</p>
            </div>
          </div>
          <div class="feature-mini reveal-item">
            <i class="fa-solid fa-screwdriver-wrench feature-mini__icon"></i>
            <div>
              <h4 class="feature-mini__title">Instalaci&oacute;n incluida</h4>
              <p class="feature-mini__desc">Servicio profesional y garant&iacute;a real.</p>
            </div>
          </div>
          <div class="feature-mini reveal-item">
            <i class="fa-solid fa-leaf feature-mini__icon"></i>
            <div>
              <h4 class="feature-mini__title">Eco-amigable</h4>
              <p class="feature-mini__desc">Tecnolog&iacute;as limpias sin residuos.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="about-teaser section-padding" data-reveal>
      <div class="container about-teaser__grid">
        <div class="about-teaser__image-wrapper reveal-item">
          <img src="/images/nave-tarimas.jpg" alt="Almac&eacute;n de insumos para tratamiento de agua" class="about-teaser__image" />
          <div class="about-teaser__image-overlay" />
        </div>
        <div class="about-teaser__text">
          <span class="section-label reveal-item">Nosotros</span>
          <h2 class="section-title reveal-item">Pensando en <span class="text-gradient">su bienestar</span></h2>
          <p class="about-teaser__paragraph reveal-item">
            HELISA — Health &amp; Life S.A. — ofrece los mejores sistemas de tratamiento y
            purificaci&oacute;n de agua y aire con respaldo de repuestos y atenci&oacute;n
            personalizada en todo el Ecuador.
          </p>
          <p class="about-teaser__paragraph reveal-item">
            Cada gota cuenta. Por eso combinamos tecnolog&iacute;a de punta con un equipo humano
            comprometido para transformar la calidad del agua y el aire de hogares e industrias.
          </p>
          <button class="btn btn--outline reveal-item" @click="navigate('/nosotros')">
            Conocer nuestra historia
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </section>

    <section class="products-preview section-padding" data-reveal>
      <div class="container">
        <div class="section-header">
          <span class="section-label">Tecnolog&iacute;as</span>
          <h2 class="section-title">Soluciones que <span class="text-gradient">transforman</span></h2>
        </div>

        <div class="products-preview__grid">
          <button type="button" class="product-card product-card--large reveal-item" aria-label="Ver productos de Ozono" @click="navigate('/productos')">
            <img src="/images/patio-naves.webp" alt="Ozono" class="product-card__bg" />
            <div class="product-card__overlay" />
            <div class="product-card__content">
              <span class="product-card__number">01</span>
              <i class="fa-solid fa-atom product-card__icon"></i>
              <h3 class="product-card__title">Ozono</h3>
              <p class="product-card__desc">Desinfecci&oacute;n avanzada sin residuos qu&iacute;micos.</p>
              <span class="product-card__link">Ver m&aacute;s <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </button>
          <button type="button" class="product-card reveal-item" aria-label="Ver productos de Luz UV" @click="navigate('/productos')">
            <div class="product-card__content">
              <span class="product-card__number">02</span>
              <i class="fa-solid fa-sun product-card__icon"></i>
              <h3 class="product-card__title">Luz UV</h3>
              <p class="product-card__desc">Elimina bacterias y virus al instante.</p>
              <span class="product-card__link">Ver m&aacute;s <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </button>
          <button type="button" class="product-card reveal-item" aria-label="Ver productos de &Oacute;smosis Inversa" @click="navigate('/productos')">
            <div class="product-card__content">
              <span class="product-card__number">03</span>
              <i class="fa-solid fa-filter product-card__icon"></i>
              <h3 class="product-card__title">&Oacute;smosis Inversa</h3>
              <p class="product-card__desc">El m&aacute;ximo nivel de pureza en cada gota.</p>
              <span class="product-card__link">Ver m&aacute;s <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </button>
          <button type="button" class="product-card product-card--wide reveal-item" aria-label="Ver productos de Filtraci&oacute;n Integral" @click="navigate('/productos')">
            <img src="/images/nave-supersacos.jpg" alt="Filtraci&oacute;n" class="product-card__bg" />
            <div class="product-card__overlay" />
            <div class="product-card__content">
              <span class="product-card__number">04</span>
              <i class="fa-solid fa-water product-card__icon"></i>
              <h3 class="product-card__title">Filtraci&oacute;n Integral</h3>
              <p class="product-card__desc">Sistemas completos con repuestos y soporte nacional.</p>
              <span class="product-card__link">Ver m&aacute;s <i class="fa-solid fa-arrow-right"></i></span>
            </div>
          </button>
        </div>
      </div>
    </section>

    <section class="stats section-padding" data-reveal>
      <div class="container stats__grid">
        <div class="stat reveal-item">
          <i class="fa-solid fa-calendar-days stat__icon"></i>
          <span class="stat__value" data-value="15" data-suffix="+">0+</span>
          <span class="stat__label">A&ntilde;os de experiencia</span>
        </div>
        <div class="stat reveal-item">
          <i class="fa-solid fa-hand-holding-heart stat__icon"></i>
          <span class="stat__value" data-value="100" data-suffix="%">0%</span>
          <span class="stat__label">Atenci&oacute;n personalizada</span>
        </div>
        <div class="stat reveal-item">
          <i class="fa-solid fa-clock stat__icon"></i>
          <span class="stat__value" data-value="24" data-suffix="/7">0/7</span>
          <span class="stat__label">Soporte t&eacute;cnico</span>
        </div>
        <div class="stat reveal-item">
          <i class="fa-solid fa-users stat__icon"></i>
          <span class="stat__value" data-value="10" data-suffix="K+">0K+</span>
          <span class="stat__label">Clientes satisfechos</span>
        </div>
      </div>
    </section>

    <section class="cta section-padding" data-reveal>
      <div class="container">
        <div class="cta__inner">
          <img src="/images/nave-tarimas.jpg" alt="HELISA instalaciones" class="cta__bg" />
          <div class="cta__overlay" />
          <div class="cta__content">
            <h2 class="cta__title reveal-item">
              Listo para <span class="text-gradient">respirar</span> y <span class="text-gradient">beber</span> mejor?
            </h2>
            <p class="cta__desc reveal-item">
              Agenda una asesor&iacute;a gratuita y descubre la soluci&oacute;n perfecta para ti.
            </p>
            <button class="btn btn--primary reveal-item" @click="navigate('/calificar')">
              Calificar y contactar
              <i class="fa-solid fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 8rem 1.5rem 5rem;
  box-sizing: border-box;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 10rem 3rem 6rem;
  }

  @media (min-width: 1024px) {
    padding: 10rem 4rem 6rem;
  }

  &__bg {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  &__gradient {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 70% at 20% 30%, rgba($azul-medio, 0.35) 0%, transparent 55%),
      radial-gradient(ellipse 50% 50% at 80% 80%, rgba($rojo, 0.1) 0%, transparent 50%),
      linear-gradient(135deg, $azul-oscuro 0%, darken($azul-oscuro, 4%) 100%);
  }

  &__orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.35;

    &--1 {
      width: 500px;
      height: 500px;
      background: $azul-medio;
      top: -100px;
      right: 10%;
    }

    &--2 {
      width: 400px;
      height: 400px;
      background: $rojo;
      bottom: -150px;
      left: 5%;
    }
  }

  &__grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
    width: 100%;
    margin: 2rem auto;

    @media (min-width: 1024px) {
      grid-template-columns: 1.1fr 1fr;
      gap: 6rem;
      margin: 3rem auto;
    }

    @media (min-width: 1600px) {
      grid-template-columns: 1fr 1.2fr;
      gap: 8rem;
      margin: 4rem auto;
    }
  }

  &__content {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }

    @media (min-width: 1700px) {
      text-align: center;
    }
  }

  &__label {
    display: inline-block;
    font-family: $font-secondary;
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: $celeste-claro;
    background: rgba($azul-medio, 0.25);
    border: 1px solid rgba($celeste-claro, 0.2);
    padding: 0.6rem 1.5rem;
    border-radius: 100px;
    margin-bottom: 1.5rem;
  }

  &__title {
    margin: 0 0 1.5rem;
  }

  &__title-line {
    display: block;
    font-family: $font-display;
    font-size: clamp(2.5rem, 7vw, 5rem);
    font-weight: 800;
    line-height: 1.05;
    letter-spacing: -0.04em;

    @media (min-width: 1600px) {
      font-size: clamp(2.5rem, 6vw, 5.5rem);
    }
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: clamp(1rem, 1.5vw, 1.35rem);
    color: rgba($white, 0.65);
    line-height: 1.7;
    max-width: 580px;
    margin: 0 auto 2rem;

    @media (min-width: 1024px) {
      margin: 0 0 2rem;
    }

    @media (min-width: 1600px) {
      max-width: 640px;
    }

    @media (min-width: 1700px) {
      margin-left: auto;
      margin-right: auto;
    }
  }

  &__actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;

    @media (min-width: 1024px) {
      justify-content: flex-start;
    }

    @media (min-width: 1700px) {
      justify-content: center;
    }
  }

  &__visual {
    position: relative;
    display: flex;
    justify-content: center;

    @media (min-width: 1024px) {
      justify-content: flex-end;
    }

    @media (min-width: 1600px) {
      justify-content: center;
    }
  }

  &__image-wrapper {
    position: relative;
    width: 100%;
    max-width: 560px;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    box-shadow: 0 40px 80px rgba($black, 0.35);

    @media (min-width: 1440px) {
      max-width: 680px;
    }

    @media (min-width: 1600px) {
      max-width: 820px;
    }
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($azul-medio, 0.25), rgba($azul-oscuro, 0.45));
  }

  &__floating-card {
    position: absolute;
    bottom: -20px;
    left: 0;
    display: flex;
    align-items: center;
    gap: 1rem;
    background: rgba($azul-oscuro, 0.9);
    border: 1px solid rgba($white, 0.08);
    border-radius: 16px;
    padding: 1.25rem 1.75rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 20px 40px rgba($black, 0.25);

    @media (min-width: 1024px) {
      left: -40px;
    }
  }

  &__floating-icon {
    font-size: 1.75rem;
    color: $celeste-claro;
  }

  &__floating-value {
    display: block;
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 700;
    color: $white;
  }

  &__floating-label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: rgba($white, 0.5);
  }

  &__scroll {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    z-index: 1;

    &-text {
      font-family: $font-secondary;
      font-size: 0.65rem;
      text-transform: uppercase;
      letter-spacing: 0.2em;
      color: rgba($white, 0.35);
    }

    &-line {
      width: 1px;
      height: 50px;
      background: linear-gradient(to bottom, rgba($white, 0.4), transparent);
      animation: scrollPulse 2s ease-in-out infinite;
    }
  }
}

@keyframes scrollPulse {
  0%, 100% { transform: scaleY(1); opacity: 1; }
  50% { transform: scaleY(0.6); opacity: 0.3; }
}

.marquee {
  background: rgba($azul-medio, 0.08);
  border-top: 1px solid rgba($white, 0.06);
  border-bottom: 1px solid rgba($white, 0.06);
  padding: 1.5rem 0;
  overflow: hidden;

  &__track {
    display: flex;
    width: max-content;
    gap: 2rem;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-family: $font-display;
    font-size: clamp(1rem, 2vw, 1.5rem);
    font-weight: 600;
    color: rgba($white, 0.15);
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.1em;

    i {
      color: $celeste-claro;
      opacity: 0.4;
    }
  }
}

.features-bar {
  background: linear-gradient(180deg, darken($azul-oscuro, 2%) 0%, $azul-oscuro 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 2rem auto;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
      margin: 3rem auto;
    }
  }
}

.feature-mini {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  background: rgba($white, 0.02);
  border: 1px solid rgba($white, 0.06);
  border-radius: 16px;
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    background: rgba($azul-medio, 0.1);
    border-color: rgba($celeste-claro, 0.15);
    transform: translateY(-4px);
  }

  &__icon {
    font-size: 1.5rem;
    color: $celeste-claro;
    flex-shrink: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: rgba($white, 0.5);
    line-height: 1.5;
    margin: 0;
  }
}

.about-teaser {
  background: linear-gradient(180deg, $azul-oscuro 0%, darken($azul-oscuro, 2%) 100%);

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 4rem;
    align-items: center;
    margin: 2rem auto;

    @media (min-width: 1024px) {
      grid-template-columns: 1fr 1fr;
      gap: 6rem;
      margin: 3rem auto;
    }

    @media (min-width: 1600px) {
      gap: 8rem;
      margin: 4rem auto;
    }
  }

  &__image-wrapper {
    position: relative;
    border-radius: 24px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    box-shadow: 0 30px 60px rgba($black, 0.3);
  }

  &__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__image-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba($azul-medio, 0.2), rgba($azul-oscuro, 0.35));
  }

  &__text {
    text-align: center;

    @media (min-width: 1024px) {
      text-align: left;
    }
  }

  &__paragraph {
    font-family: $font-secondary;
    font-size: 1.05rem;
    color: rgba($white, 0.6);
    line-height: 1.8;
    margin: 0 0 1.25rem;
  }
}

.products-preview {
  background: linear-gradient(180deg, darken($azul-oscuro, 2%) 0%, $azul-oscuro 100%);
  margin: 0 auto;

  .container {
    margin: 0 auto;
  }

  .section-header {
    text-align: center;
    margin-bottom: 4rem;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;
    margin: 0 auto;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}

.product-card {
  position: relative;
  min-height: 320px;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1.75rem;
  background: rgba($white, 0.06);
  border: 1px solid rgba($white, 0.12);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  font-family: inherit;
  text-align: left;
  color: inherit;

  &:focus-visible {
    outline: 2px solid $celeste-claro;
    outline-offset: 3px;
  }

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 60px rgba($black, 0.3);

    .product-card__bg {
      transform: scale(1.05);
    }

    .product-card__link {
      color: $rojo;
    }
  }

  &--large {
    @media (min-width: 1024px) {
      grid-row: span 2;
      min-height: 520px;
    }
  }

  &--wide {
    @media (min-width: 1024px) {
      grid-column: span 2;
    }
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.8s ease;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba($azul-oscuro, 0.95) 0%, rgba($azul-oscuro, 0.4) 60%, transparent 100%);
  }

  &__content {
    position: relative;
    z-index: 1;
  }

  &__number {
    position: absolute;
    top: 1.25rem;
    right: 1.25rem;
    font-family: $font-display;
    font-size: 3rem;
    font-weight: 800;
    color: rgba($white, 0.06);
  }

  &__icon {
    font-size: 2rem;
    color: $celeste-claro;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: rgba($white, 0.65);
    line-height: 1.5;
    margin: 0 0 1rem;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 600;
    color: rgba($white, 0.8);
    transition: color 0.3s;

    i {
      font-size: 0.75rem;
    }
  }
}

.stats {
  background: linear-gradient(180deg, $azul-oscuro 0%, darken($azul-oscuro, 2%) 100%);
  margin: 2rem 0;

  @media (min-width: 1024px) {
    margin: 4rem 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    margin: 0 auto;

    @media (min-width: 768px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.stat {
  text-align: center;
  padding: 2.5rem 1rem;
  background: rgba($white, 0.02);
  border: 1px solid rgba($white, 0.06);
  border-radius: 16px;

  &__icon {
    font-size: 1.75rem;
    color: $celeste-claro;
    margin-bottom: 1rem;
  }

  &__value {
    display: block;
    font-family: $font-display;
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, $celeste-claro, $azul-medio);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: rgba($white, 0.5);
  }
}

.cta {
  background: linear-gradient(180deg, darken($azul-oscuro, 2%) 0%, darken($azul-oscuro, 5%) 100%);
  margin: 0 auto;

  .container {
    margin: 0 auto;
  }

  &__inner {
    position: relative;
    border-radius: 32px;
    overflow: hidden;
    min-height: 400px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 4rem 1.5rem;
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: rgba($azul-oscuro, 0.8);
  }

  &__content {
    position: relative;
    z-index: 1;
    max-width: 700px;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    line-height: 1.1;
    margin: 0 0 1.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($white, 0.65);
    line-height: 1.7;
    margin: 0 0 2rem;
  }
}

.reveal-item {
  opacity: 1;
  transform: translateY(0);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border: none;
  border-radius: 10px;
  font-family: $font-secondary;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &--primary {
    background: $rojo;
    color: $white;

    &:hover {
      background: lighten($rojo, 8%);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($rojo, 0.3);
    }
  }

  &--ghost {
    background: transparent;
    color: $white;
    border: 1px solid rgba($white, 0.2);

    &:hover {
      border-color: $white;
      background: rgba($white, 0.05);
      transform: translateY(-2px);
    }
  }

  &--outline {
    background: transparent;
    color: $white;
    border: 1px solid rgba($white, 0.2);

    &:hover {
      border-color: $rojo;
      color: $rojo;
      transform: translateY(-2px);
    }
  }
}
</style>
