import type { AirQuality } from './types';

export function celsiusToFahrenheit(c: number): number {
  return (c * 9) / 5 + 32;
}

export function formatTemp(c: number, unit: 'C' | 'F'): string {
  const val = unit === 'C' ? c : celsiusToFahrenheit(c);
  return `${Math.round(val)}°`;
}

export function formatTempUnit(c: number, unit: 'C' | 'F'): string {
  const val = unit === 'C' ? c : celsiusToFahrenheit(c);
  return `${Math.round(val)}°${unit}`;
}

export function uvCategory(uv: number): { label: string; color: string } {
  if (uv < 3) return { label: 'Low', color: '#4ade80' };
  if (uv < 6) return { label: 'Moderate', color: '#facc15' };
  if (uv < 8) return { label: 'High', color: '#fb923c' };
  if (uv < 11) return { label: 'Very High', color: '#f87171' };
  return { label: 'Extreme', color: '#c084fc' };
}

export function aqiCategory(aqi: number): { label: string; color: string; percent: number } {
  if (aqi <= 50) return { label: 'Good', color: '#4ade80', percent: (aqi / 50) * 25 };
  if (aqi <= 100) return { label: 'Moderate', color: '#facc15', percent: 25 + ((aqi - 50) / 50) * 25 };
  if (aqi <= 150) return { label: 'Unhealthy (Sensitive)', color: '#fb923c', percent: 50 + ((aqi - 100) / 50) * 25 };
  if (aqi <= 200) return { label: 'Unhealthy', color: '#f87171', percent: 75 + ((aqi - 150) / 50) * 12.5 };
  return { label: 'Hazardous', color: '#c084fc', percent: 87.5 + Math.min(((aqi - 200) / 200) * 12.5, 12.5) };
}

export function windDirLabel(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  return dirs[Math.round(deg / 45) % 8];
}

export function sunPosition(
  sunrise: string,
  sunset: string,
  now: Date = new Date()
): { progress: number; isDay: boolean } {
  const sr = new Date(sunrise).getTime();
  const ss = new Date(sunset).getTime();
  const t = now.getTime();
  if (t < sr || t > ss) return { progress: t > ss ? 1 : 0, isDay: false };
  return { progress: (t - sr) / (ss - sr), isDay: true };
}

export function formatHour(h: number): string {
  const period = h >= 12 ? 'PM' : 'AM';
  const display = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${display}${period}`;
}

export function formatDay(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function aqiLabel(aq: AirQuality): { label: string; color: string; percent: number; value: number } {
  const aqi = aq.usAqi || aq.europeanAqi || 0;
  const cat = aqiCategory(aqi);
  return { ...cat, value: Math.round(aqi) };
}
