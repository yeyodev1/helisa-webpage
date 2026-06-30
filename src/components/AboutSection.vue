<script setup lang="ts">
import { ref, onMounted } from 'vue'

const visible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0]
      if (entry?.isIntersecting) {
        visible.value = true
        observer.disconnect()
      }
    },
    { threshold: 0.15 },
  )

  const el = document.getElementById('about')
  if (el) observer.observe(el)
})

const stats = [
  { value: '20+', label: 'A&ntilde;os de experiencia' },
  { value: '100%', label: 'Atenci&oacute;n personalizada' },
  { value: '24/7', label: 'Soporte t&eacute;cnico' },
  { value: '10K+', label: 'Clientes satisfechos' },
]
</script>

<template>
  <section id="about" class="about section-padding">
    <div class="container">
      <div :class="['about__content', { 'about__content--visible': visible }]">
        <div class="about__text">
          <span class="about__label">Nuestra Historia</span>
          <h2 class="about__title">Pensando en su bienestar</h2>
          <p class="about__paragraph">
            <strong>HELISA</strong> — Health &amp; Life S.A. — nace con la misi&oacute;n de
            ofrecer los mejores sistemas de tratamiento y purificaci&oacute;n de
            agua y aire con respaldo de repuestos y atenci&oacute;n personalizada
            en todo el Ecuador.
          </p>
          <p class="about__paragraph">
            Creemos que el agua es sin&oacute;nimo de movimiento, dinamismo, salud y
            energ&iacute;a. Por eso cada soluci&oacute;n que ofrecemos est&aacute; dise&ntilde;ada
            pensando en usted y su familia.
          </p>
        </div>

        <div class="about__pillars">
          <div class="pillar">
            <div class="pillar__icon">
              <i class="fa-solid fa-circle-check"></i>
            </div>
            <h4 class="pillar__title">Calidad</h4>
            <p class="pillar__desc">Productos de alta calidad para ser l&iacute;deres del mercado.</p>
          </div>
          <div class="pillar">
            <div class="pillar__icon">
              <i class="fa-solid fa-lightbulb"></i>
            </div>
            <h4 class="pillar__title">Innovaci&oacute;n</h4>
            <p class="pillar__desc">Ambiente laboral proactivo e innovador.</p>
          </div>
          <div class="pillar">
            <div class="pillar__icon">
              <i class="fa-solid fa-hand-holding-heart"></i>
            </div>
            <h4 class="pillar__title">Responsabilidad</h4>
            <p class="pillar__desc">Compromiso ambiental y social con comunidades.</p>
          </div>
        </div>
      </div>

      <div :class="['about__stats', { 'about__stats--visible': visible }]">
        <div v-for="s in stats" :key="s.label" class="stat">
          <span class="stat__value">{{ s.value }}</span>
          <span class="stat__label" v-html="s.label" />
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.about {
  background: linear-gradient(180deg, $azul-oscuro 0%, darken($azul-oscuro, 2%) 100%);

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    margin-bottom: 5rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (min-width: 768px) {
      grid-template-columns: 1fr 1fr;
      gap: 4rem;
    }
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: $rojo;
    margin-bottom: 1rem;
    display: block;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 1.5rem;
    line-height: 1.15;
  }

  &__paragraph {
    font-family: $font-secondary;
    font-size: 1rem;
    color: rgba($white, 0.65);
    line-height: 1.8;
    margin: 0 0 1.25rem;

    strong {
      color: $white;
    }
  }

  &__pillars {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  &__stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s;

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }

    @media (min-width: 640px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.pillar {
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.06);
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.3s;

  &:hover {
    background: rgba($azul-medio, 0.1);
    border-color: rgba($celeste-claro, 0.15);
  }

  &__icon {
    font-size: 1.75rem;
    color: $celeste-claro;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0 0 0.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: rgba($white, 0.5);
    line-height: 1.5;
    margin: 0;
  }
}

.stat {
  text-align: center;
  padding: 2rem 1rem;
  background: rgba($white, 0.02);
  border: 1px solid rgba($white, 0.06);
  border-radius: 12px;

  &__value {
    display: block;
    font-family: $font-display;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, $celeste-claro, $azul-medio);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.25rem;
  }

  &__label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: rgba($white, 0.5);
  }
}
</style>
