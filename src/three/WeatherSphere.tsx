import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SEGMENTS = 64;

function generateEarthTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  // Ocean gradient
  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a2a4a');
  oceanGrad.addColorStop(0.5, '#0d3a5e');
  oceanGrad.addColorStop(1, '#0a2a4a');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  // Generate continent-like blobs
  const continents = [
    { x: 250, y: 180, w: 120, h: 100 },
    { x: 200, y: 280, w: 80, h: 140 },
    { x: 480, y: 160, w: 160, h: 120 },
    { x: 520, y: 300, w: 100, h: 100 },
    { x: 700, y: 200, w: 180, h: 150 },
    { x: 820, y: 350, w: 80, h: 60 },
    { x: 120, y: 350, w: 60, h: 50 },
    { x: 400, y: 380, w: 100, h: 40 },
  ];

  for (const c of continents) {
    const grad = ctx.createRadialGradient(c.x, c.y, 0, c.x, c.y, c.w);
    grad.addColorStop(0, '#2d6a4f');
    grad.addColorStop(0.6, '#1a5a3a');
    grad.addColorStop(1, 'rgba(13, 58, 94, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.w, c.h, Math.random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }

  // Add noise dots for texture
  for (let i = 0; i < 3000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = Math.random() * 1.5;
    ctx.fillStyle = `rgba(${Math.random() > 0.5 ? '40, 100, 60' : '20, 60, 90'}, ${Math.random() * 0.3})`;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function generateCloudTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d')!;

  for (let i = 0; i < 80; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 512;
    const r = 20 + Math.random() * 60;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.5)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

export function WeatherSphere({
  cloudCover = 0.5,
  temperature = 20,
}: {
  cloudCover?: number;
  temperature?: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const cloudRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);

  const earthTex = useMemo(() => generateEarthTexture(), []);
  const cloudTex = useMemo(() => generateCloudTexture(), []);

  // Temperature-based tint
  const tempColor = useMemo(() => {
    if (temperature < 0) return new THREE.Color('#88aaff');
    if (temperature > 30) return new THREE.Color('#ffaa66');
    return new THREE.Color('#ffffff');
  }, [temperature]);

  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.08;
    if (cloudRef.current) cloudRef.current.rotation.y += delta * 0.12;
    if (atmosphereRef.current) {
      const mat = atmosphereRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.08 + Math.sin(Date.now() * 0.001) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Earth */}
      <mesh>
        <sphereGeometry args={[1.6, SEGMENTS, SEGMENTS]} />
        <meshStandardMaterial
          map={earthTex}
          roughness={0.8}
          metalness={0.1}
          emissive={tempColor}
          emissiveIntensity={0.05}
        />
      </mesh>

      {/* Clouds */}
      <mesh ref={cloudRef} visible={cloudCover > 0.1}>
        <sphereGeometry args={[1.65, SEGMENTS, SEGMENTS]} />
        <meshStandardMaterial
          map={cloudTex}
          transparent
          opacity={Math.min(cloudCover * 0.8, 0.7)}
          depthWrite={false}
          roughness={1}
        />
      </mesh>

      {/* Atmosphere glow */}
      <mesh ref={atmosphereRef} scale={1.15}>
        <sphereGeometry args={[1.6, SEGMENTS, SEGMENTS]} />
        <meshBasicMaterial
          color="#44aaff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Outer glow */}
      <mesh scale={1.3}>
        <sphereGeometry args={[1.6, SEGMENTS, SEGMENTS]} />
        <meshBasicMaterial
          color="#2266aa"
          transparent
          opacity={0.04}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}
