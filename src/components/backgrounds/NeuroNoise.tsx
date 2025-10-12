import { NeuroNoise } from "@paper-design/shaders-react";
import { useEffect, useRef, useState } from "react";

const colors = [
  "#47a6ff",
  "#5c4dff",
  "#00c853",
  "#ff6d00",
  "#ff1744",
  "#ff80ab",
  "#651fff",
];

const hexToRgb = (hex: string) => {
  const bigint = parseInt(hex.replace("#", ""), 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
};

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b))
    .toString(16)
    .slice(1)}`;

const interpolateColor = (c1: any, c2: any, t: number) => ({
  r: c1.r + (c2.r - c1.r) * t,
  g: c1.g + (c2.g - c1.g) * t,
  b: c1.b + (c2.b - c1.b) * t,
});

const NeuroNoiseBG = () => {
  const [rotation, setRotation] = useState(0);
  const [colorFront, setColorFront] = useState(colors[0]);
  const [colorMid, setColorMid] = useState(colors[1]);

  const targetRotationRef = useRef(0);
  const targetSpeedRef = useRef(1);
  const rotationRef = useRef(rotation);
  const speedRef = useRef(1); // track speed for smooth interpolation

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const { clientX, clientY } = e;

      // vertical position maps to speed (1-5)
      targetSpeedRef.current = 1 + (clientY / innerHeight) * 4;

      // horizontal position maps to rotation (0-180)
      targetRotationRef.current = (clientX / innerWidth) * 180;
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrame: number;

    const animate = () => {
      // Smooth rotation
      const newRotation =
        rotationRef.current +
        (targetRotationRef.current - rotationRef.current) * 0.05;
      rotationRef.current = newRotation;
      setRotation(newRotation);

      // Smooth speed
      const newSpeed =
        speedRef.current + (targetSpeedRef.current - speedRef.current) * 0.1;
      speedRef.current = newSpeed;

      // Map rotation to colors
      const t = newRotation / 180;
      const colorIndex = Math.floor(t * (colors.length - 1));
      const nextIndex = (colorIndex + 1) % colors.length;
      const localT = (t * (colors.length - 1)) % 1;

      const front = interpolateColor(
        hexToRgb(colors[colorIndex]),
        hexToRgb(colors[nextIndex]),
        localT
      );
      const mid = interpolateColor(
        hexToRgb(colors[nextIndex]),
        hexToRgb(colors[(nextIndex + 1) % colors.length]),
        localT
      );

      setColorFront(rgbToHex(front));
      setColorMid(rgbToHex(mid));

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full -z-10 bg-gray-950">
      <NeuroNoise
        colorFront={colorFront}
        colorMid={colorMid}
        colorBack="#000000"
        brightness={0.05}
        contrast={0.3}
        scale={Math.max(speedRef.current / 3, 0.8)} // scale derived from smooth speed
        speed={speedRef.current} // smooth speed
        rotation={rotation}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default NeuroNoiseBG;
