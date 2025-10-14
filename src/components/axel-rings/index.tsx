import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import fragmantShader from "./rings.frag";

const ShaderPlane: React.FC = () => {
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Keep the uniform object constant
  const uniforms = useRef({
    time: { value: 0 },
    mouse: { value: new THREE.Vector2(0.5, 0.5) },
    resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
  }).current;

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      uniforms.mouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
      );
    };
    const handleResize = () => {
      uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("resize", handleResize);
    };
  }, [uniforms]);

  useFrame(({ clock, gl }) => {
    uniforms.time.value = clock.getElapsedTime();
    uniforms.resolution.value.set(gl.domElement.width, gl.domElement.height);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        fragmentShader={fragmantShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const RingsCanvas = () => {
  return (
    <Canvas
      style={{ height: "100%", width: "100vw", position: "fixed" }}
      orthographic
      camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 10 }}>
      <ShaderPlane />
    </Canvas>
  );
};

export default RingsCanvas;
