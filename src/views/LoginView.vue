<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/authService'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

// Default credentials pre-filled for convenience as requested
const email = ref('dreyes@bakano.ec')
const password = ref('123456789')
const loading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) {
    errorMessage.value = 'Por favor ingresa tu correo y contraseña.'
    return
  }

  loading.value = true
  errorMessage.value = ''

  try {
    const data = await authService.login({ email: email.value, password: password.value })
    localStorage.setItem('access_token', data.token)
    userStore.setUser({
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
    })
    await router.push('/admin')
  } catch (err: any) {
    errorMessage.value = err.message || 'Error al iniciar sesión. Revisa que el backend esté corriendo en localhost:8100.'
  } finally {
    loading.value = false
  }
}

const fillDefaultCredentials = () => {
  email.value = 'dreyes@bakano.ec'
  password.value = '123456789'
}
</script>

<template>
  <main class="login-wrapper">
    <div class="login-container">
      <div class="login-card">
        <div class="login-card__badge">
          <i class="fa-solid fa-lock" />
          <span>Acceso Restringido</span>
        </div>

        <h1 class="login-card__title">Panel de Administración</h1>
        <p class="login-card__subtitle">
          Ingresa tus credenciales para gestionar productos, categorías y usuarios de HELISA.
        </p>

        <!-- Default Credentials Quick Action -->
        <div class="demo-box" @click="fillDefaultCredentials">
          <div class="demo-box__info">
            <span class="demo-box__label">Usuario por defecto:</span>
            <span class="demo-box__val">dreyes@bakano.ec</span>
          </div>
          <button type="button" class="demo-box__btn">
            <i class="fa-solid fa-wand-magic-sparkles" /> Usar
          </button>
        </div>

        <form class="login-form" @submit.prevent="handleLogin">
          <div v-if="errorMessage" class="alert-box">
            <i class="fa-solid fa-circle-exclamation" />
            <span>{{ errorMessage }}</span>
          </div>

          <div class="form-field">
            <label for="login-email">Correo Electrónico</label>
            <div class="input-container">
              <i class="fa-solid fa-envelope input-container__icon" />
              <input
                id="login-email"
                v-model="email"
                type="email"
                placeholder="dreyes@bakano.ec"
                required
              />
            </div>
          </div>

          <div class="form-field">
            <label for="login-password">Contraseña</label>
            <div class="input-container">
              <i class="fa-solid fa-key input-container__icon" />
              <input
                id="login-password"
                v-model="password"
                type="password"
                placeholder="123456789"
                required
              />
            </div>
          </div>

          <button type="submit" class="submit-btn" :disabled="loading">
            <i v-if="loading" class="fa-solid fa-circle-notch fa-spin" />
            <span v-else>Iniciar Sesión</span>
            <i v-if="!loading" class="fa-solid fa-arrow-right" />
          </button>
        </form>
      </div>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.login-wrapper {
  min-height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 130px;
  padding-bottom: 60px;
  padding-left: 20px;
  padding-right: 20px;
  box-sizing: border-box;
  background: linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%);
}

.login-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: 100%;
  max-width: 460px;
  background: #ffffff;
  border-radius: 20px;
  padding: 40px 32px;
  box-shadow: 0 20px 40px -15px rgba(0, 82, 204, 0.08), 0 0 1px 1px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 14px;
    background: #ebf5ff;
    color: #0052cc;
    border-radius: 100px;
    font-size: 0.8rem;
    font-weight: 600;
    margin-bottom: 20px;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 700;
    color: #0f172a;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }

  &__subtitle {
    font-size: 0.92rem;
    color: #64748b;
    margin: 0 0 24px 0;
    line-height: 1.5;
  }
}

.demo-box {
  width: 100%;
  background: #f1f5f9;
  border: 1px dashed #cbd5e1;
  border-radius: 12px;
  padding: 12px 16px;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s ease;
  box-sizing: border-box;

  &:hover {
    background: #e2e8f0;
    border-color: #0052cc;
  }

  &__info {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size: 0.82rem;
  }

  &__label {
    color: #64748b;
    font-size: 0.75rem;
  }

  &__val {
    color: #0f172a;
    font-weight: 600;
  }

  &__btn {
    background: #0052cc;
    color: #ffffff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 0.78rem;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &:hover {
      background: #003e99;
    }
  }
}

.login-form {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alert-box {
  width: 100%;
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  box-sizing: border-box;
}

.form-field {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 6px;

  label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #334155;
  }
}

.input-container {
  width: 100%;
  display: flex;
  align-items: center;
  position: relative;
  box-sizing: border-box;

  &__icon {
    position: absolute;
    left: 14px;
    color: #94a3b8;
    font-size: 0.9rem;
    pointer-events: none;
  }

  input {
    width: 100%;
    padding: 12px 16px 12px 42px;
    border: 1px solid #cbd5e1;
    border-radius: 10px;
    font-size: 0.95rem;
    color: #0f172a;
    background: #ffffff;
    box-sizing: border-box;
    transition: all 0.2s ease;

    &:focus {
      outline: none;
      border-color: #0052cc;
      box-shadow: 0 0 0 3px rgba(0, 82, 204, 0.12);
    }
  }
}

.submit-btn {
  width: 100%;
  padding: 14px 20px;
  background: #0052cc;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: all 0.2s ease;

  &:hover:not(:disabled) {
    background: #003e99;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}
</style>
