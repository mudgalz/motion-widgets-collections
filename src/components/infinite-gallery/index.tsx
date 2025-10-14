import { useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { ImageItem, InfiniteGalleryProps, PlaneData } from "./types";

// Custom shader material for blur, opacity, and cloth folding effects
import imageFragmentShader from "./image.frag";
import imageVertexShader from "./image.vert";

const DEFAULT_DEPTH_RANGE = 50;
const MAX_HORIZONTAL_OFFSET = 8;
const MAX_VERTICAL_OFFSET = 8;

const createClothMaterial = () => {
  return new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
      map: { value: null },
      opacity: { value: 1.0 },
      blurAmount: { value: 0.0 },
      scrollForce: { value: 0.0 },
      time: { value: 0.0 },
      isHovered: { value: 0.0 },
    },
    vertexShader: imageVertexShader,
    fragmentShader: imageFragmentShader,
  });
};

function ImagePlane({
  texture,
  position,
  scale,
  material,
}: {
  texture: THREE.Texture;
  position: [number, number, number];
  scale: [number, number, number];
  material: THREE.ShaderMaterial;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (material && texture) {
      material.uniforms.map.value = texture;
    }
  }, [material, texture]);

  useEffect(() => {
    if (material && material.uniforms) {
      material.uniforms.isHovered.value = isHovered ? 1.0 : 0.0;
    }
  }, [material, isHovered]);

  return (
    <mesh
      ref={meshRef}
      position={position}
      scale={scale}
      material={material}
      onPointerEnter={() => setIsHovered(true)}
      onPointerLeave={() => setIsHovered(false)}>
      <planeGeometry args={[1, 1, 32, 32]} />
    </mesh>
  );
}

