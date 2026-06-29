<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { gsap } from 'gsap'

const form = ref({
  name: '',
  email: '',
  phone: '',
  company: '',
  message: '',
})

const isSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref<'success' | 'error'>('success')

const isFormValid = computed(() => {
  return form.value.name.trim() !== '' && form.value.email.trim() !== ''
})

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
    showNotification('Por favor, completa tu nombre y correo electrónico.', 'error')
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
    message: form.value.message,
    createdAt: new Date().toLocaleString('es-EC'),
    status: 'nuevo',
  }

  const stored = JSON.parse(localStorage.getItem('helisa_crm_leads') || '[]')
  stored.unshift(newLead)
  localStorage.setItem('helisa_crm_leads', JSON.stringify(stored))

  form.value = { name: '', email: '', phone: '', company: '', message: '' }
  isSubmitting.value = false

  showNotification('¡Gracias! Hemos recibido tu solicitud. Te contactaremos pronto.')
}

const autoResize = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = target.scrollHeight + 'px'
}

onMounted(() => {
  const tl = gsap.timeline()

  tl.from('.hero-badge', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' })
    .from('.hero-title span > span', { y: 100, opacity: 0, duration: 1, stagger: 0.1, ease: 'power4.out', clipPath: 'inset(0% 0% 100% 0%)' }, '-=0.5')
    .from('.hero-desc', { y: 20, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
    .from('.lead-form-wrapper', { y: 40, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.4')
})
</script>

<template>
  <main class="lead-page">
    <section class="lead-hero">
      <div class="lead-hero__bg">
        <div class="lead-hero__grid"></div>
        <div class="lead-hero__glow"></div>
      </div>
      
      <div class="container lead-hero__content">
        <div class="hero-badge">Inicia tu proyecto</div>
        <h1 class="hero-title">
          <span class="line-wrap"><span>Transforma tu</span></span>
          <span class="line-wrap"><span class="text-gradient">visión en realidad</span></span>
        </h1>
        <p class="hero-desc">
          Déjanos tus datos y un especialista de HELISA se comunicará contigo en menos de 24 horas para brindarte la mejor solución.
        </p>
      </div>
    </section>

    <section class="lead-form-section">
      <div class="container lead-form-container">
        <div class="lead-form-wrapper">
          <form class="lead-form" @submit.prevent="submitForm">
            <div class="form-grid">
              <div class="input-group">
                <input v-model="form.name" type="text" id="name" required placeholder=" " />
                <label for="name">Nombre completo *</label>
                <div class="input-line"></div>
              </div>
              
              <div class="input-group">
                <input v-model="form.email" type="email" id="email" required placeholder=" " />
                <label for="email">Correo electrónico *</label>
                <div class="input-line"></div>
              </div>

              <div class="input-group">
                <input v-model="form.phone" type="tel" id="phone" placeholder=" " />
                <label for="phone">Teléfono (opcional)</label>
                <div class="input-line"></div>
              </div>

              <div class="input-group">
                <input v-model="form.company" type="text" id="company" placeholder=" " />
                <label for="company">Empresa / Sector (opcional)</label>
                <div class="input-line"></div>
              </div>
            </div>

            <div class="input-group input-group--full">
              <textarea v-model="form.message" id="message" rows="1" placeholder=" " @input="autoResize"></textarea>
              <label for="message">¿En qué podemos ayudarte?</label>
              <div class="input-line"></div>
            </div>

            <div class="form-footer">
              <p class="privacy-text">Tus datos están seguros con nosotros. No enviamos spam.</p>
              <button type="submit" class="submit-btn" :class="{ 'submit-btn--loading': isSubmitting }" :disabled="isSubmitting || !isFormValid">
                <span class="submit-btn__text">Enviar Solicitud</span>
                <span class="submit-btn__icon"><i class="fa-solid fa-arrow-right"></i></span>
                <span class="submit-btn__spinner"></span>
              </button>
            </div>
          </form>
        </div>
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
.lead-page {
  padding-top: 80px;
  min-height: 100vh;
  background-color: $background;
  overflow: hidden;
}

.lead-hero {
  position: relative;
  padding: 8rem 0 4rem;
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
    margin: 0 auto;
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
  font-size: clamp(3rem, 8vw, 6.5rem);
  font-weight: 500;
  line-height: 1;
  letter-spacing: -0.04em;
  color: $black;
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

.lead-form-section {
  position: relative;
  z-index: 2;
  padding-bottom: 6rem;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lead-form-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.lead-form-wrapper {
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  box-sizing: border-box;
  background: rgba($white, 0.7);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba($white, 0.5);
  box-shadow:
    0 20px 40px rgba($black, 0.04),
    inset 0 0 0 1px rgba($white, 0.8);
  border-radius: 2rem;
  padding: 3rem;

  @media (min-width: 768px) {
    padding: 4rem;
    border-radius: 3rem;
  }
}

.form-grid {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2.5rem;
  margin-bottom: 2.5rem;

  @media (min-width: 640px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 3rem;
    row-gap: 3.5rem;
  }
}

.input-group {
  position: relative;
  width: 100%;
  flex: 1 1 250px;

  &--full {
    margin-bottom: 3rem;
  }

  input,
  textarea {
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: none;
    padding: 0.5rem 0;
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: $black;
    outline: none;

    &:focus,
    &:not(:placeholder-shown) {
      ~label {
        transform: translateY(-1.8rem) scale(0.85);
        color: $foreground-muted;
      }

      ~.input-line {
        transform: scaleX(1);
        opacity: 1;
      }
    }
  }

  textarea {
    resize: none;
    min-height: 40px;
    overflow: hidden;
  }

  label {
    position: absolute;
    left: 0;
    top: 0.5rem;
    font-family: $font-secondary;
    font-size: 1.1rem;
    color: $gray-400;
    pointer-events: none;
    transform-origin: left top;
    transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
  }

  .input-line {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: $border;

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: $black;
      transform: scaleX(0);
      transform-origin: center;
      transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
    }
  }

  input:focus~.input-line::after,
  textarea:focus~.input-line::after {
    transform: scaleX(1);
  }
}

.form-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
  }
}

.privacy-text {
  font-family: $font-secondary;
  font-size: 0.85rem;
  color: $gray-400;
  margin: 0;
}

.submit-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.25rem 2.5rem;
  background: $black;
  color: $white;
  border: none;
  border-radius: 100px;
  font-family: $font-secondary;
  font-size: 1.05rem;
  font-weight: 500;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);

  &__text {
    position: relative;
    z-index: 1;
    transition: transform 0.4s;
  }

  &__icon {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba($white, 0.1);
    border-radius: 50%;
    transition: transform 0.4s;
    font-size: 0.9rem;
  }

  &__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 24px;
    height: 24px;
    border: 2px solid rgba($white, 0.3);
    border-top-color: $white;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s;
  }

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: $gray-800;
    transform: scaleX(0);
    transform-origin: right;
    transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 0;
  }

  &:hover:not(:disabled) {
    box-shadow: 0 15px 35px rgba($black, 0.2);
    transform: translateY(-2px);

    &::before {
      transform: scaleX(1);
      transform-origin: left;
    }

    .submit-btn__icon {
      transform: translateX(5px);
      background: $white;
      color: $black;
    }
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  &--loading {

    .submit-btn__text,
    .submit-btn__icon {
      opacity: 0;
      transform: translateY(10px);
    }

    .submit-btn__spinner {
      opacity: 1;
      animation: spin 0.8s linear infinite;
    }
  }
}

@keyframes spin {
  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 2000;
  padding: 1.25rem 2rem;
  border-radius: 16px;
  font-family: $font-secondary;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 20px 40px rgba($black, 0.15);
  backdrop-filter: blur(10px);

  &--success {
    background: rgba($black, 0.9);
    color: $white;
    border: 1px solid rgba($white, 0.1);
  }

  &--error {
    background: rgba($white, 0.9);
    color: $black;
    border: 1px solid rgba($black, 0.1);
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.5s cubic-bezier(0.25, 1, 0.5, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}
</style>