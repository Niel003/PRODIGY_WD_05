import type { SceneType } from './types';

export interface WeatherCodeInfo {
  label: string;
  scene: SceneType;
  icon: string;
}

export const WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: { label: 'Clear sky', scene: 'clear', icon: 'Sun' },
  1: { label: 'Mainly clear', scene: 'clear', icon: 'Sun' },
  2: { label: 'Partly cloudy', scene: 'cloudy', icon: 'CloudSun' },
  3: { label: 'Overcast', scene: 'cloudy', icon: 'Cloud' },
  45: { label: 'Fog', scene: 'fog', icon: 'CloudFog' },
  48: { label: 'Rime fog', scene: 'fog', icon: 'CloudFog' },
  51: { label: 'Light drizzle', scene: 'rain', icon: 'CloudDrizzle' },
  53: { label: 'Drizzle', scene: 'rain', icon: 'CloudDrizzle' },
  55: { label: 'Heavy drizzle', scene: 'rain', icon: 'CloudDrizzle' },
  56: { label: 'Freezing drizzle', scene: 'rain', icon: 'CloudDrizzle' },
  57: { label: 'Freezing drizzle', scene: 'rain', icon: 'CloudDrizzle' },
  61: { label: 'Light rain', scene: 'rain', icon: 'CloudRain' },
  63: { label: 'Rain', scene: 'rain', icon: 'CloudRain' },
  65: { label: 'Heavy rain', scene: 'rain', icon: 'CloudRain' },
  66: { label: 'Freezing rain', scene: 'rain', icon: 'CloudRain' },
  67: { label: 'Freezing rain', scene: 'rain', icon: 'CloudRain' },
  71: { label: 'Light snow', scene: 'snow', icon: 'CloudSnow' },
  73: { label: 'Snow', scene: 'snow', icon: 'CloudSnow' },
  75: { label: 'Heavy snow', scene: 'snow', icon: 'CloudSnow' },
  77: { label: 'Snow grains', scene: 'snow', icon: 'CloudSnow' },
  80: { label: 'Rain showers', scene: 'rain', icon: 'CloudRain' },
  81: { label: 'Rain showers', scene: 'rain', icon: 'CloudRain' },
  82: { label: 'Violent rain', scene: 'storm', icon: 'CloudRainWind' },
  85: { label: 'Snow showers', scene: 'snow', icon: 'CloudSnow' },
  86: { label: 'Snow showers', scene: 'snow', icon: 'CloudSnow' },
  95: { label: 'Thunderstorm', scene: 'storm', icon: 'CloudLightning' },
  96: { label: 'Thunderstorm', scene: 'storm', icon: 'CloudLightning' },
  99: { label: 'Thunderstorm', scene: 'storm', icon: 'CloudLightning' },
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WEATHER_CODES[code] ?? { label: 'Unknown', scene: 'cloudy', icon: 'Cloud' };
}

export function getScene(code: number, isDay: boolean): SceneType {
  const info = WEATHER_CODES[code];
  if (!info) return 'cloudy';
  if (info.scene === 'clear' && !isDay) return 'clear';
  return info.scene;
}
