import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import BottomInfoText from "../BottomInfoText";
import RollingDigit from "../RollingDigit";

export default function Stopwatch() {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const effectsRef = useRef<HTMLDivElement>(null);

  // Function to spawn colorful ripple/confetti
  const spawnEffect = () => {
    if (!effectsRef.current) return;

    const size = 50 + Math.random() * 100; // 50–150px
    const x = Math.random() * (window.innerWidth - size);
    const y = Math.random() * (window.innerHeight - size);
    const color = `hsl(${Math.random() * 360}, 80%, 60%)`;

    const el = document.createElement("div");
    el.style.position = "absolute";
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    el.style.width = `${size}px`;
    el.style.height = `${size}px`;
    el.style.borderRadius = "50%";
    el.style.background = color;
    el.style.opacity = "0.7";
    el.style.pointerEvents = "none";

    effectsRef.current.appendChild(el);

    gsap.to(el, {
      scale: 3 + Math.random() * 2,
      opacity: 0,
      duration: 1.2 + Math.random() * 0.5,
      ease: "power2.out",
      onComplete: () => el.remove(),
    });
  };

  // Stopwatch logic with 10s effect trigger
  useEffect(() => {
    let lastTrigger = 0;
    let start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      if (running) {
        const delta = (now - start) / 1000;
        setTime((t) => {
          const newTime = t + delta;

          // Trigger effect every second
          if (Math.floor(newTime) > lastTrigger) {
            lastTrigger = Math.floor(newTime);
            spawnEffect();
          }

          return newTime;
        });
      }
      start = now;
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running]);

  const minutes = Math.floor(time / 60) % 60;
  const seconds = Math.floor(time) % 60;
  const millis = Math.floor((time * 100) % 100);

  const digitsArray = [
    Math.floor(minutes / 10),
    minutes % 10,
    Math.floor(seconds / 10),
    seconds % 10,
    Math.floor(millis / 10),
    millis % 10,
  ];

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen">
        {/* Effects container */}
        <div
          ref={effectsRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
        />

        {/* Stopwatch digits */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <RollingDigit value={digitsArray[0]} />
          <RollingDigit value={digitsArray[1]} />
          <span className="text-5xl sm:text-6xl font-bold mt-[-10px] text-stone-400">
            :
          </span>
          <RollingDigit value={digitsArray[2]} />
          <RollingDigit value={digitsArray[3]} />
          <span
            className={
              "hidden sm:inline text-5xl sm:text-6xl font-bold text-stone-400 mt-[-10px]"
            }>
            .
          </span>
          <div className="hidden sm:flex gap-2">
            <RollingDigit value={digitsArray[4]} speed={0.2} />
            <RollingDigit value={digitsArray[5]} speed={0.1} />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 justify-center">
          <Button
            size="lg"
            onClick={() => setRunning((r) => !r)}
            className="px-12 py-6 relative inline-flex items-center justify-center active:scale-95 transition-transform">
            <span className="opacity-0 pointer-events-none select-none">
              Pause
            </span>
            <span className="absolute inset-0 flex items-center justify-center">
              {running ? "Pause" : "Start"}
            </span>
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => {
              setRunning(false);
              setTime(0);
            }}
            className="px-12 py-6 active:scale-95 transition-transform">
            Reset
          </Button>
        </div>
      </div>
      <BottomInfoText text="Stopwatch with animated scrolling digits and colorful interactive effects." />
    </>
  );
}