function GalleryScene({
  images,
  speed = 1,
  visibleCount = 8,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.15 },
    fadeOut: { start: 0.85, end: 0.95 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.9, end: 1.0 },
    maxBlur: 3.0,
  },
}: Omit<InfiniteGalleryProps, "className" | "style">) {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const lastInteraction = useRef(Date.now());

  // Normalize images to objects
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img
      ),
    [images]
  );

  // Load textures
  const textures = useTexture(normalizedImages.map((img) => img.src));

  // Create materials pool
  const materials = useMemo(
    () => Array.from({ length: visibleCount }, () => createClothMaterial()),
    [visibleCount]
  );

  const spatialPositions = useMemo(() => {
    const positions: { x: number; y: number }[] = [];
    const maxHorizontalOffset = MAX_HORIZONTAL_OFFSET;
    const maxVerticalOffset = MAX_VERTICAL_OFFSET;

    for (let i = 0; i < visibleCount; i++) {
      // Create varied distribution patterns for both axes
      const horizontalAngle = (i * 2.618) % (Math.PI * 2); // Golden angle for natural distribution
      const verticalAngle = (i * 1.618 + Math.PI / 3) % (Math.PI * 2); // Offset angle for vertical

      const horizontalRadius = (i % 3) * 1.2; // Vary the distance from center
      const verticalRadius = ((i + 1) % 4) * 0.8; // Different pattern for vertical

      const x =
        (Math.sin(horizontalAngle) * horizontalRadius * maxHorizontalOffset) /
        3;
      const y =
        (Math.cos(verticalAngle) * verticalRadius * maxVerticalOffset) / 4;

      positions.push({ x, y });
    }

    return positions;
  }, [visibleCount]);

  const totalImages = normalizedImages.length;
  const depthRange = DEFAULT_DEPTH_RANGE;

  // Initialize plane data
  const planesData = useRef<PlaneData[]>(
    Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z: visibleCount > 0 ? ((depthRange / visibleCount) * i) % depthRange : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0, // Use spatial positions for x
      y: spatialPositions[i]?.y ?? 0, // Use spatial positions for y
    }))
  );

  useEffect(() => {
    planesData.current = Array.from({ length: visibleCount }, (_, i) => ({
      index: i,
      z:
        visibleCount > 0
          ? ((depthRange / Math.max(visibleCount, 1)) * i) % depthRange
          : 0,
      imageIndex: totalImages > 0 ? i % totalImages : 0,
      x: spatialPositions[i]?.x ?? 0,
      y: spatialPositions[i]?.y ?? 0,
    }));
  }, [depthRange, spatialPositions, totalImages, visibleCount]);

  // Handle scroll input
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault();
      setScrollVelocity((prev) => prev + event.deltaY * 0.01 * speed);
      setAutoPlay(false);
      lastInteraction.current = Date.now();
    },
    [speed]
  );

  // Handle keyboard input
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        setScrollVelocity((prev) => prev - 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      } else if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        setScrollVelocity((prev) => prev + 2 * speed);
        setAutoPlay(false);
        lastInteraction.current = Date.now();
      }
    },
    [speed]
  );

  useEffect(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("wheel", handleWheel, { passive: false });
      document.addEventListener("keydown", handleKeyDown);

      return () => {
        canvas.removeEventListener("wheel", handleWheel);
        document.removeEventListener("keydown", handleKeyDown);
      };
    }
  }, [handleWheel, handleKeyDown]);

  // Handle mobile touch move (mobile)
  useEffect(() => {
    let lastTouchY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      lastTouchY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length === 0) return;
      const currentY = event.touches[0].clientY;
      const delta = lastTouchY - currentY; // swipe up = positive velocity
      setScrollVelocity((prev) => prev + delta * 0.01); // adjust multiplier
      lastTouchY = currentY;
    };

    const canvas = document.querySelector("canvas");
    if (canvas) {
      canvas.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      canvas.addEventListener("touchmove", handleTouchMove, { passive: false });
    }

    return () => {
      if (canvas) {
        canvas.removeEventListener("touchstart", handleTouchStart);
        canvas.removeEventListener("touchmove", handleTouchMove);
      }
    };
  }, []);

  // Auto-play logic
  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current > 3000) {
        setAutoPlay(true);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useFrame((state, delta) => {
    // Apply auto-play
    if (autoPlay) {
      setScrollVelocity((prev) => prev + 0.3 * delta);
    }

    // Damping
    setScrollVelocity((prev) => prev * 0.95);

    // Update time uniform for all materials
    const time = state.clock.getElapsedTime();
    materials.forEach((material) => {
      if (material && material.uniforms) {
        material.uniforms.time.value = time;
        material.uniforms.scrollForce.value = scrollVelocity;
      }
    });

    // Update plane positions
    const imageAdvance =
      totalImages > 0 ? visibleCount % totalImages || totalImages : 0;
    const totalRange = depthRange;

    planesData.current.forEach((plane, i) => {
      let newZ = plane.z + scrollVelocity * delta * 10;
      let wrapsForward = 0;
      let wrapsBackward = 0;

      if (newZ >= totalRange) {
        wrapsForward = Math.floor(newZ / totalRange);
        newZ -= totalRange * wrapsForward;
      } else if (newZ < 0) {
        wrapsBackward = Math.ceil(-newZ / totalRange);
        newZ += totalRange * wrapsBackward;
      }

      if (wrapsForward > 0 && imageAdvance > 0 && totalImages > 0) {
        plane.imageIndex =
          (plane.imageIndex + wrapsForward * imageAdvance) % totalImages;
      }

      if (wrapsBackward > 0 && imageAdvance > 0 && totalImages > 0) {
        const step = plane.imageIndex - wrapsBackward * imageAdvance;
        plane.imageIndex = ((step % totalImages) + totalImages) % totalImages;
      }

      plane.z = ((newZ % totalRange) + totalRange) % totalRange;
      plane.x = spatialPositions[i]?.x ?? 0;
      plane.y = spatialPositions[i]?.y ?? 0;

      // Calculate opacity based on fade settings
      const normalizedPosition = plane.z / totalRange; // 0 to 1
      let opacity = 1;

      if (
        normalizedPosition >= fadeSettings.fadeIn.start &&
        normalizedPosition <= fadeSettings.fadeIn.end
      ) {
        // Fade in: opacity goes from 0 to 1 within the fade in range
        const fadeInProgress =
          (normalizedPosition - fadeSettings.fadeIn.start) /
          (fadeSettings.fadeIn.end - fadeSettings.fadeIn.start);
        opacity = fadeInProgress;
      } else if (normalizedPosition < fadeSettings.fadeIn.start) {
        // Before fade in starts: fully transparent
        opacity = 0;
      } else if (
        normalizedPosition >= fadeSettings.fadeOut.start &&
        normalizedPosition <= fadeSettings.fadeOut.end
      ) {
        // Fade out: opacity goes from 1 to 0 within the fade out range
        const fadeOutProgress =
          (normalizedPosition - fadeSettings.fadeOut.start) /
          (fadeSettings.fadeOut.end - fadeSettings.fadeOut.start);
        opacity = 1 - fadeOutProgress;
      } else if (normalizedPosition > fadeSettings.fadeOut.end) {
        // After fade out ends: fully transparent
        opacity = 0;
      }

      // Clamp opacity between 0 and 1
      opacity = Math.max(0, Math.min(1, opacity));

      // Calculate blur based on blur settings
      let blur = 0;

      if (
        normalizedPosition >= blurSettings.blurIn.start &&
        normalizedPosition <= blurSettings.blurIn.end
      ) {
        // Blur in: blur goes from maxBlur to 0 within the blur in range
        const blurInProgress =
          (normalizedPosition - blurSettings.blurIn.start) /
          (blurSettings.blurIn.end - blurSettings.blurIn.start);
        blur = blurSettings.maxBlur * (1 - blurInProgress);
      } else if (normalizedPosition < blurSettings.blurIn.start) {
        // Before blur in starts: full blur
        blur = blurSettings.maxBlur;
      } else if (
        normalizedPosition >= blurSettings.blurOut.start &&
        normalizedPosition <= blurSettings.blurOut.end
      ) {
        // Blur out: blur goes from 0 to maxBlur within the blur out range
        const blurOutProgress =
          (normalizedPosition - blurSettings.blurOut.start) /
          (blurSettings.blurOut.end - blurSettings.blurOut.start);
        blur = blurSettings.maxBlur * blurOutProgress;
      } else if (normalizedPosition > blurSettings.blurOut.end) {
        // After blur out ends: full blur
        blur = blurSettings.maxBlur;
      }

      // Clamp blur to reasonable values
      blur = Math.max(0, Math.min(blurSettings.maxBlur, blur));

      // Update material uniforms
      const material = materials[i];
      if (material && material.uniforms) {
        material.uniforms.opacity.value = opacity;
        material.uniforms.blurAmount.value = blur;
      }
    });
  });

  if (normalizedImages.length === 0) return null;

  return (
    <>
      {planesData.current.map((plane, i) => {
        const texture = textures[plane.imageIndex];
        const material = materials[i];

        if (!texture || !material) return null;

        const worldZ = plane.z - depthRange / 2;

        // Calculate scale to maintain aspect ratio
        const aspect = texture.image
          ? texture.image.width / texture.image.height
          : 1;
        const scale: [number, number, number] =
          aspect > 1 ? [3 * aspect, 3, 1] : [3, 3 / aspect, 1]; // was 2

        return (
          <ImagePlane
            key={plane.index}
            texture={texture}
            position={[plane.x, plane.y, worldZ]} // Position planes relative to camera center
            scale={scale}
            material={material}
          />
        );
      })}
    </>
  );
}

