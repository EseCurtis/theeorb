'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

type OrbLayerProps = {
  priority?: boolean
  source: string
}

const ORB_SPHERE_LAYERS = [
  '/animations/orb_layers_10/orb-core.png',
  '/animations/orb_layers_10/outer-rim.png',
  '/animations/orb_layers_10/inner-rim.png',
  '/animations/orb_layers_10/surface-reflections.png',
  '/animations/orb_layers_10/light-droplets.png',
]

function OrbLayer({ priority = false, source }: OrbLayerProps): React.JSX.Element {
  return (
    <Image
      alt=""
      className="pointer-events-none absolute inset-0 object-contain"
      fill
      priority={priority}
      sizes="(max-width: 1024px) 96vw, 1024px"
      src={source}
    />
  )
}

export function AnimatedOrb(): React.JSX.Element {
  const sphereRef = useRef<HTMLDivElement>(null)

  useEffect((): (() => void) | undefined => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return undefined
    }

    const sphereElement = sphereRef.current
    if (!sphereElement) {
      return undefined
    }

    const rotation = sphereElement.animate(
      [
        { transform: 'rotateX(1deg) rotateY(-14deg) scale(0.995)' },
        { transform: 'rotateX(-1deg) rotateY(14deg) scale(1.005)' },
      ],
      {
        direction: 'alternate',
        duration: 9_600,
        easing: 'cubic-bezier(0.45, 0, 0.55, 1)',
        iterations: Infinity,
      },
    )

    return () => rotation.cancel()
  }, [])

  return (
    <div aria-hidden="true" className="relative size-full [perspective:1400px]">
      <OrbLayer priority source="/animations/orb_layers_10/outer-glow.png" />
      <div ref={sphereRef} className="absolute inset-0 [transform-origin:center] [transform-style:preserve-3d] [will-change:transform]">
        {ORB_SPHERE_LAYERS.map((source, index) => <OrbLayer key={source} priority={index === 0} source={source} />)}
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <OrbLayer source="/animations/orb_layers_10/flare-bloom.png" />
        <OrbLayer source="/animations/orb_layers_10/vertical-light-trail.png" />
        <OrbLayer source="/animations/orb_layers_10/flare-rays.png" />
        <OrbLayer source="/animations/orb_layers_10/flare-core.png" />
      </div>
    </div>
  )
}
