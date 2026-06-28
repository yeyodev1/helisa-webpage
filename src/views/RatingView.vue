<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
})

const rating = ref(0)
const hoverRating = ref(0)
const selectedTags = ref<string[]>([])
const isSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const tags = [
  'Atención personalizada',
  'Calidad del producto',
  'Instalación rápida',
  'Soporte técnico',
  'Precio competitivo',
  'Recomendación',
]

const triggers: ScrollTrigger[] = []

const isFormValid = computed(() => {
  return form.value.name && form.value.email && rating.value > 0
})

const toggleTag = (tag: string) => {
  const index = selectedTags.value.indexOf(tag)
  if (index > -1) {
    selectedTags.value.splice(index, 1)
  } else {
    selectedTags.value.push(tag)
  }
}

const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3500)
}

const submitForm = async () => {
  if (!isFormValid.value) {
    showNotification('Completa tu nombre, correo y calificación.', 'error')
    return
  }

  isSubmitting.value = true

  await new Promise((resolve) => setTimeout(resolve, 1200))

  const newLead = {
    id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
    name: form.value.name,
    email: form.value.email,
    phone: form.value.phone,
    company: form.value.company,
    rating: rating.value,
    tags: [...selectedTags.value],
    message: form.value.message,
    createdAt: new Date().toLocaleString('es-EC'),
    status: 'nuevo',
  }

  const stored = JSON.parse(localStorage.getItem('helisa_crm_leads') || '[]')
  stored.unshift(newLead)
  localStorage.setItem('helisa_crm_leads', JSON.stringify(stored))

  form.value = { name: '', email: '', phone: '', company: '', message: '' }
  rating.value = 0
  hoverRating.value = 0
  selectedTags.value = []
  isSubmitting.value = false

  showNotification('¡Gracias! Hemos recibido tu mensaje. Te contactaremos pronto.')
}

const getRatingLabel = (stars: number) => {
  const labels: Record<number, string> = {
    1: 'Necesita mejora',
    2: 'Regular',
    3: 'Bueno',
    4: 'Muy bueno',
    5: 'Excelente',
  }
  return labels[stars] || ''
}

