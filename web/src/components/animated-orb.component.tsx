'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export function AnimatedOrb(): React.JSX.Element {
  const sphereRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const sphereElement = sphereRef.current
    if (!sphereElement) {
      return
    }

    const rotation = sphereElement.animate(
      [
        { transform: 'rotate(-18deg)' },
        { transform: 'rotate(18deg)' },
        { transform: 'rotate(8deg)' },
      ],
      {
        duration: 11_000,
        easing: 'ease-in-out',
        iterations: Infinity,
      },
    )

    return () => {
      rotation.cancel()
    }
  }, [])

  return (
    <div aria-hidden="true" className="relative size-full [perspective:1400px]">
      <div ref={sphereRef} className="absolute inset-0 [transform-style:preserve-3d] [will-change:transform]">
        <Image alt="" className="object-contain" fill priority sizes="(max-width: 1024px) 96vw, 1024px" src="/animations/orb-layered/orb-sphere.png" />
      </div>
      <Image alt="" className="pointer-events-none absolute inset-0 z-10 object-contain" fill priority sizes="(max-width: 1024px) 96vw, 1024px" src="/animations/orb-layered/orb-vertical-flare.png" />
    </div>
  )
}
