import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { useEffect, useRef, useState } from "react";
import BottomInfoText from "../BottomInfoText";
import RollingDigit from "../RollingDigit";

type Mode = "focus" | "short" | "long";

const MODES: Record<Mode, number> = {
  focus: 25 * 60,
  short: 5 * 60,
  long: 15 * 60,
};

const MODE_COLORS: Record<Mode, string> = {
  short: "stroke-green-500 drop-shadow-[0_0_12px_rgba(34,197,94,0.8)]",
  long: "stroke-amber-500 drop-shadow-[0_0_12px_rgba(245,158,11,0.8)]",
  focus: "stroke-rose-500 drop-shadow-[0_0_12px_rgba(244,63,94,0.8)]",
};

function generateZigzagCircle(
  cx: number,
  cy: number,
  r: number,
  segments = 60,
  amplitude = 8
): string {
  const points: string[] = [];
  for (let i = 0; i <= segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const noisyR = r + Math.sin(i * 3.5) * amplitude;
    const x = cx + noisyR * Math.cos(angle);
    const y = cy + noisyR * Math.sin(angle);
    points.push(`${x},${y}`);
  }
  return `M${points.join(" L")} Z`;
}

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("focus");
  const [time, setTime] = useState(MODES.focus);
  const [running, setRunning] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const ringRef = useRef<SVGPathElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // TIMER LOOP
  useEffect(() => {
    let interval: any = null;
    let lastUpdate = Date.now();

    if (running) {
      interval = setInterval(() => {
        const now = Date.now();
        const delta = (now - lastUpdate) / 1000;
        lastUpdate = now;

        setTime((prev) => {
          const newTime = Math.max(0, prev - delta);
          if (newTime === 0) {
            setRunning(false);
            if (interval) clearInterval(interval);

            // Show "Time’s Up" dialog
            setShowDialog(true);

            // Start looping sound
            if (audioRef.current) {
              audioRef.current.loop = true;
              audioRef.current.currentTime = 0;
              const playPromise = audioRef.current.play();
              if (playPromise) {
                playPromise.catch(() =>
                  console.warn("Audio blocked until user returns to tab.")
                );
              }
            }
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [running, mode]);

  // DIGITS
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const digitsArray = [
    Math.floor(minutes / 10),
    minutes % 10,
    Math.floor(seconds / 10),
    seconds % 10,
  ];

  // ANIMATE PATH
  useGSAP(
    () => {
      if (!ringRef.current) return;

      const total = MODES[mode];
      const progress = time / total;
      const totalLength = 1800;

      gsap.to(ringRef.current, {
        strokeDashoffset: totalLength * (1 - progress),
        duration: 0.5,
        ease: "power3.out",
      });
    },
    { dependencies: [time, mode] }
  );

  // MODE CHANGE
  const handleModeChange = (newMode: Mode) => {
    setMode(newMode);
    setRunning(false);
    setTime(MODES[newMode]);
    setShowDialog(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // RESET TIMER
  const handleReset = () => {
    setRunning(false);
    setTime(MODES[mode]);
    setShowDialog(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <>
      <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
        {/* Zigzag Ring */}
        <svg
          className={`absolute sm:size-[90vmin] size-[120vmin]`}
          viewBox="0 0 600 600"
          xmlns="http://www.w3.org/2000/svg">
          <path
            ref={ringRef}
            d={generateZigzagCircle(300, 300, 220, 80, 10)}
            fill="none"
            className={MODE_COLORS[mode]}
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1800"
            strokeDashoffset="0"
          />
        </svg>

        {/* Digits */}
        <div className="relative flex items-center justify-center gap-2 mb-8 z-10">
          <RollingDigit value={digitsArray[0]} />
          <RollingDigit value={digitsArray[1]} />
          <span className="text-5xl sm:text-6xl font-bold mt-[-10px] text-stone-400">
            :
          </span>
          <RollingDigit value={digitsArray[2]} />
          <RollingDigit value={digitsArray[3]} />
        </div>

        {/* Mode Buttons */}
        <div className="relative flex gap-3 mb-6 z-10">
          <Button
            className="border"
            size="responsive"
            variant={mode === "short" ? "default" : "outline"}
            onClick={() => handleModeChange("short")}>
            5 min
          </Button>
          <Button
            className="border"
            size="responsive"
            variant={mode === "long" ? "default" : "outline"}
            onClick={() => handleModeChange("long")}>
            15 min
          </Button>
          <Button
            className="border"
            size="responsive"
            variant={mode === "focus" ? "default" : "outline"}
            onClick={() => handleModeChange("focus")}>
            25 min
          </Button>
        </div>

        {/* Controls */}
        <div className="relative flex gap-4 justify-center z-10">
          <Button
            size="lg"
            onClick={() => setRunning((r) => !r)}
            className="sm:px-12 sm:py-6 relative inline-flex items-center justify-center active:scale-95 transition-transform">
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
            onClick={handleReset}
            className="sm:px-12 sm:py-6 active:scale-95 transition-transform">
            Reset
          </Button>
        </div>

        <audio ref={audioRef} src="/time_up.mp3" preload="auto" />
      </div>

      {/* Time's Up Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="text-center sm:p-12" showCloseButton={false}>
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-red-500 text-center">
              ⏰ Time’s Up!
            </DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground mt-2">
            Take a short break or reset the timer to start again.
          </p>
          <div className="flex justify-center gap-4 mt-6">
            <Button size={"responsive"} onClick={handleReset} variant="default">
              Reset Timer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <BottomInfoText text="Pomodoro Timer with looping alarm and 'Time’s Up' dialog." />
    </>
  );
}
