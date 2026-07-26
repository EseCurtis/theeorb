'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useLayoutEffect } from 'react'

type SectionKind = 'activity' | 'autonomy' | 'release' | 'story' | 'world'

type MotionOffset = {
  x: number
  y: number
}

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

function createSectionTimeline(section: HTMLElement): gsap.core.Timeline {
  const sectionKind = getSectionKind(section)
  const eyebrow = section.querySelector<HTMLElement>('[data-scroll-eyebrow]')
  const heading = section.querySelector<HTMLElement>('[data-scroll-heading]')
  const description = section.querySelector<HTMLElement>('[data-scroll-description]')
  const action = section.querySelector<HTMLElement>('[data-scroll-action]')
  const cards = gsap.utils.toArray<HTMLElement>('[data-scroll-card]', section)
  const timeline = gsap.timeline({
    defaults: { ease: 'power3.out' },
    scrollTrigger: {
      end: 'bottom 34%',
      invalidateOnRefresh: true,
      scrub: 0.72,
      start: 'top 78%',
      trigger: section,
    },
  })

  if (eyebrow) {
    timeline.from(eyebrow, { autoAlpha: 0, y: 18 }, 0)
  }

  if (heading) {
    timeline.from(heading, { autoAlpha: 0, y: 46 }, 0.08)
  }

  if (description) {
    timeline.from(description, { autoAlpha: 0, y: 28 }, 0.18)
  }

  for (const [cardIndex, card] of cards.entries()) {
    const offset = getCardOffset(sectionKind, cardIndex)

    timeline.from(card, {
      autoAlpha: 0,
      scale: 0.94,
      x: offset.x,
      y: offset.y,
    }, 0.28 + cardIndex * 0.09)
  }

  if (action) {
    timeline.from(action, { autoAlpha: 0, scale: 0.92, y: 24 }, 0.44)
  }

  return timeline
}

export function LandingScrollMotion(): React.JSX.Element | null {
  useLayoutEffect((): (() => void) => {
    gsap.registerPlugin(ScrollTrigger)

    const motion = gsap.matchMedia()

    motion.add('(prefers-reduced-motion: no-preference)', () => {
      const sections = gsap.utils.toArray<HTMLElement>('[data-scroll-section]')

      for (const section of sections) {
        createSectionTimeline(section)
      }
    })

    return () => motion.revert()
  }, [])

  return null
}
