import {
  Sun,
  Moon,
  Cloud,
  CloudFog,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudSun,
  CloudMoon,
  type LucideIcon,
} from 'lucide-react';
import type { WeatherCategory } from '@/weather/types';

interface Props {
  category: WeatherCategory;
  isDay?: boolean;
  className?: string;
}

export default function WeatherIcon({
  category,
  isDay = true,
  className = 'w-6 h-6',
}: Props) {
  const map: Record<WeatherCategory, { day: LucideIcon; night: LucideIcon }> = {
    clear: { day: Sun, night: Moon },
    cloudy: { day: CloudSun, night: CloudMoon },
    fog: { day: CloudFog, night: CloudFog },
    drizzle: { day: CloudDrizzle, night: CloudDrizzle },
    rain: { day: CloudRain, night: CloudRain },
    snow: { day: CloudSnow, night: CloudSnow },
    thunderstorm: { day: CloudLightning, night: CloudLightning },
  };

  const Icon = isDay ? map[category].day : map[category].night;
  return <Icon className={className} />;
}

export function PlainCloud({ className = 'w-6 h-6' }: { className?: string }) {
  return <Cloud className={className} />;
}
