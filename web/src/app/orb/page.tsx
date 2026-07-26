import { AnimatedOrb } from "@/components/animated-orb.component";

export default function Orb() {
  return (
    <div className="absolute  top-0 left-1/2 z-10 size-[30vw] -translate-x-1/2 sm:bottom-[-34%]">
      <AnimatedOrb />
    </div>
  );
}
