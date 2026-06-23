import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onUnmounted, ref, type Ref } from 'vue'

gsap.registerPlugin(ScrollTrigger)

interface RevealOptions {
  y?: number
  duration?: number
  stagger?: number
  delay?: number
  start?: string
}

export function useGsap() {
  const sectionRef = ref<HTMLElement | null>(null)
  const triggers: ScrollTrigger[] = []

  const reveal = (
    selector: string,
    options: RevealOptions = {},
    container?: Ref<HTMLElement | null>,
  ) => {
    const {
      y = 60,
      duration = 1,
      stagger = 0.1,
      delay = 0,
      start = 'top 80%',
    } = options

    const target = container?.value
      ? container.value.querySelectorAll(selector)
      : sectionRef.value?.querySelectorAll(selector)

    if (!target || target.length === 0) return

    gsap.set(target, { y, opacity: 0 })

    const tween = gsap.to(target, {
      y: 0,
      opacity: 1,
      duration,
      stagger,
      delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: container?.value || sectionRef.value,
        start,
        toggleActions: 'play none none none',
      },
    })

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger)
    }
  }

  const parallax = (
    selector: string,
    yPercent: number = -20,
    container?: Ref<HTMLElement | null>,
  ) => {
    const target = container?.value
      ? container.value.querySelector(selector)
      : sectionRef.value?.querySelector(selector)

    if (!target) return

    const tween = gsap.to(target, {
      yPercent,
      ease: 'none',
      scrollTrigger: {
        trigger: container?.value || sectionRef.value,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger)
    }
  }

  const fadeIn = (
    selector: string,
    duration: number = 1,
    container?: Ref<HTMLElement | null>,
  ) => {
    const target = container?.value
      ? container.value.querySelectorAll(selector)
      : sectionRef.value?.querySelectorAll(selector)

    if (!target || target.length === 0) return

    gsap.set(target, { opacity: 0 })

    const tween = gsap.to(target, {
      opacity: 1,
      duration,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: container?.value || sectionRef.value,
        start: 'top 75%',
        toggleActions: 'play none none none',
      },
    })

    if (tween.scrollTrigger) {
      triggers.push(tween.scrollTrigger)
    }
  }

  onUnmounted(() => {
    triggers.forEach((trigger) => trigger.kill())
    triggers.length = 0
  })

  return {
    sectionRef,
    reveal,
    parallax,
    fadeIn,
    gsap,
    ScrollTrigger,
  }
}

export { gsap, ScrollTrigger }
