import { useCallback, useEffect, useState } from 'react';
import { fetchWeather } from './api';
import type { WeatherData } from './types';

export interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useWeather(lat: number | null, lon: number | null): WeatherState {
  const [data, setData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  useEffect(() => {
    if (lat === null || lon === null) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetchWeather(lat, lon)
      .then((d) => {
        if (!cancelled) {
          setData(d);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : 'Failed to load weather');
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [lat, lon, nonce]);

  return { data, loading, error, reload };
}
