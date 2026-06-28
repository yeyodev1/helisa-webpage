<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  rating: number
  tags: string[]
  message: string
  createdAt: string
  status: 'nuevo' | 'contactado' | 'calificado'
}

const STORAGE_KEY = 'helisa_crm_leads'

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
const leads = ref<Lead[]>([])
const showSavedLeads = ref(false)

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

const loadLeads = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      leads.value = JSON.parse(stored)
    }
  } catch {
    leads.value = []
  }
}

const saveLeads = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads.value))
  } catch {
    // ignore
  }
}

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

  const newLead: Lead = {
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

  leads.value.unshift(newLead)
  saveLeads()

  form.value = { name: '', email: '', phone: '', company: '', message: '' }
  rating.value = 0
  hoverRating.value = 0
  selectedTags.value = []
  isSubmitting.value = false

  showNotification('¡Calificación guardada en el CRM mock!')
}

const deleteLead = (id: string) => {
  leads.value = leads.value.filter((lead) => lead.id !== id)
  saveLeads()
  showNotification('Registro eliminado.', 'success')
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

const getStatusClass = (status: Lead['status']) => {
  return `lead-card__status--${status}`
}

onMounted(() => {
  loadLeads()

  const headerTl = gsap.timeline()
  headerTl
    .from('.rating-header__label', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.rating-header__title', { y: 80, opacity: 0, duration: 1, ease: 'power4.out' }, '-=0.5')
    .from('.rating-header__desc', { y: 30, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

  const formTween = gsap.from('.rating-form', {
    y: 60,
    opacity: 0,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.rating-form',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })
  if (formTween.scrollTrigger) triggers.push(formTween.scrollTrigger)

  const infoTween = gsap.from('.rating-info', {
    y: 60,
    opacity: 0,
    duration: 1,
    delay: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.rating-info',
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  })
  if (infoTween.scrollTrigger) triggers.push(infoTween.scrollTrigger)
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
        <h1 class="rating-header__title">Califica y <span class="text-gradient">contacta</span></h1>
        <p class="rating-header__desc">
          Tu opinión nos ayuda a mejorar. Califica tu experiencia y déjanos tus datos para asesorarte.
        </p>
      </div>
    </section>

    <section class="rating-body section-padding">
      <div class="container rating-body__inner">
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
            <textarea v-model="form.message" class="form-field__input form-field__textarea" rows="4" placeholder="Cuéntanos más sobre tu experiencia..."></textarea>
          </div>

          <button type="submit" class="rating-form__submit" :disabled="isSubmitting || !isFormValid">
            <span v-if="isSubmitting" class="rating-form__spinner" />
            <template v-else>
              Guardar y contactar
              <i class="fa-solid fa-arrow-right"></i>
            </template>
          </button>
        </form>

        <aside class="rating-info">
          <div class="rating-info__card">
            <div class="rating-info__header">
              <div class="rating-info__icon">
                <i class="fa-solid fa-database"></i>
              </div>
              <div>
                <h3 class="rating-info__title">CRM Mock</h3>
                <p class="rating-info__desc">
                  Esta vista simula la integración con un CRM. Cada calificación se guarda en el
                  almacenamiento local del navegador como un lead con estado, tags y fecha.
                </p>
              </div>
            </div>
            <div class="rating-info__stats">
              <div class="rating-info__stat">
                <span class="rating-info__stat-value">{{ leads.length }}</span>
                <span class="rating-info__stat-label">Leads guardados</span>
              </div>
              <div class="rating-info__stat">
                <span class="rating-info__stat-value">{{ leads.length > 0 ? (leads.reduce((acc, l) => acc + l.rating, 0) / leads.length).toFixed(1) : '0.0' }}</span>
                <span class="rating-info__stat-label">Calificación promedio</span>
              </div>
            </div>
            <button type="button" class="rating-info__toggle" @click="showSavedLeads = !showSavedLeads">
              {{ showSavedLeads ? 'Ocultar leads' : 'Ver leads guardados' }}
            </button>
          </div>
        </aside>
      </div>

      <Transition name="leads-panel">
        <div v-if="showSavedLeads" class="leads-panel">
          <div class="container">
            <h2 class="leads-panel__title">Leads guardados</h2>
            <div v-if="leads.length === 0" class="leads-panel__empty">
              Aún no hay calificaciones guardadas.
            </div>
            <div v-else class="leads-grid">
              <article v-for="lead in leads" :key="lead.id" class="lead-card">
                <div class="lead-card__header">
                  <div>
                    <h4 class="lead-card__name">{{ lead.name }}</h4>
                    <span class="lead-card__date">{{ lead.createdAt }}</span>
                  </div>
                  <span class="lead-card__status" :class="getStatusClass(lead.status)">{{ lead.status }}</span>
                </div>
                <div class="lead-card__rating">
                  <i v-for="n in 5" :key="n" :class="['lead-card__star', n <= lead.rating ? 'fa-solid fa-star' : 'fa-regular fa-star', { 'lead-card__star--active': n <= lead.rating }]"></i>
                </div>
                <div v-if="lead.tags.length" class="lead-card__tags">
                  <span v-for="tag in lead.tags" :key="tag" class="lead-card__tag">{{ tag }}</span>
                </div>
                <p v-if="lead.message" class="lead-card__message">{{ lead.message }}</p>
                <div class="lead-card__contact">
                  <span v-if="lead.email">{{ lead.email }}</span>
                  <span v-if="lead.phone">{{ lead.phone }}</span>
                  <span v-if="lead.company">{{ lead.company }}</span>
                </div>
                <button type="button" class="lead-card__delete" @click="deleteLead(lead.id)">Eliminar</button>
              </article>
            </div>
          </div>
        </div>
      </Transition>
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
    max-width: 550px;
    margin: 0;
    line-height: 1.7;
  }
}

.rating-body {
  background: $background-soft;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1280px;
  }

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
    flex: 1.2;
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

.rating-info {
  width: 100%;
  max-width: 420px;

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
    gap: 1rem;
    margin-bottom: 1.5rem;

    @media (min-width: 640px) {
      flex-direction: row;
      text-align: left;
      align-items: flex-start;
    }
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
    flex-shrink: 0;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.25rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 0.5rem;
  }

  &__desc {
    font-family: $font-secondary;
    font-size: 0.9rem;
    color: $foreground-muted;
    line-height: 1.6;
    margin: 0;
  }

  &__stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.25rem;
    padding: 1.25rem 1rem;
    background: $background-soft;
    border-radius: 16px;
  }

  &__stat-value {
    display: block;
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $black;
  }

  &__stat-label {
    font-family: $font-secondary;
    font-size: 0.7rem;
    color: $foreground-muted;
  }

  &__toggle {
    width: 100%;
    padding: 0.9rem;
    background: transparent;
    border: 1px solid $border;
    border-radius: 100px;
    color: $black;
    font-family: $font-secondary;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: $black;
      background: rgba($black, 0.03);
    }
  }
}

.leads-panel {
  width: 100%;
  margin-top: 4rem;
  padding-top: 4rem;
  border-top: 1px solid $border;

  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-family: $font-display;
    font-size: 1.5rem;
    font-weight: 500;
    color: $black;
    margin: 0 0 1.5rem;
    text-align: center;
  }

  &__empty {
    font-family: $font-secondary;
    color: $foreground-muted;
    padding: 3rem;
    text-align: center;
    background: $white;
    border: 1px solid $border;
    border-radius: 20px;
    width: 100%;
  }
}

.leads-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  width: 100%;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
}

.lead-card {
  background: $white;
  border: 1px solid $border;
  border-radius: 20px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    border-color: $gray-300;
    transform: translateY(-4px);
    box-shadow: 0 20px 40px rgba($black, 0.06);
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.75rem;
  }

  &__name {
    font-family: $font-display;
    font-size: 1.05rem;
    font-weight: 500;
    color: $black;
    margin: 0;
  }

  &__date {
    display: block;
    font-family: $font-secondary;
    font-size: 0.7rem;
    color: $foreground-muted;
    margin-top: 0.25rem;
  }

  &__status {
    font-family: $font-secondary;
    font-size: 0.65rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 0.25rem 0.6rem;
    border-radius: 100px;
    background: $background-soft;
    color: $foreground-muted;

    &--nuevo {
      background: $black;
      color: $white;
    }

    &--contactado {
      background: $gray-200;
      color: $black;
    }

    &--calificado {
      background: $gray-700;
      color: $white;
    }
  }

  &__rating {
    display: flex;
    gap: 0.25rem;
    margin-bottom: 0.75rem;
  }

  &__star {
    font-size: 0.85rem;
    color: $gray-300;

    &--active {
      color: $black;
    }
  }

  &__tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    margin-bottom: 0.75rem;
  }

  &__tag {
    font-family: $font-secondary;
    font-size: 0.7rem;
    color: $foreground-muted;
    background: $background-soft;
    padding: 0.25rem 0.6rem;
    border-radius: 100px;
  }

  &__message {
    font-family: $font-secondary;
    font-size: 0.85rem;
    color: $foreground-muted;
    line-height: 1.5;
    margin: 0 0 0.75rem;
  }

  &__contact {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-family: $font-secondary;
    font-size: 0.75rem;
    color: $foreground-muted;
    margin-bottom: 1rem;
  }

  &__delete {
    background: none;
    border: 1px solid $border;
    color: $foreground-muted;
    padding: 0.5rem 1rem;
    border-radius: 100px;
    font-family: $font-secondary;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      border-color: $black;
      color: $black;
    }
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

.leads-panel-enter-active,
.leads-panel-leave-active {
  transition: all 0.5s ease;
}

.leads-panel-enter-from,
.leads-panel-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
