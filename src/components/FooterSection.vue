<script setup lang="ts">
const year = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <i class="fa-solid fa-droplet footer__logo"></i>
          <div>
            <span class="footer__name">HELISA</span>
            <span class="footer__tagline">Health &amp; Life S.A.</span>
          </div>
        </div>

        <div class="footer__links">
          <a href="https://helisa.com.ec" target="_blank" rel="noopener noreferrer">helisa.com.ec</a>
        </div>
      </div>

      <div class="footer__bottom">
        <span>&copy; {{ year }} HELISA. Todos los derechos reservados.</span>
        <span class="footer__slogan">Pensando en su bienestar</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.footer {
  background: darken($azul-oscuro, 4%);
  border-top: 1px solid rgba($white, 0.06);
  padding: 3rem 2rem 2rem;

  &__inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 1.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid rgba($white, 0.06);
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__logo {
    font-size: 1.5rem;
    color: $celeste-claro;
  }

  &__name {
    display: block;
    font-family: $font-display;
    font-weight: 700;
    font-size: 1rem;
    letter-spacing: 0.05em;
  }

  &__tagline {
    font-family: $font-secondary;
    font-size: 0.75rem;
    color: rgba($white, 0.4);
  }

  &__links {
    a {
      font-family: $font-secondary;
      font-size: 0.85rem;
      color: rgba($white, 0.5);
      transition: color 0.3s;

      &:hover {
        color: $celeste-claro;
      }
    }
  }

  &__bottom {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding-top: 1.5rem;
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: rgba($white, 0.35);
  }

  &__slogan {
    color: rgba($rojo, 0.5);
    font-style: italic;
  }
}
</style>