// Fallback component for when WebGL is not available
function FallbackGallery({ images }: { images: ImageItem[] }) {
  const normalizedImages = useMemo(
    () =>
      images.map((img) =>
        typeof img === "string" ? { src: img, alt: "" } : img
      ),
    [images]
  );

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <p className="text-gray-600 mb-4">
        WebGL not supported. Showing image list:
      </p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {normalizedImages.map((img, i) => (
          <img
            key={i}
            src={img.src || "/placeholder.svg"}
            alt={img.alt}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>
    </div>
  );
}

export default function InfiniteGallery({
  images,
  className = "h-96 w-full",
  style,
  fadeSettings = {
    fadeIn: { start: 0.05, end: 0.25 },
    fadeOut: { start: 0.4, end: 0.43 },
  },
  blurSettings = {
    blurIn: { start: 0.0, end: 0.1 },
    blurOut: { start: 0.4, end: 0.43 },
    maxBlur: 8.0,
  },
}: InfiniteGalleryProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div className={className} style={style}>
        <FallbackGallery images={images} />
      </div>
    );
  }

  return (
    <div className={className} style={style} id="infinite-gallery">
      <Canvas
        camera={{ position: [0, 0, 0], fov: 55 }}
        gl={{ antialias: true, alpha: true }}>
        <GalleryScene
          images={images}
          fadeSettings={fadeSettings}
          blurSettings={blurSettings}
        />
      </Canvas>
    </div>
  );
}
