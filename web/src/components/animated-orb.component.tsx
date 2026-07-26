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

function createFlareAnim(
  element: HTMLElement | null,
  duration: number
): Animation | undefined {
  if (!element) {
    return undefined;
  }

  return element.animate([{ opacity: 1 }, { opacity: 0 }, { opacity: 1 }], {
    duration,
    easing: "linear",
    iterations: Infinity
  });
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
  const flareRef = useRef<HTMLDivElement>(null);

  useEffect((): (() => void) | undefined => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const dropletsRotation = createClockwiseRotation(
      dropletsRef.current,
      13_000
    );

    const flareAnim = createFlareAnim(flareRef.current, 6_000);
    const reflectionsRotation = createClockwiseRotation(
      reflectionsRef.current,
      20_000
    );

    return () => {
      dropletsRotation?.cancel();
      reflectionsRotation?.cancel();
      flareAnim?.cancel();
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="relative size-full rounded-full overflow-clip"
    >
      <div className="relative  size-full scale-[1.172] translate-y-0.5">
        <OrbLayer
          scale={0.93}
          source="/animations/orb_layers_10/outer-glow.png"
        />
        <OrbLayer
          scale={0.83}
          source="/animations/orb_layers_10/outer-rim.png"
        />
        <OrbLayer source="/animations/orb_layers_10/inner-rim.png" />
        <OrbLayer
          scale={1.03}
          priority
          source="/animations/orb_layers_10/orb-core.png"
        />

        <div
          ref={reflectionsRef}
          className="absolute inset-0 [transform-origin:center] [will-change:transform]"
        >
          <OrbLayer
            scale={0.87}
            source="/animations/orb_layers_10/surface-reflections.png"
          />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10">
          <div className="absolute size-full translate-y-7 blur-sm">
            <OrbLayer source="/animations/orb_layers_10/flare-bloom.png" />
          </div>
          <div className="size-full  absolute blur-[1px]">
            <OrbLayer
              scale={0.7}
              source="/animations/orb_layers_10/vertical-light-trail.png"
            />
          </div>
          <div className="absolute size-full translate-y-0 blur-sm">
            <OrbLayer
              scale={0.77}
              source="/animations/orb_layers_10/flare-rays.png"
            />
          </div>
          <div className="absolute size-full translate-y-0 blur-sm">
            <OrbLayer
              scale={0.77}
              source="/animations/orb_layers_10/flare-rays.png"
            />
          </div>

          <div ref={flareRef} className="absolute size-full translate-y-0 ">
            <OrbLayer
              scale={0.77}
              source="/animations/orb_layers_10/flare-rays.png"
            />
          </div>

          <div className="absolute size-full -top-20">
            <OrbLayer
              scale={0.87}
              source="/animations/orb_layers_10/flare-core.png"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
