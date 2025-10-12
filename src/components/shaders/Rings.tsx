import { ArrowLeft } from "@/assets/icons";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import * as THREE from "three";
import { Button } from "../ui/button";

const fragmentShader = `
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 axel = vec2(1.0);
const float count = 88.0;
float brght = 0.01;
float dist = 0.5;
float radius = 0.05;
float l = 1.2;
float w = 1.2;

// simple HSV to RGB
vec3 hsv2rgb(vec3 c){
    vec3 rgb = clamp(
        abs(mod(c.x*6.0 + vec3(0.0,4.0,2.0),6.0)-3.0)-1.0,
        0.0,
        1.0
    );
    return c.z * mix(vec3(1.0), rgb, c.y);
}

void main(void) {
    axel = mouse;

    // HSV base: hue changes with mouse.x, brightness with mouse.y
    vec3 Color = hsv2rgb(vec3(mouse.x, 0.6, 0.5 + 0.5*mouse.y));
    float col = -0.3;
    vec2 centr = 2.0 * (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    for(float i = 0.0; i < count; i++) {
        float si = sin(time + i * dist * axel.x) * l;
        float co = cos(time + i * dist * axel.y) * w;
        col += brght / abs(length(centr + vec2(si , co)) - radius);
    }

    gl_FragColor = vec4(Color * col, 1.0);
}

`;

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
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const RingsShader: React.FC = () => {
  return (
    <>
      <div className="absolute top-4 left-4 z-20 flex gap-1">
        <Link to="/" tabIndex={-1}>
          <Button title="Home" variant={"ghost"} size={"icon"}>
            <ArrowLeft className="size-4" />
          </Button>
        </Link>
      </div>
      <Canvas
        style={{ height: "100%", width: "100vw", position: "fixed" }}
        orthographic
        camera={{ left: -1, right: 1, top: 1, bottom: -1, near: 0, far: 10 }}>
        <ShaderPlane />
      </Canvas>
      <p className="opacity-60 text-center fixed bottom-5 left-0 right-0 font-mono uppercase text-[12px] font-semibold text-">
        Use your mouse to move the rings
      </p>
    </>
  );
};

export default RingsShader;
