<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isLoaded = ref(false)

onMounted(() => {
  // Simulate asset loading or wait for window load
  const hidePreloader = () => {
    setTimeout(() => {
      isLoaded.value = true
    }, 800) // Minimum display time for smooth effect
  }

  if (document.readyState === 'complete') {
    hidePreloader()
  } else {
    window.addEventListener('load', hidePreloader)
  }
})
</script>

<template>
  <Transition name="preloader">
    <div v-if="!isLoaded" class="preloader">
      <div class="preloader__content">
        <div class="preloader__logo">HELISA</div>
        <div class="preloader__bar">
          <div class="preloader__progress"></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.preloader {
  position: fixed;
  inset: 0;
  z-index: 99999;
  background-color: $white;
  display: flex;
  align-items: center;
  justify-content: center;

  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__logo {
    font-family: $font-display;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.05em;
    color: $primary;
    animation: pulse 1.5s ease-in-out infinite alternate;
  }

  &__bar {
    width: 200px;
    height: 4px;
    background: $background-muted;
    border-radius: 4px;
    overflow: hidden;
  }

  &__progress {
    width: 0%;
    height: 100%;
    background: $primary;
    border-radius: 4px;
    animation: loading 1.5s cubic-bezier(0.65, 0, 0.35, 1) infinite;
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
    transform: scale(0.98);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes loading {
  0% {
    width: 0%;
    transform: translateX(-100%);
  }
  50% {
    width: 100%;
    transform: translateX(0);
  }
  100% {
    width: 100%;
    transform: translateX(100%);
  }
}

.preloader-enter-active,
.preloader-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}

.preloader-leave-to {
  opacity: 0;
  transform: translateY(-20px);
  pointer-events: none;
}
</style>
