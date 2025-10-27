import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useRef } from "react";

const digits = Array.from({ length: 10 }, (_, i) => i);

export interface RollingDigitProps {
  /** The digit (0–9) to display */
  value: number;
  /** Animation speed in seconds (default: 0.3) */
  speed?: number;
  /** Optional className for styling overrides */
  className?: string;
}

export default function RollingDigit({
  value,
  speed = 0.3,
  className = "",
}: RollingDigitProps) {
  const numRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!numRef.current) return;
      gsap.to(numRef.current, {
        y: -value * 100,
        duration: speed,
        ease: "power3.out",
      });
    },
    { dependencies: [value, speed] }
  );

  return (
    <div
      className={`relative h-[100px] w-[55px] sm:w-[65px] overflow-hidden rounded-2xl text-center font-mono font-medium text-[4rem] sm:text-[6.5rem] ${className}`}>
      <div ref={numRef}>
        {digits.map((d) => (
          <div
            key={d}
            className="flex items-center justify-center h-[100px] select-none text-stone-300 px-2"
            style={{
              textShadow:
                "0 0 4px var(--color-sidebar-accent), 0 0 10px var(--color-sidebar-accent), 0 0 14px var(--color-sidebar-accent)",
            }}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
}
