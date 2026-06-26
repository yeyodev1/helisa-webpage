<script setup lang="ts">
const year = new Date().getFullYear()

const quickLinks = [
  { label: 'Proyectos', to: '/proyectos' },
  { label: 'Productos', to: '/productos' },
  { label: 'Nosotros', to: '/nosotros' },
  { label: 'Contacto', to: '/calificar' },
]

const policies = [
  { label: 'Políticas de Calidad', href: 'https://drive.google.com/file/d/1H0IvO5rZaQ-V3kYRFQFPeToOEWLvXcVA/view?usp=sharing' },
  { label: 'Quality Policy', href: 'https://drive.google.com/file/d/1E0_KtsfECkq2ef6XBRa8_k1jC2XrC8Ow/view?usp=sharing' },
  { label: 'Términos de garantía', href: 'https://drive.google.com/file/d/1Pwff9TiEfkrdosVEorCTXOhBHvs75TK_/view?usp=sharing' },
]

const socials = [
  { icon: 'fa-facebook-f', href: 'https://www.facebook.com/Helisa.Ecuador', label: 'Facebook' },
  { icon: 'fa-instagram', href: 'https://www.instagram.com/helisa_ec/', label: 'Instagram' },
  { icon: 'fa-youtube', href: 'https://www.youtube.com/channel/UCCxfJDx4_4VWMWAL57zsr2Q', label: 'YouTube' },
  { icon: 'fa-linkedin-in', href: 'https://www.linkedin.com/company/health-and-life-helisa/', label: 'LinkedIn' },
  { icon: 'fa-whatsapp', href: 'https://api.whatsapp.com/send/?phone=5930987125598&text=Hola,+quisiera+comunicarme+con+un+asesor', label: 'WhatsApp' },
]
</script>

<template>
  <footer class="footer">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <img src="/images/logo/helisa-logo.png" alt="HELISA" class="footer__logo-img" />
          <div>
            <span class="footer__name">HELISA</span>
            <span class="footer__tagline">Health &amp; Life S.A.</span>
          </div>
        </div>

        <div class="footer__columns">
          <div class="footer__column">
            <h4 class="footer__heading">Enlaces</h4>
            <nav class="footer__links">
              <RouterLink v-for="link in quickLinks" :key="link.to" :to="link.to" class="footer__link">
                {{ link.label }}
              </RouterLink>
            </nav>
          </div>

          <div class="footer__column">
            <h4 class="footer__heading">Documentos</h4>
            <nav class="footer__links">
              <a
                v-for="policy in policies"
                :key="policy.href"
                :href="policy.href"
                target="_blank"
                rel="noopener noreferrer"
                class="footer__link"
              >
                {{ policy.label }}
              </a>
            </nav>
          </div>

          <div class="footer__column">
            <h4 class="footer__heading">Contacto</h4>
            <div class="footer__contact">
              <span><strong>PBX:</strong> 3713730</span>
              <span><strong>Celular:</strong> 098 491 8317 - 098 084 5940</span>
              <span>Ecuador</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer__bottom">
        <div class="footer__socials">
          <a
            v-for="social in socials"
            :key="social.label"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="footer__social"
            :aria-label="social.label"
          >
            <i :class="['fa-brands', social.icon]"></i>
          </a>
        </div>
        <span class="footer__copyright">&copy; {{ year }} HELISA. Todos los derechos reservados.</span>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.footer {
  background: $black;
  color: $white;
  padding: 4rem 2rem 2rem;

  &__inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: 3rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba($white, 0.1);

    @media (min-width: 768px) {
      grid-template-columns: 1fr 2fr;
      gap: 4rem;
    }
  }

  &__brand {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__logo-img {
    width: 44px;
    height: 44px;
    object-fit: contain;
  }

  &__name {
    display: block;
    font-family: $font-display;
    font-weight: 500;
    font-size: 1.1rem;
    letter-spacing: -0.02em;
  }

  &__tagline {
    font-family: $font-secondary;
    font-size: 0.75rem;
    color: rgba($white, 0.5);
  }

  &__columns {
    display: grid;
    grid-template-columns: 1fr;
    gap: 2rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(3, 1fr);
    }
  }

  &__heading {
    font-family: $font-secondary;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: rgba($white, 0.4);
    margin: 0 0 1.25rem;
  }

  &__links {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__link {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: rgba($white, 0.7);
    transition: color 0.3s;

    &:hover {
      color: $white;
    }
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: rgba($white, 0.7);

    strong {
      color: $white;
      font-weight: 500;
    }
  }

  &__bottom {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    justify-content: space-between;
    gap: 1.5rem;
    padding-top: 2rem;

    @media (min-width: 640px) {
      flex-direction: row;
    }
  }

  &__socials {
    display: flex;
    gap: 0.75rem;
  }

  &__social {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba($white, 0.15);
    border-radius: 50%;
    color: rgba($white, 0.7);
    transition: all 0.3s;

    &:hover {
      background: $white;
      color: $black;
      border-color: $white;
    }
  }

  &__copyright {
    font-family: $font-secondary;
    font-size: 0.8rem;
    color: rgba($white, 0.4);
  }
}
</style>
