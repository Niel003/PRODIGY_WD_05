import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { WeatherCategory } from '@/weather/types';
import { getTheme, type ThemePalette } from '@/weather/theme';

interface ThemeContextValue {
  category: WeatherCategory;
  isDay: boolean;
  palette: ThemePalette;
  setTheme: (category: WeatherCategory, isDay: boolean) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [category, setCategory] = useState<WeatherCategory>('clear');
  const [isDay, setIsDay] = useState(true);

  const palette = useMemo(() => getTheme(category, isDay), [category, isDay]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--bg-from', palette.bgFrom);
    root.style.setProperty('--bg-to', palette.bgTo);
    root.style.setProperty('--accent', palette.accent);
    root.style.setProperty('--accent-soft', palette.accentSoft);
    root.style.setProperty('--glow', palette.glow);
    root.style.setProperty('--particle', palette.particleColor);
  }, [palette]);

  const value = useMemo(
    () => ({ category, isDay, palette, setTheme: (c: WeatherCategory, d: boolean) => {
      setCategory(c);
      setIsDay(d);
    } }),
    [category, isDay, palette]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
