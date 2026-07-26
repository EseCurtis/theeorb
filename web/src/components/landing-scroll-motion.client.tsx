'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'

type SectionKind = 'activity' | 'autonomy' | 'release' | 'story' | 'world'

type MotionOffset = {
  x: number
  y: number
}

type FloatingCardMotion = {
  delay: number
  duration: number
  x: number
  y: number
}

const HERO_FLOAT_MOTIONS: FloatingCardMotion[] = [
  { delay: -1.2, duration: 4.8, x: 9, y: -14 },
  { delay: -2.6, duration: 5.4, x: -11, y: -17 },
  { delay: -3.8, duration: 6.1, x: 7, y: 13 },
]

function isSectionKind(value: string | undefined): value is SectionKind {
  return value === 'activity' || value === 'autonomy' || value === 'release' || value === 'story' || value === 'world'
}

function getSectionKind(section: HTMLElement): SectionKind {
  const sectionKind = section.dataset.scrollSection

  return isSectionKind(sectionKind) ? sectionKind : 'story'
}

function getCardOffset(sectionKind: SectionKind, index: number): MotionOffset {
  if (sectionKind === 'activity') {
    return { x: index % 2 ? 52 : -52, y: 42 }
  }

  if (sectionKind === 'world') {
    return { x: index % 2 ? 40 : -40, y: 34 }
  }

  return { x: 0, y: 48 }
}

function getInteractiveTarget(event: PointerEvent): HTMLElement | null {
  return event.currentTarget instanceof HTMLElement ? event.currentTarget : null
}

function handlePanelPointerMove(event: PointerEvent): void {
  const panel = getInteractiveTarget(event)

  if (!panel) {
    return
  }

  const bounds = panel.getBoundingClientRect()
  const pointerX = (event.clientX - bounds.left) / bounds.width - 0.5
  const pointerY = (event.clientY - bounds.top) / bounds.height - 0.5

  gsap.to(panel, {
    duration: 0.2,
    ease: 'power2.out',
    overwrite: 'auto',
    rotationX: pointerY * -4,
    rotationY: pointerX * 5,
    transformPerspective: 900,
  })
}

function handlePanelPointerLeave(event: PointerEvent): void {
  const panel = getInteractiveTarget(event)

  if (!panel) {
    return
  }

  gsap.to(panel, {
    duration: 0.32,
    ease: 'power3.out',
    overwrite: 'auto',
    rotationX: 0,
    rotationY: 0,
  })
}

function createHeroCardFloat(): void {
  const heroCards = gsap.utils.toArray<HTMLElement>('[data-hero-float]')

  for (const [index, heroCard] of heroCards.entries()) {
    const motion = HERO_FLOAT_MOTIONS[index]

    if (!motion) {
      continue
    }

    gsap.to(heroCard, {
      delay: motion.delay,
      duration: motion.duration,
      ease: 'sine.inOut',
      repeat: -1,
      x: motion.x,
      y: motion.y,
      yoyo: true,
    })
  }
}

function createPanelPointerInteractions(): () => void {
  const abortController = new AbortController()
  const panels = gsap.utils.toArray<HTMLElement>('[data-hero-float], [data-scroll-card]')

  for (const panel of panels) {
    panel.addEventListener('pointermove', handlePanelPointerMove, { signal: abortController.signal })
    panel.addEventListener('pointerleave', handlePanelPointerLeave, { signal: abortController.signal })
  }

  return () => abortController.abort()
}

function createSectionTimeline(section: HTMLElement): gsap.core.Timeline {
  const sectionKind = getSectionKind(section)
  const eyebrow = section.querySelector<HTMLElement>('[data-scroll-eyebrow]')
  const heading = section.querySelector<HTMLElement>('[data-scroll-heading]')
  const description = section.querySelector<HTMLElement>('[data-scroll-description]')
  const action = section.querySelector<HTMLElement>('[data-scroll-action]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-scroll-card]', section)
  const timeline = gsap.timeline({
    defaults: { duration: 0.44, ease: 'power3.out' },
  })

  if (eyebrow) {
    timeline.from(eyebrow, { autoAlpha: 0, y: 18 }, 0)
  }

  if (heading) {
    timeline.from(heading, { autoAlpha: 0, y: 46 }, 0.05)
  }

  if (description) {
    timeline.from(description, { autoAlpha: 0, y: 28 }, 0.12)
  }

  for (const [cardIndex, card] of cards.entries()) {
    const offset = getCardOffset(sectionKind, cardIndex)

    timeline.from(card, {
      autoAlpha: 0,
      scale: 0.94,
      x: offset.x,
      y: offset.y,
    }, 0.18 + cardIndex * 0.065)
  }

  if (action) {
    timeline.from(action, { autoAlpha: 0, scale: 0.92, y: 24 }, 0.31)
  }

  return timeline
}

function createSectionTrigger(section: HTMLElement): void {
  ScrollTrigger.create({
    onEnter: () => {
      createSectionTimeline(section)
    },
    once: true,
    start: 'top 88%',
    trigger: section,
  })
}

export function LandingScrollMotion(): React.JSX.Element | null {
  useLayoutEffect((): (() => void) => {
    gsap.registerPlugin(ScrollTrigger)

    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-scroll-section]')

      for (const section of sections) {
        createSectionTrigger(section)
      }

      createHeroCardFloat()

      const removePanelPointerInteractions = window.matchMedia('(hover: hover) and (pointer: fine)').matches
        ? createPanelPointerInteractions()
        : undefined

      return () => removePanelPointerInteractions?.()
    })

    return () => motion.revert()
  }, [])

  return null
}
