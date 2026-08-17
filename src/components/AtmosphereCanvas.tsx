import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { WeatherCategory } from '@/weather/types';

interface Props {
  category: WeatherCategory;
  isDay: boolean;
  accent: string;
  particleColor: string;
}

/* ---------- Sun ---------- */
function Sun({ accent }: { accent: string }) {
  const coreRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const raysRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.z = t * 0.15;
      const s = 1 + Math.sin(t * 1.5) * 0.03;
      coreRef.current.scale.setScalar(s);
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(1 + Math.sin(t * 1.2) * 0.08);
      (glowRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.25 + Math.sin(t * 2) * 0.05;
    }
    if (raysRef.current) raysRef.current.rotation.z = t * 0.08;
  });

  const rays = useMemo(() => {
    const arr: { angle: number; len: number }[] = [];
    for (let i = 0; i < 12; i++) {
      arr.push({ angle: (i / 12) * Math.PI * 2, len: 1.8 + (i % 3) * 0.3 });
    }
    return arr;
  }, []);

  const color = new THREE.Color(accent);

  return (
    <group position={[3, 1.5, -4]}>
      <mesh ref={coreRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={glowRef} scale={2.2}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          toneMapped={false}
        />
      </mesh>
      <mesh scale={3.4}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.08}
          toneMapped={false}
        />
      </mesh>
      <group ref={raysRef}>
        {rays.map((r, i) => (
          <mesh
            key={i}
            rotation={[0, 0, r.angle]}
            position={[Math.cos(r.angle) * (1 + r.len * 0.3), Math.sin(r.angle) * (1 + r.len * 0.3), 0]}
          >
            <planeGeometry args={[0.08, r.len]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={0.25}
              toneMapped={false}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>
      {/* Stars for night-sky feel handled separately */}
    </group>
  );
}

/* ---------- Rain ---------- */
function Rain({ particleColor }: { particleColor: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 1400;

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      spd[i] = 0.08 + Math.random() * 0.12;
    }
    return { positions: pos, speeds: spd };
  }, []);

  useFrame(() => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i];
      pos[i * 3] -= 0.01;
      if (pos[i * 3 + 1] < -7) {
        pos[i * 3 + 1] = 7;
        pos[i * 3] = (Math.random() - 0.5) * 22;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(particleColor)}
        size={0.08}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------- Snow ---------- */
function Snow({ particleColor }: { particleColor: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 800;

  const { positions, speeds, drift } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    const drf = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 22;
      pos[i * 3 + 1] = Math.random() * 14;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      spd[i] = 0.01 + Math.random() * 0.025;
      drf[i] = Math.random() * Math.PI * 2;
    }
    return { positions: pos, speeds: spd, drift: drf };
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const pos = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] -= speeds[i];
      pos[i * 3] += Math.sin(t + drift[i]) * 0.004;
      if (pos[i * 3 + 1] < -7) {
        pos[i * 3 + 1] = 7;
        pos[i * 3] = (Math.random() - 0.5) * 22;
      }
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={ref} position={[0, 0, -2]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(particleColor)}
        size={0.14}
        transparent
        opacity={0.85}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------- Clouds ---------- */
function Clouds({ accent }: { accent: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const clouds = useMemo(() => {
    const arr: { pos: [number, number, number]; scale: number; speed: number }[] = [];
    for (let i = 0; i < 7; i++) {
      arr.push({
        pos: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 5 + 1,
          -3 - Math.random() * 3,
        ],
        scale: 1.5 + Math.random() * 2,
        speed: 0.003 + Math.random() * 0.004,
      });
    }
    return arr;
  }, []);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((c, i) => {
      c.position.x += clouds[i].speed;
      if (c.position.x > 10) c.position.x = -10;
    });
  });

  const color = new THREE.Color(accent);

  return (
    <group ref={groupRef}>
      {clouds.map((c, i) => (
        <mesh key={i} position={c.pos} scale={c.scale}>
          <sphereGeometry args={[1, 16, 16]} />
          <meshBasicMaterial
            color={color}
            transparent
            opacity={0.06}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- Stars (night) ---------- */
function Stars({ particleColor }: { particleColor: string }) {
  const ref = useRef<THREE.Points>(null);
  const count = 500;
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 30;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = -8 - Math.random() * 5;
    }
    return pos;
  }, []);

  useFrame((state) => {
    if (!ref.current) return;
    const mat = ref.current.material as THREE.PointsMaterial;
    mat.opacity = 0.5 + Math.sin(state.clock.elapsedTime * 1.5) * 0.3;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={new THREE.Color(particleColor)}
        size={0.06}
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

/* ---------- Lightning flash (thunderstorm) ---------- */
function Lightning() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    const flash = Math.random() > 0.985 ? 1 : 0;
    const mat = ref.current.material as THREE.MeshBasicMaterial;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, flash * 0.4, 0.3);
    void t;
  });
  return (
    <mesh ref={ref} position={[0, 2, -5]} scale={[20, 12, 1]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial
        color={new THREE.Color('#9ab0ff')}
        transparent
        opacity={0}
        toneMapped={false}
      />
    </mesh>
  );
}

export default function AtmosphereCanvas({
  category,
  isDay,
  accent,
  particleColor,
}: Props) {
  const isNight = !isDay && (category === 'clear' || category === 'cloudy');

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 60 }}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.5} />
      {category === 'clear' && isDay && <Sun accent={accent} />}
      {category === 'clear' && !isDay && <Stars particleColor={particleColor} />}
      {category === 'cloudy' && !isDay && <Stars particleColor={particleColor} />}
      {(category === 'cloudy' || category === 'fog') && <Clouds accent={accent} />}
      {(category === 'rain' || category === 'drizzle' || category === 'thunderstorm') && (
        <Rain particleColor={particleColor} />
      )}
      {(category === 'rain' || category === 'drizzle') && (
        <Clouds accent={accent} />
      )}
      {category === 'snow' && <Snow particleColor={particleColor} />}
      {category === 'thunderstorm' && (
        <>
          <Clouds accent={accent} />
          <Lightning />
        </>
      )}
      {isNight && category !== 'clear' && <Stars particleColor={particleColor} />}
    </Canvas>
  );
}