onMounted(() => {
  const headerTl = gsap.timeline()
  headerTl
    .from('.rating-header__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.rating-header__title', { y: 80, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('.rating-header__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  const bodyTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.rating-body',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })
  bodyTl
    .from('.rating-context', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.rating-form', { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.4')
  if (bodyTl.scrollTrigger) triggers.push(bodyTl.scrollTrigger)
})

onUnmounted(() => {
  triggers.forEach((trigger) => trigger.kill())
})
</script>

<template>
  <main class="rating-page">
    <section class="rating-header">
      <div class="rating-header__bg">
        <div class="rating-header__grid" />
      </div>
      <div class="container rating-header__content">
        <span class="rating-header__label">Contacto</span>
        <h1 class="rating-header__title">Contáctanos y <span class="text-gradient">califica</span></h1>
        <p class="rating-header__desc">
          Estamos listos para ayudarte. Cuéntanos tu experiencia o solicita asesoría especializada en
          tratamiento de agua y aire para tu hogar o industria.
        </p>
      </div>
    </section>

    <section class="rating-body section-padding">
      <div class="container rating-body__inner">
        <aside class="rating-context">
          <div class="rating-context__card">
            <div class="rating-context__header">
              <div class="rating-context__icon">
                <i class="fa-solid fa-water"></i>
              </div>
              <h2 class="rating-context__title">HELISA</h2>
              <p class="rating-context__subtitle">Health &amp; Life S.A.</p>
            </div>
            <p class="rating-context__text">
              Más de 15 años purificando agua y aire en Ecuador. Soluciones para hogares,
              industrias, laboratorios, hospitales y más.
            </p>
            <p class="rating-context__text">
              Cada solicitud que recibes se registra en nuestro sistema CRM y un asesor
              especializado te contactará en las próximas 24 horas.
            </p>
          </div>

          <div class="rating-context__contact">
            <div class="contact-item">
              <div class="contact-item__icon">
                <i class="fa-solid fa-phone"></i>
              </div>
              <div>
                <span class="contact-item__label">Teléfono</span>
                <span class="contact-item__value">+593 4 123 4567</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-item__icon">
                <i class="fa-solid fa-envelope"></i>
              </div>
              <div>
                <span class="contact-item__label">Correo</span>
                <span class="contact-item__value">contacto@helisa.ec</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-item__icon">
                <i class="fa-solid fa-location-dot"></i>
              </div>
              <div>
                <span class="contact-item__label">Dirección</span>
                <span class="contact-item__value">Guayaquil, Ecuador</span>
              </div>
            </div>
            <div class="contact-item">
              <div class="contact-item__icon">
                <i class="fa-solid fa-clock"></i>
              </div>
              <div>
                <span class="contact-item__label">Horario</span>
                <span class="contact-item__value">Lun – Vie, 08:00 – 17:00</span>
              </div>
            </div>
          </div>
        </aside>

        <form class="rating-form" @submit.prevent="submitForm">
          <div class="rating-form__section">
            <h2 class="rating-form__title">¿Cómo fue tu experiencia?</h2>

            <div class="rating-stars">
              <button
                v-for="star in 5"
                :key="star"
                type="button"
                class="rating-stars__star"
                :class="{ 'rating-stars__star--active': star <= (hoverRating || rating) }"
                @mouseenter="hoverRating = star"
                @mouseleave="hoverRating = 0"
                @click="rating = star"
                :aria-label="`Calificar con ${star} estrellas`"
              >
                <i :class="star <= (hoverRating || rating) ? 'fa-solid fa-star' : 'fa-regular fa-star'"></i>
              </button>
            </div>
            <span v-if="rating > 0" class="rating-stars__label">{{ getRatingLabel(rating) }}</span>

            <div class="rating-tags">
              <button
                v-for="tag in tags"
                :key="tag"
                type="button"
                class="rating-tags__tag"
                :class="{ 'rating-tags__tag--active': selectedTags.includes(tag) }"
                @click="toggleTag(tag)"
              >
                {{ tag }}
              </button>
            </div>
          </div>

          <div class="rating-form__section">
            <h3 class="rating-form__subtitle">Tus datos</h3>
            <div class="rating-form__grid">
              <div class="form-field">
                <label class="form-field__label">Nombre completo *</label>
                <input v-model="form.name" type="text" class="form-field__input" placeholder="Ej. Juan Pérez" required />
              </div>
              <div class="form-field">
                <label class="form-field__label">Correo electrónico *</label>
                <input v-model="form.email" type="email" class="form-field__input" placeholder="juan@email.com" required />
              </div>
              <div class="form-field">
                <label class="form-field__label">Teléfono</label>
                <input v-model="form.phone" type="tel" class="form-field__input" placeholder="099 123 4567" />
              </div>
              <div class="form-field">
                <label class="form-field__label">Empresa / Sector</label>
                <input v-model="form.company" type="text" class="form-field__input" placeholder="Ej. Industria, Hogar" />
              </div>
            </div>
          </div>

          <div class="form-field">
            <label class="form-field__label">Comentarios</label>
            <textarea v-model="form.message" class="form-field__input form-field__textarea" rows="4" placeholder="Cuéntanos sobre tu proyecto o consulta..."></textarea>
          </div>

          <button type="submit" class="rating-form__submit" :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting" class="rating-form__spinner" />
            <template v-else>
              Enviar a CRM
              <i class="fa-solid fa-arrow-right"></i>
            </template>
          </button>
        </form>
      </div>
    </section>

    <Transition name="toast">
      <div v-if="showToast" class="toast" :class="`toast--${toastType}`" role="status" aria-live="polite">
        <span class="toast__message">{{ toastMessage }}</span>
      </div>
    </Transition>
  </main>
</template>

<style lang="scss" scoped>
@use '@/styles/colorVariables.module.scss' as *;
@use '@/styles/fonts.module.scss' as *;

.rating-page {
  padding-top: 80px;
  min-height: 100vh;

  section {
    margin-top: 3rem;

    @media (min-width: 768px) {
      margin-top: 4rem;
    }

    @media (min-width: 1024px) {
      margin-top: 5rem;
    }
  }
}

.rating-header {
  position: relative;
  min-height: 55vh;
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
    max-width: 800px;
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
    max-width: 600px;
    margin: 0;
    line-height: 1.7;
  }
}

