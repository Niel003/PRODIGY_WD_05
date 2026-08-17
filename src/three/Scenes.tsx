import { useMemo, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { SceneType } from '@/lib/types';

const RAIN_COUNT = 2500;
const SNOW_COUNT = 1000;
const DUST_COUNT = 600;
const FOG_COUNT = 200;

function RainParticles({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, velocities } = useMemo(() => {
    const positions = new Float32Array(RAIN_COUNT * 3);
    const vels = new Float32Array(RAIN_COUNT);
    for (let i = 0; i < RAIN_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 24;
      positions[i * 3 + 1] = Math.random() * 18 - 4;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 24;
      vels[i] = 0.18 + Math.random() * 0.22;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vels };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < RAIN_COUNT; i++) {
      pos[i * 3 + 1] -= velocities[i] * intensity * 1.5;
      if (pos[i * 3 + 1] < -6) {
        pos[i * 3 + 1] = 12;
        pos[i * 3] = (Math.random() - 0.5) * 24;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 24;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.035}
        color="#90c0ff"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SnowParticles({ intensity = 1 }: { intensity?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, velocities, offsets } = useMemo(() => {
    const positions = new Float32Array(SNOW_COUNT * 3);
    const vels = new Float32Array(SNOW_COUNT);
    const offs = new Float32Array(SNOW_COUNT);
    for (let i = 0; i < SNOW_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 22;
      positions[i * 3 + 1] = Math.random() * 16 - 3;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 22;
      vels[i] = 0.015 + Math.random() * 0.03;
      offs[i] = Math.random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vels, offsets: offs };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < SNOW_COUNT; i++) {
      pos[i * 3 + 1] -= velocities[i] * intensity * 1.2;
      pos[i * 3] += Math.sin(t * 0.5 + offsets[i]) * 0.008;
      pos[i * 3 + 2] += Math.cos(t * 0.5 + offsets[i]) * 0.008;
      if (pos[i * 3 + 1] < -5) {
        pos[i * 3 + 1] = 10;
        pos[i * 3] = (Math.random() - 0.5) * 22;
        pos[i * 3 + 2] = (Math.random() - 0.5) * 22;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.07}
        color="#eef6ff"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function DustParticles({ dayFactor = 1 }: { dayFactor?: number }) {
  const ref = useRef<THREE.Points>(null);

  const { geometry, velocities, offsets } = useMemo(() => {
    const positions = new Float32Array(DUST_COUNT * 3);
    const vels = new Float32Array(DUST_COUNT);
    const offs = new Float32Array(DUST_COUNT);
    for (let i = 0; i < DUST_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vels[i] = 0.003 + Math.random() * 0.008;
      offs[i] = Math.random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vels, offsets: offs };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < DUST_COUNT; i++) {
      pos[i * 3 + 1] += velocities[i];
      pos[i * 3] += Math.sin(t * 0.3 + offsets[i]) * 0.004;
      pos[i * 3 + 2] += Math.cos(t * 0.2 + offsets[i]) * 0.004;
      if (pos[i * 3 + 1] > 8) pos[i * 3 + 1] = -6;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  const color = dayFactor > 0.4 ? '#ffdd88' : '#6688cc';

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color={color}
        transparent
        opacity={0.5}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function CloudField() {
  const groupRef = useRef<THREE.Group>(null);

  const clouds = useMemo(() => {
    return Array.from({ length: 14 }, () => ({
      position: [
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 5 + 1,
        (Math.random() - 0.5) * 16 - 2,
      ] as [number, number, number],
      scale: 1.5 + Math.random() * 2.5,
      opacity: 0.06 + Math.random() * 0.1,
    }));
  }, []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const x = state.pointer.x * 0.8;
    const y = state.pointer.y * 0.4;
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, x, 0.04);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, y, 0.04);
    groupRef.current.rotation.y += 0.0004;
  });

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.position} scale={c.scale}>
          <sphereGeometry args={[1, 12, 12]} />
          <meshStandardMaterial
            color="#aabbcc"
            transparent
            opacity={c.opacity}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

function SunMesh({ dayFactor = 1 }: { dayFactor?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
    if (glowRef.current) {
      const s = 1 + Math.sin(state.clock.elapsedTime * 0.8) * 0.05;
      glowRef.current.scale.setScalar(s);
    }
  });

  return (
    <group position={[6, 3.5, -6]}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial color="#ffdd55" toneMapped={false} />
      </mesh>
      <mesh ref={glowRef} scale={1.4}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#ffaa22"
          transparent
          opacity={0.25}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh scale={2.2}>
        <sphereGeometry args={[0.9, 32, 32]} />
        <meshBasicMaterial
          color="#ff8800"
          transparent
          opacity={0.08}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <pointLight color="#ffdd88" intensity={dayFactor * 2.5} distance={35} />
    </group>
  );
}

function LightningSystem() {
  const lightRef = useRef<THREE.PointLight>(null);
  const flashRef = useRef<THREE.Mesh>(null);
  const nextFlash = useRef(2 + Math.random() * 4);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (t > nextFlash.current && lightRef.current) {
      lightRef.current.intensity = 6 + Math.random() * 14;
      nextFlash.current = t + 2 + Math.random() * 6;
    }
    if (lightRef.current) {
      lightRef.current.intensity = THREE.MathUtils.lerp(lightRef.current.intensity, 0, 0.06);
    }
    if (flashRef.current) {
      const mat = flashRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, 0, 0.08);
    }
  });

  return (
    <>
      <pointLight ref={lightRef} position={[0, 6, 2]} color="#e0e8ff" intensity={0} distance={50} />
      <mesh ref={flashRef} position={[0, 0, 8]}>
        <planeGeometry args={[40, 25]} />
        <meshBasicMaterial
          color="#ddeeff"
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}

function FogParticles() {
  const ref = useRef<THREE.Points>(null);

  const { geometry, velocities, offsets } = useMemo(() => {
    const positions = new Float32Array(FOG_COUNT * 3);
    const vels = new Float32Array(FOG_COUNT);
    const offs = new Float32Array(FOG_COUNT);
    for (let i = 0; i < FOG_COUNT; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
      vels[i] = 0.005 + Math.random() * 0.01;
      offs[i] = Math.random() * Math.PI * 2;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return { geometry: g, velocities: vels, offsets: offs };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < FOG_COUNT; i++) {
      pos[i * 3] += Math.sin(t * 0.1 + offsets[i]) * velocities[i];
      pos[i * 3 + 2] += Math.cos(t * 0.1 + offsets[i]) * velocities[i];
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.6}
        color="#99aabb"
        transparent
        opacity={0.08}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function WeatherScenes({
  type,
  dayFactor = 1,
  intensity = 1,
}: {
  type: SceneType;
  dayFactor?: number;
  intensity?: number;
}) {
  switch (type) {
    case 'clear':
      return (
        <>
          <SunMesh dayFactor={dayFactor} />
          <DustParticles dayFactor={dayFactor} />
        </>
      );
    case 'cloudy':
      return <CloudField />;
    case 'rain':
      return <RainParticles intensity={intensity} />;
    case 'storm':
      return (
        <>
          <RainParticles intensity={intensity * 1.3} />
          <LightningSystem />
        </>
      );
    case 'snow':
      return <SnowParticles intensity={intensity} />;
    case 'fog':
      return <FogParticles />;
    default:
      return <CloudField />;
  }
}
