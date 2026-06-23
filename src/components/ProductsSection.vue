<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Product {
  title: string
  description: string
  icon: string
  features: string[]
}

const products: Product[] = [
  {
    title: 'Ozono',
    description: 'Elimina bacterias, virus y microorganismos sin dejar residuos qu&iacute;micos.',
    icon: 'ozone',
    features: ['Desinfecci&oacute;n total', 'Sin qu&iacute;micos', 'Aire y agua'],
  },
  {
    title: 'Luz Ultravioleta',
    description: 'Radiaci&oacute;n UV de alta eficiencia para eliminar pat&oacute;genos al instante.',
    icon: 'uv',
    features: ['Esterilizaci&oacute;n r&aacute;pida', 'F&aacute;cil instalaci&oacute;n', 'Bajo mantenimiento'],
  },
  {
    title: '&Oacute;smosis Inversa',
    description: 'El m&aacute;s alto nivel de pureza eliminando sales, metales y contaminantes.',
    icon: 'ro',
    features: ['Agua ultra pura', 'Filtraci&oacute;n fina', 'Sabor mejorado'],
  },
  {
    title: 'Filtraci&oacute;n',
    description: 'Sistemas completos de filtraci&oacute;n para agua y aire con repuestos garantizados.',
    icon: 'filter',
    features: ['Repuestos originales', 'Asesor&iacute;a t&eacute;cnica', 'Servicio en Ecuador'],
  },
]

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
    { threshold: 0.1 },
  )

  const el = document.getElementById('products')
  if (el) observer.observe(el)
})
</script>

<template>
  <section id="products" class="products section-padding">
    <div class="container">
      <div :class="['products__header', { 'products__header--visible': visible }]">
        <span class="products__label">Nuestros Sistemas</span>
        <h2 class="products__title">Tecnolog&iacute;as que transforman</h2>
        <p class="products__desc">
          Ofrecemos las mejores soluciones en tratamiento y purificaci&oacute;n
          de agua y aire con respaldo t&eacute;cnico en todo el Ecuador.
        </p>
      </div>

      <div class="products__grid">
        <article
          v-for="(product, i) in products"
          :key="product.title"
          :class="['product-card', { 'product-card--visible': visible }]"
          :style="{ transitionDelay: `${i * 0.1}s` }"
        >
          <div class="product-card__icon">
            <i v-if="product.icon === 'ozone'" class="fa-solid fa-atom"></i>
            <i v-else-if="product.icon === 'uv'" class="fa-solid fa-sun"></i>
            <i v-else-if="product.icon === 'ro'" class="fa-solid fa-filter-circle-xmark"></i>
            <i v-else class="fa-solid fa-filter"></i>
          </div>

          <h3 class="product-card__title">{{ product.title }}</h3>
          <p class="product-card__desc" v-html="product.description" />

          <ul class="product-card__features">
            <li v-for="feature in product.features" :key="feature" class="product-card__feature">
              <i class="fa-solid fa-circle-check product-card__check"></i>
              <span v-html="feature" />
            </li>
          </ul>
        </article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.products {
  background: linear-gradient(180deg, darken($azul-oscuro, 2%) 0%, $azul-oscuro 100%);

  &__header {
    text-align: center;
    margin-bottom: 4rem;
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__label {
    display: inline-block;
    font-family: $font-secondary;
    font-size: 0.8rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: $rojo;
    margin-bottom: 1rem;
  }

  &__title {
    font-family: $font-display;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 700;
    letter-spacing: -0.03em;
    margin: 0 0 1.25rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: rgba($white, 0.6);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.7;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.5rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (min-width: 1024px) {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}

.product-card {
  background: rgba($white, 0.03);
  border: 1px solid rgba($white, 0.06);
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  opacity: 0;
  transform: translateY(40px);

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  &:hover {
    background: rgba($azul-medio, 0.15);
    border-color: rgba($celeste-claro, 0.2);
    transform: translateY(-4px);
    box-shadow: 0 20px 60px rgba($azul-medio, 0.2);
  }

  &__icon {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
    color: $celeste-claro;
  }

  &__check {
    color: $verde;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.4rem;
    font-weight: 600;
    margin: 0 0 0.75rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: rgba($white, 0.6);
    line-height: 1.6;
    margin: 0 0 1.5rem;
  }

  &__features {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__feature {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: rgba($white, 0.7);
  }

  &__check {
    flex-shrink: 0;
  }
}
</style>
