import { motion } from 'framer-motion';
import { Star, Sunrise, Sunset, Droplets, Eye } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { getWeatherInfo, getWeatherLabel } from '@/weather/codes';
import { formatTemp, formatTempUnit } from '@/weather/utils';
import type { CurrentWeather, DailyForecast, GeoLocation } from '@/weather/types';

interface Props {
  current: CurrentWeather;
  daily: DailyForecast;
  location: GeoLocation;
  unit: 'C' | 'F';
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export default function CurrentConditions({
  current,
  daily,
  location,
  unit,
  isFavorite,
  onToggleFavorite,
}: Props) {
  const info = getWeatherInfo(current.weatherCode);
  const todayMax = daily.tempMax[0];
  const todayMin = daily.tempMin[0];
  const accent = 'var(--accent)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="glass-strong rounded-3xl p-6 md:p-8 relative overflow-hidden"
    >
      {/* glow blob */}
      <div
        className="absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'var(--accent-soft)' }}
      />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Left: location + temp */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-lg md:text-xl font-display font-semibold text-white truncate">
              {location.name}
              {location.admin1 ? `, ${location.admin1}` : ''}
              {location.country ? `, ${location.country}` : ''}
            </h2>
            <button
              onClick={onToggleFavorite}
              title={isFavorite ? 'Remove favorite' : 'Add favorite'}
              className="p-1 rounded-lg hover:bg-white/10 transition shrink-0"
            >
              <Star
                className={`w-4 h-4 transition ${
                  isFavorite
                    ? 'fill-amber-300 text-amber-300'
                    : 'text-white/40 hover:text-white'
                }`}
              />
            </button>
          </div>

          <div className="flex items-end gap-4 mt-2">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <div
                className="shrink-0 rounded-3xl p-3"
                style={{
                  background: 'var(--accent-soft)',
                  boxShadow: `0 0 40px var(--glow)`,
                }}
              >
                <WeatherIcon
                  category={info.category}
                  isDay={current.isDay}
                  className="w-14 h-14 md:w-16 md:h-16"
                />
              </div>
            </motion.div>
            <div>
              <div className="flex items-start">
                <span
                  className="text-6xl md:text-7xl font-display font-bold leading-none"
                  style={{ color: 'var(--accent)' }}
                >
                  {formatTemp(current.temperature, unit).replace('°', '')}
                </span>
                <span className="text-2xl md:text-3xl font-display font-semibold text-white/60 mt-1">
                  °{unit}
                </span>
              </div>
              <p className="text-sm text-white/70 mt-1">
                {getWeatherLabel(current.weatherCode)}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-4 text-xs text-white/60">
            <span className="flex items-center gap-1">
              Feels like{' '}
              <span className="text-white/90 font-medium">
                {formatTempUnit(current.apparentTemperature, unit)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-white/50">H:</span>
              <span className="text-white/90 font-medium">
                {formatTempUnit(todayMax, unit)}
              </span>
            </span>
            <span className="flex items-center gap-1">
              <span className="text-white/50">L:</span>
              <span className="text-white/90 font-medium">
                {formatTempUnit(todayMin, unit)}
              </span>
            </span>
          </div>
        </div>

        {/* Right: quick stats */}
        <div className="grid grid-cols-3 md:grid-cols-1 gap-3 md:gap-2 md:min-w-[180px]">
          <QuickStat
            icon={<Sunrise className="w-4 h-4" />}
            label="Sunrise"
            value={new Date(daily.sunrise[0]).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <QuickStat
            icon={<Sunset className="w-4 h-4" />}
            label="Sunset"
            value={new Date(daily.sunset[0]).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          />
          <QuickStat
            icon={<Droplets className="w-4 h-4" />}
            label="Humidity"
            value={`${current.humidity}%`}
          />
        </div>
      </div>
    </motion.div>
  );
}

function QuickStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-2 glass rounded-xl px-3 py-2">
      <span className="text-white/50">{icon}</span>
      <div className="min-w-0">
        <p className="text-[10px] text-white/50 uppercase tracking-wide">{label}</p>
        <p className="text-xs text-white/90 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}
