import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { AdaptiveDpr } from '@react-three/drei';
import * as THREE from 'three';
import { WeatherScenes } from './Scenes';
import { WeatherSphere } from './WeatherSphere';
import type { SceneType } from '@/lib/types';

function SceneLights({
  type,
  dayFactor,
}: {
  type: SceneType;
  dayFactor: number;
}) {
  const ambientColor = useMemo(() => {
    if (dayFactor < 0.3) return new THREE.Color('#1a2244');
    if (type === 'rain' || type === 'storm') return new THREE.Color('#334466');
    if (type === 'snow') return new THREE.Color('#6688aa');
    if (type === 'cloudy') return new THREE.Color('#556677');
    return new THREE.Color('#445588');
  }, [type, dayFactor]);

  return (
    <>
      <ambientLight color={ambientColor} intensity={0.6} />
      <directionalLight position={[5, 8, 5]} intensity={dayFactor * 0.8} color="#ffeecc" />
      <hemisphereLight args={[ambientColor, '#000814', 0.4]} />
    </>
  );
}

function GlobeWithDrag({
  cloudCover,
  temperature,
}: {
  cloudCover: number;
  temperature: number;
}) {
  return (
    <group rotation={[0.2, 0, 0.1]}>
      <WeatherSphere cloudCover={cloudCover} temperature={temperature} />
    </group>
  );
}

export function WeatherCanvas({
  type,
  dayFactor = 1,
  intensity = 1,
  cloudCover = 0.5,
  temperature = 20,
}: {
  type: SceneType;
  dayFactor?: number;
  intensity?: number;
  cloudCover?: number;
  temperature?: number;
}) {
  const bgTop = useMemo(() => {
    if (dayFactor < 0.3) return '#020410';
    if (type === 'clear') return '#0a1830';
    if (type === 'rain' || type === 'storm') return '#0a1420';
    if (type === 'snow') return '#0a1828';
    if (type === 'fog') return '#0a1220';
    return '#081428';
  }, [type, dayFactor]);

  return (
    <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 30%, ${bgTop} 0%, #000510 70%)` }}>
      <Canvas
        camera={{ position: [0, 0, 6], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneLights type={type} dayFactor={dayFactor} />
          <GlobeWithDrag cloudCover={cloudCover} temperature={temperature} />
          <WeatherScenes type={type} dayFactor={dayFactor} intensity={intensity} />
        </Suspense>
        <AdaptiveDpr pixelated={false} />
      </Canvas>
    </div>
  );
}
