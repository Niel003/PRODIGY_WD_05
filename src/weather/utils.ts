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

export function compassDirection(deg: number): string {
  const dirs = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW',
  ];
  return dirs[Math.round(deg / 22.5) % 16];
}

export function formatHour(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: 'numeric' });
}

export function formatDay(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString([], { weekday: 'short' });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function uvLevel(uv: number): {
  label: string;
  color: string;
  pct: number;
} {
  if (uv <= 2) return { label: 'Low', color: '#4ade80', pct: (uv / 11) * 100 };
  if (uv <= 5)
    return { label: 'Moderate', color: '#facc15', pct: (uv / 11) * 100 };
  if (uv <= 7)
    return { label: 'High', color: '#fb923c', pct: (uv / 11) * 100 };
  if (uv <= 10)
    return { label: 'Very High', color: '#f87171', pct: (uv / 11) * 100 };
  return { label: 'Extreme', color: '#c084fc', pct: 100 };
}

export function aqiLevel(aqi: number | null): {
  label: string;
  color: string;
  pct: number;
} {
  if (aqi == null) return { label: 'N/A', color: '#6b7280', pct: 0 };
  if (aqi <= 20) return { label: 'Good', color: '#4ade80', pct: (aqi / 100) * 100 };
  if (aqi <= 40)
    return { label: 'Fair', color: '#a3e635', pct: (aqi / 100) * 100 };
  if (aqi <= 60)
    return { label: 'Moderate', color: '#facc15', pct: (aqi / 100) * 100 };
  if (aqi <= 80)
    return { label: 'Poor', color: '#fb923c', pct: (aqi / 100) * 100 };
  if (aqi <= 100)
    return { label: 'Very Poor', color: '#f87171', pct: (aqi / 100) * 100 };
  return { label: 'Extremely Poor', color: '#c084fc', pct: 100 };
}

export function pressureLevel(hpa: number): string {
  if (hpa < 1000) return 'Low';
  if (hpa < 1020) return 'Normal';
  return 'High';
}

export function visibilityLabel(m: number): string {
  if (m >= 20000) return 'Excellent';
  if (m >= 10000) return 'Good';
  if (m >= 4000) return 'Moderate';
  if (m >= 1000) return 'Poor';
  return 'Very Poor';
}

export function formatVisibility(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(0)} km`;
  return `${m} m`;
}

export function getDayProgress(sunrise: string, sunset: string): number {
  const now = Date.now();
  const sr = new Date(sunrise).getTime();
  const ss = new Date(sunset).getTime();
  if (now <= sr) return 0;
  if (now >= ss) return 1;
  return (now - sr) / (ss - sr);
}
