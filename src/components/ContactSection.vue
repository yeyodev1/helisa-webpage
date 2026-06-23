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
    { threshold: 0.1 },
  )

  const el = document.getElementById('contact')
  if (el) observer.observe(el)
})
</script>

<template>
  <section id="contact" class="contact section-padding">
    <div class="container">
      <div :class="['contact__content', { 'contact__content--visible': visible }]">
        <div class="contact__info">
          <span class="contact__label">Contacto</span>
          <h2 class="contact__title">Hablemos</h2>
          <p class="contact__desc">
            Estamos listos para asesorarte en la mejor soluci&oacute;n para tu hogar o negocio.
          </p>

          <div class="contact__details">
            <div class="contact__detail">
              <i class="fa-regular fa-clock"></i>
              <span>Lun - Vie: 8:00 - 18:00</span>
            </div>
            <div class="contact__detail">
              <i class="fa-regular fa-envelope"></i>
              <span>info@helisa.com.ec</span>
            </div>
            <div class="contact__detail">
              <i class="fa-solid fa-location-dot"></i>
              <span>Ecuador</span>
            </div>
          </div>
        </div>

        <form class="contact__form" @submit.prevent>
          <div class="form__group">
            <input type="text" placeholder="Nombre" class="form__input" />
          </div>
          <div class="form__group">
            <input type="email" placeholder="Correo electr&oacute;nico" class="form__input" />
          </div>
          <div class="form__group">
            <input type="tel" placeholder="Tel&eacute;fono" class="form__input" />
          </div>
          <div class="form__group">
            <textarea placeholder="Cu&eacute;ntanos sobre tu proyecto" class="form__input form__textarea" rows="4" />
          </div>
          <button type="submit" class="form__submit">
            Enviar mensaje
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.contact {
  background: linear-gradient(180deg, darken($azul-oscuro, 2%) 0%, $azul-oscuro 100%);

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
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
    margin: 0 0 1rem;
    line-height: 1.15;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 1rem;
    color: rgba($white, 0.6);
    line-height: 1.7;
    margin: 0 0 2rem;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__detail {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: rgba($white, 0.7);

    i {
      color: $celeste-claro;
      flex-shrink: 0;
      font-size: 1.1rem;
    }
  }
}

.form {
  &__group {
    margin-bottom: 1rem;
  }

  &__input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: rgba($white, 0.04);
    border: 1px solid rgba($white, 0.1);
    border-radius: 10px;
    color: $white;
    font-family: $font-secondary;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;

    &::placeholder {
      color: rgba($white, 0.3);
    }

    &:focus {
      border-color: $azul-medio;
      background: rgba($azul-medio, 0.08);
      box-shadow: 0 0 0 3px rgba($azul-medio, 0.15);
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 1rem 2rem;
    background: $rojo;
    color: $white;
    border: none;
    border-radius: 10px;
    font-family: $font-secondary;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover {
      background: lighten($rojo, 8%);
      transform: translateY(-2px);
      box-shadow: 0 8px 30px rgba($rojo, 0.3);
    }
  }
}
</style>
