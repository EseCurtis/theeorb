"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type OrbLayerProps = {
  priority?: boolean;
  source: string;
  scale?: number;
};

function OrbLayer({
  priority = false,
  source,
  scale = 1
}: OrbLayerProps): React.JSX.Element {
  return (
    <Image
      alt=""
      className="pointer-events-none absolute inset-0 object-contain"
      fill
      priority={priority}
      sizes="(max-width: 1024px) 96vw, 1024px"
      src={source}
      style={{
        scale
      }}
    />
  );
}

function createClockwiseRotation(
  element: HTMLElement | null,
  duration: number
): Animation | undefined {
  if (!element) {
    return undefined;
  }

  return element.animate(
    [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
    {
      duration,
      easing: "linear",
      iterations: Infinity
    }
  );
}

export function AnimatedOrb(): React.JSX.Element {
  const dropletsRef = useRef<HTMLDivElement>(null);
  const reflectionsRef = useRef<HTMLDivElement>(null);

  useEffect((): (() => void) | undefined => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const dropletsRotation = createClockwiseRotation(
      dropletsRef.current,
      13_000
    );
    const reflectionsRotation = createClockwiseRotation(
      reflectionsRef.current,
      18_000
    );

    return () => {
      dropletsRotation?.cancel();
      reflectionsRotation?.cancel();
    };
  }, []);

  return (
    <div aria-hidden="true" className="relative size-full">
      <OrbLayer source="/animations/orb_layers_10/outer-glow.png" />
      {/* <OrbLayer priority source="/animations/orb_layers_10/orb-core.png" /> */}
      <OrbLayer source="/animations/orb_layers_10/outer-rim.png" />
      <OrbLayer source="/animations/orb_layers_10/inner-rim.png" />
      <div
        ref={reflectionsRef}
        className="absolute inset-0 [transform-origin:center] [will-change:transform]"
      >
        <OrbLayer source="/animations/orb_layers_10/surface-reflections.png" />
      </div>
      <div className="absolute hidden inset-0 [transform-origin:center] [will-change:transform]">
        <OrbLayer source="/animations/orb_layers_10/light-droplets.png" />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10">
        <OrbLayer source="/animations/orb_layers_10/flare-bloom.png" />
        <OrbLayer source="/animations/orb_layers_10/vertical-light-trail.png" />
        <OrbLayer source="/animations/orb_layers_10/flare-rays.png" />
        <OrbLayer source="/animations/orb_layers_10/flare-core.png" />
      </div>
    </div>
  );
}
