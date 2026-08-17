import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WeatherCanvas } from '@/three/WeatherCanvas';
import { SearchHeader } from '@/components/SearchHeader';
import { MainHUD } from '@/components/MainHUD';
import { WindCompass } from '@/components/WindCompass';
import { SolarTrajectory } from '@/components/SolarTrajectory';
import { AirQualityGauge } from '@/components/AirQualityGauge';
import { MetricsPanel } from '@/components/MetricsPanel';
import { TimelineScrubber } from '@/components/TimelineScrubber';
import { HourlyChart } from '@/components/HourlyChart';
import { DailyForecast } from '@/components/DailyForecast';
import { GlassCard, SkeletonCard } from '@/components/GlassCard';
import { useWeather } from '@/lib/useWeather';
import { getScene, getWeatherInfo } from '@/lib/weatherCodes';
import { formatTempUnit } from '@/lib/utils';
import type { GeoResult, SavedCity } from '@/lib/types';

const DEFAULT_CITY: GeoResult = {
  id: 1275004,
  name: 'Kolkata',
  country: 'India',
  admin1: 'West Bengal',
  latitude: 22.5726,
  longitude: 88.3639,
};

const FAV_KEY = 'aetherweather_favorites';
const UNIT_KEY = 'aetherweather_unit';

export default function App() {
  const [city, setCity] = useState<GeoResult>(DEFAULT_CITY);
  const [unit, setUnit] = useState<'C' | 'F'>(() => {
    return (localStorage.getItem(UNIT_KEY) as 'C' | 'F') || 'C';
  });
  const [selectedHour, setSelectedHour] = useState(0);
  const [favorites, setFavorites] = useState<SavedCity[]>(() => {
    try {
      const stored = localStorage.getItem(FAV_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const { data, loading, error, reload } = useWeather(city.latitude, city.longitude);

  useEffect(() => {
    localStorage.setItem(UNIT_KEY, unit);
  }, [unit]);

  useEffect(() => {
    localStorage.setItem(FAV_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const handleSelectCity = (r: GeoResult) => {
    setCity(r);
    setSelectedHour(0);
  };

  const handleAddFavorite = (c: SavedCity) => {
    setFavorites((prev) => {
      if (prev.some((f) => f.name === c.name)) return prev;
      return [...prev, { ...c, latitude: city.latitude, longitude: city.longitude, name: city.name, country: city.country, admin1: city.admin1, id: city.id }];
    });
  };

  const handleRemoveFavorite = (id: number) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  // Determine scene + display values (current or scrubbed hour)
  const displayData = useMemo(() => {
    if (!data) return null;
    const hourData = data.hourly[selectedHour] ?? data.hourly[0];
    const isScrubbed = selectedHour !== 0;
    const baseTemp = isScrubbed ? hourData.temperature : data.current.temperature;
    const isDay = isScrubbed ? hourData.isDay : data.current.isDay;
    const code = isScrubbed ? hourData.weatherCode : data.current.weatherCode;
    const scene = getScene(code, isDay);
    return {
      scene,
      temperature: baseTemp,
      isDay,
      code,
      hourData,
      isScrubbed,
    };
  }, [data, selectedHour]);

  const dayFactor = displayData?.isDay ? 1 : 0.2;
  const cloudCover = data ? data.current.cloudCover / 100 : 0.5;

  return (
    <div className="relative min-h-screen overflow-hidden text-cyan-50">
      {/* 3D Canvas Background */}
      <div className="fixed inset-0 z-0">
        {displayData && (
          <WeatherCanvas
            type={displayData.scene}
            dayFactor={dayFactor}
            intensity={displayData.code >= 82 ? 1.5 : 1}
            cloudCover={cloudCover}
            temperature={displayData.temperature}
          />
        )}
      </div>

      {/* Vignette overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-gradient-to-b from-transparent via-transparent to-black/40" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header - Brand Title Only */}
        <header className="px-4 md:px-8 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="relative">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(34,211,238,0.3)]" />
              <div className="absolute inset-0 w-8 h-8 rounded-lg bg-cyan-400/20 blur-md animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-light tracking-wider text-cyan-100">Vapor<span className="font-medium">Deck</span></h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-cyan-400/40">Spatial Weather Intelligence</p>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 pb-6">
          {error && (
            <div className="flex items-center justify-center py-20">
              <div className="rounded-xl border border-red-400/30 bg-red-900/20 backdrop-blur-xl px-6 py-4 text-center">
                <p className="text-red-300 text-sm mb-2">Unable to load weather data</p>
                <button onClick={reload} className="text-xs text-red-200 underline">Retry</button>
              </div>
            </div>
          )}

          {loading && !data && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <SkeletonCard className="h-48 md:col-span-1" />
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-48" />
              <SkeletonCard className="h-40" />
              <SkeletonCard className="h-40" />
              <SkeletonCard className="h-40" />
            </div>
          )}

          {data && displayData && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 items-start">
              {/* Left Column - Search Bar aligned directly to the top edge of right widgets */}
              <div className="lg:col-span-6 flex flex-col items-center justify-start gap-6">
                <SearchHeader
                  onSelectCity={handleSelectCity}
                  onUseLocation={() => {}}
                  favorites={favorites}
                  onAddFavorite={handleAddFavorite}
                  onRemoveFavorite={handleRemoveFavorite}
                  currentCity={city.name}
                />

                <MainHUD
                  current={{
                    ...data.current,
                    temperature: displayData.temperature,
                    weatherCode: displayData.code,
                    isDay: displayData.isDay,
                  }}
                  cityName={`${city.name}${city.country ? ', ' + city.country : ''}`}
                  unit={unit}
                  onToggleUnit={() => setUnit(unit === 'C' ? 'F' : 'C')}
                />

                {displayData.isScrubbed && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs text-amber-300/60 uppercase tracking-wider"
                  >
                    Time Travel Mode · {getWeatherInfo(displayData.code).label}
                  </motion.div>
                )}
              </div>

              {/* Right column - Widgets */}
              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <WindCompass direction={data.current.windDirection} speed={data.current.windSpeed} />
                <SolarTrajectory current={data.current} />
                {data.airQuality && <AirQualityGauge airQuality={data.airQuality} />}
                <MetricsPanel current={data.current} unit={unit} />
              </div>

              {/* Timeline */}
              <div className="lg:col-span-12 mt-2">
                <TimelineScrubber
                  hourly={data.hourly}
                  selectedHour={selectedHour}
                  onHourChange={setSelectedHour}
                  unit={unit}
                />
              </div>

              {/* Charts + Forecast */}
              <div className="lg:col-span-7">
                <HourlyChart hourly={data.hourly} unit={unit} />
              </div>
              <div className="lg:col-span-5">
                <DailyForecast daily={data.daily} unit={unit} />
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="px-4 md:px-8 py-4 text-center">
          <p className="text-[10px] text-cyan-400/30 uppercase tracking-[0.2em]">
            Powered by Open-Meteo · Real-time Spatial Weather
          </p>
        </footer>
      </div>
    </div>
  );
}