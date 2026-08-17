import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { formatDay, formatTempUnit } from '@/lib/utils';
import { getWeatherInfo } from '@/lib/weatherCodes';
import { CalendarDays, Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudRainWind, CloudSnow, CloudSun, Sun } from 'lucide-react';
import type { DailyPoint } from '@/lib/types';

const ICON_MAP: Record<string, typeof Sun> = {
  Sun,
  CloudSun,
  Cloud,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudRainWind,
  CloudSnow,
  CloudLightning,
};

interface DailyForecastProps {
  daily: DailyPoint[];
  unit: 'C' | 'F';
}

export function DailyForecast({ daily, unit }: DailyForecastProps) {
  if (daily.length === 0) return null;

  const allTemps = daily.flatMap((d) => [d.tempMax, d.tempMin]);
  const globalMin = Math.min(...allTemps);
  const globalMax = Math.max(...allTemps);
  const range = globalMax - globalMin || 1;

  return (
    <GlassCard title="7-Day Extended" icon={CalendarDays} className="p-4">
      <div className="flex flex-col gap-1.5">
        {daily.map((d, i) => {
          const info = getWeatherInfo(d.weatherCode);
          const Icon = ICON_MAP[info.icon] ?? Cloud;
          const leftPercent = ((d.tempMin - globalMin) / range) * 100;
          const widthPercent = ((d.tempMax - d.tempMin) / range) * 100;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="flex items-center gap-3 rounded-xl bg-slate-800/20 hover:bg-slate-800/40 transition-colors px-3 py-2.5"
            >
              <span className="text-sm text-cyan-100 font-medium w-10">{i === 0 ? 'Today' : formatDay(d.date)}</span>

              <Icon className="w-4 h-4 text-cyan-300/70 shrink-0" />

              <span className="text-xs text-cyan-300/50 truncate flex-1 hidden sm:block">{info.label}</span>

              <span className="text-xs text-blue-300/60 w-12 text-right">{Math.round(d.precipitationProbability)}%</span>

              {/* Temp range bar */}
              <div className="relative w-24 h-1.5 rounded-full bg-slate-700/40">
                <motion.div
                  className="absolute h-full rounded-full"
                  style={{
                    left: `${leftPercent}%`,
                    background: 'linear-gradient(to right, #22d3ee, #fbbf24)',
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(widthPercent, 8)}%` }}
                  transition={{ delay: i * 0.06 + 0.2, duration: 0.4 }}
                />
              </div>

              <span className="text-xs text-cyan-300/50 w-10 text-right">{formatTempUnit(d.tempMin, unit)}</span>
              <span className="text-xs text-cyan-100 font-medium w-10 text-right">{formatTempUnit(d.tempMax, unit)}</span>
            </motion.div>
          );
        })}
      </div>
    </GlassCard>
  );
}