.rating-body {
  background: $background-soft;

  &__inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 3rem;
    width: 100%;

    @media (min-width: 1024px) {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      gap: 3rem;
    }
  }
}

.rating-context {
  width: 100%;
  max-width: 420px;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  @media (min-width: 1024px) {
    position: sticky;
    top: 100px;
    flex: 1;
  }

  &__card {
    background: $white;
    border: 1px solid $border;
    border-radius: 28px;
    padding: 2rem;
  }

  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid $border;
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    background: $black;
    border-radius: 18px;
    color: $white;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.35rem;
    font-weight: 500;
    color: $black;
    margin: 0;
  }

  &__subtitle {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $foreground-muted;
    margin: 0;
  }

  &__text {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.7;
    margin: 0 0 0.75rem;

    &:last-child {
      margin-bottom: 0;
    }
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: $white;
  border: 1px solid $border;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $gray-300;
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba($black, 0.04);
  }

  &__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 44px;
    height: 44px;
    background: $black;
    border-radius: 12px;
    color: $white;
    font-size: 1.1rem;
    flex-shrink: 0;
  }

  &__label {
    display: block;
    font-family: $font-secondary;
    font-size: 0.7rem;
    font-weight: 600;
    color: $foreground-muted;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.15rem;
  }

  &__value {
    display: block;
    font-family: $font-secondary;
    font-size: 0.9rem;
    font-weight: 500;
    color: $black;
  }
}

.rating-form {
  width: 100%;
  max-width: 700px;
  box-sizing: border-box;
  background: $white;
  border: 1px solid $border;
  border-radius: 28px;
  padding: 2.5rem;

  @media (min-width: 768px) {
    padding: 3rem;
  }

  @media (min-width: 1024px) {
    max-width: none;
    flex: 1.3;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 1.5rem;
  }

  &__subtitle {
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 1.25rem;
  }

  &__section {
    margin-bottom: 2.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid $border;

    &:last-of-type {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1.25rem;

    @media (min-width: 640px) {
      grid-template-columns: 1fr 1fr;
    }
  }

  &__submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    width: 100%;
    padding: 1.1rem 2rem;
    margin-top: 2rem;
    background: $black;
    color: $white;
    border: none;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.95rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

    &:hover:not(:disabled) {
      background: $gray-800;
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba($black, 0.15);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  &__spinner {
    width: 20px;
    height: 20px;
    border: 2px solid rgba($white, 0.3);
    border-top-color: $white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.rating-stars {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;

  &__star {
    font-size: 2.5rem;
    background: none;
    border: none;
    color: $gray-300;
    cursor: pointer;
    transition: all 0.2s;
    padding: 0;

    &:hover {
      transform: scale(1.15);
    }

    &--active {
      color: $black;
    }
  }

  &__label {
    display: block;
    text-align: center;
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $foreground-muted;
    margin-bottom: 1.5rem;
  }
}

.rating-tags {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.5rem;

  &__tag {
    padding: 0.55rem 1.1rem;
    background: $background-soft;
    border: 1px solid $border;
    border-radius: 100px;
    color: $foreground-muted;
    font-family: $font-secondary;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover,
    &--active {
      background: $black;
      border-color: $black;
      color: $white;
    }
  }
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &__label {
    font-family: $font-secondary;
    font-size: 0.8rem;
    font-weight: 500;
    color: $foreground-muted;
  }

  &__input {
    width: 100%;
    padding: 1rem 1.25rem;
    background: $white;
    border: 1px solid $border;
    border-radius: 14px;
    color: $black;
    font-family: $font-secondary;
    font-size: 0.95rem;
    outline: none;
    transition: all 0.3s;
    box-sizing: border-box;

    &::placeholder {
      color: $gray-400;
    }

    &:focus {
      border-color: $black;
      box-shadow: 0 0 0 3px $ring;
    }
  }

  &__textarea {
    resize: vertical;
    min-height: 100px;
  }
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 2000;
  padding: 1rem 1.5rem;
  border-radius: 14px;
  font-family: $font-secondary;
  font-size: 0.9rem;
  font-weight: 500;
  box-shadow: 0 10px 40px rgba($black, 0.1);

  &--success {
    background: $black;
    color: $white;
  }

  &--error {
    background: $white;
    border: 1px solid $border;
    color: $black;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
