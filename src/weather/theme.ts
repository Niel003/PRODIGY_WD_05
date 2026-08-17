import type { WeatherCategory } from './types';

export interface ThemePalette {
  bgFrom: string;
  bgTo: string;
  accent: string;
  accentSoft: string;
  glow: string;
  text: string;
  textMuted: string;
  particleColor: string;
}

export const THEMES: Record<WeatherCategory, ThemePalette> = {
  clear: {
    bgFrom: '#0a1230',
    bgTo: '#1a2a5c',
    accent: '#ffb547',
    accentSoft: 'rgba(255, 181, 71, 0.18)',
    glow: 'rgba(255, 200, 120, 0.5)',
    text: '#f5f0e6',
    textMuted: 'rgba(245, 240, 230, 0.6)',
    particleColor: '#ffd98a',
  },
  cloudy: {
    bgFrom: '#0d1320',
    bgTo: '#243049',
    accent: '#8fb4d8',
    accentSoft: 'rgba(143, 180, 216, 0.18)',
    glow: 'rgba(180, 200, 230, 0.4)',
    text: '#eaeef5',
    textMuted: 'rgba(234, 238, 245, 0.6)',
    particleColor: '#c4d4e8',
  },
  fog: {
    bgFrom: '#131820',
    bgTo: '#2e3a48',
    accent: '#a8b8c8',
    accentSoft: 'rgba(168, 184, 200, 0.18)',
    glow: 'rgba(200, 210, 220, 0.35)',
    text: '#e8edf2',
    textMuted: 'rgba(232, 237, 242, 0.6)',
    particleColor: '#c8d2dc',
  },
  drizzle: {
    bgFrom: '#0a1422',
    bgTo: '#1e3a52',
    accent: '#5fb8d4',
    accentSoft: 'rgba(95, 184, 212, 0.18)',
    glow: 'rgba(120, 200, 220, 0.4)',
    text: '#e6f0f5',
    textMuted: 'rgba(230, 240, 245, 0.6)',
    particleColor: '#7fc8e0',
  },
  rain: {
    bgFrom: '#06101e',
    bgTo: '#16304a',
    accent: '#4aa8d8',
    accentSoft: 'rgba(74, 168, 216, 0.18)',
    glow: 'rgba(90, 180, 220, 0.4)',
    text: '#e0ecf5',
    textMuted: 'rgba(224, 236, 245, 0.6)',
    particleColor: '#6fc4e8',
  },
  snow: {
    bgFrom: '#0e1530',
    bgTo: '#2a3858',
    accent: '#d4e4f5',
    accentSoft: 'rgba(212, 228, 245, 0.2)',
    glow: 'rgba(220, 235, 255, 0.5)',
    text: '#f0f4ff',
    textMuted: 'rgba(240, 244, 255, 0.6)',
    particleColor: '#ffffff',
  },
  thunderstorm: {
    bgFrom: '#05060f',
    bgTo: '#1a2040',
    accent: '#6b8cff',
    accentSoft: 'rgba(107, 140, 255, 0.2)',
    glow: 'rgba(120, 150, 255, 0.5)',
    text: '#e8eaf6',
    textMuted: 'rgba(232, 234, 246, 0.6)',
    particleColor: '#9ab0ff',
  },
};

export const NIGHT_THEME: ThemePalette = {
  bgFrom: '#04050f',
  bgTo: '#0a1230',
  accent: '#7b8cff',
  accentSoft: 'rgba(123, 140, 255, 0.18)',
  glow: 'rgba(140, 160, 255, 0.45)',
  text: '#e8eaf6',
  textMuted: 'rgba(232, 234, 246, 0.6)',
  particleColor: '#ffffff',
};

export function getTheme(
  category: WeatherCategory,
  isDay: boolean
): ThemePalette {
  if (!isDay && (category === 'clear' || category === 'cloudy')) {
    return NIGHT_THEME;
  }
  return THEMES[category];
}
