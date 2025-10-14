import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { ShaderMaterial } from "three";
import fragmentShader from "./sun.frag";
import vertexShader from "./sun.vert";
const SunsetShaderMaterial = new ShaderMaterial({
  uniforms: {
    time: { value: 0 },
    resolution: { value: [0, 0] },
    mouse: { value: [0, 0] },
  },
  vertexShader,
  fragmentShader,
});

const ShaderPlane: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<any>(SunsetShaderMaterial);

  const [mouse, setMouse] = useState<[number, number]>([0, 0]);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      setMouse([
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      ]);
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  useFrame(({ clock, gl }) => {
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = clock.getElapsedTime();
      materialRef.current.uniforms.mouse.value = mouse;
      materialRef.current.uniforms.resolution.value = [
        gl.domElement.width,
        gl.domElement.height,
      ];
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <primitive object={materialRef.current} attach="material" />
    </mesh>
  );
};

const SunRaymarchCanvas: React.FC = () => {
  return (
    <Canvas
      style={{ height: "100vh", width: "100vw", position: "fixed" }}
      orthographic
      camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 100 }}>
      <ShaderPlane />
    </Canvas>
  );
};

export default SunRaymarchCanvas;
