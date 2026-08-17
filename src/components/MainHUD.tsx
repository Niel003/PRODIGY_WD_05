import { motion } from 'framer-motion';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudRainWind, CloudSnow, CloudSun, Sun, Thermometer } from 'lucide-react';
import { getWeatherInfo } from '@/lib/weatherCodes';
import { formatTempUnit } from '@/lib/utils';
import type { CurrentWeather } from '@/lib/types';

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

interface MainHUDProps {
  current: CurrentWeather;
  cityName: string;
  unit: 'C' | 'F';
  onToggleUnit: () => void;
}

export function MainHUD({ current, cityName, unit, onToggleUnit }: MainHUDProps) {
  const info = getWeatherInfo(current.weatherCode);
  const Icon = ICON_MAP[info.icon] ?? Cloud;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center justify-center text-center w-full min-h-[70vh] px-4 pointer-events-none"
      style={{ transform: 'translateZ(60px)' }}
    >
      <div className="pointer-events-auto flex flex-col items-center">
        {/* City name */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-base md:text-lg font-medium uppercase tracking-[0.4em] text-cyan-200/70 drop-shadow-[0_2px_10px_rgba(6,182,212,0.3)]">
            {cityName}
          </span>
        </div>

        {/* Condition badge */}
        <div className="inline-flex items-center gap-2.5 rounded-full border border-cyan-400/30 bg-slate-900/60 backdrop-blur-xl px-5 py-2 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
          <Icon className={`w-5 h-5 ${current.isDay ? 'text-amber-300' : 'text-cyan-300'}`} />
          <span className="text-base font-medium text-cyan-100 tracking-wide">{info.label}</span>
        </div>

        {/* Temperature */}
        <div className="flex items-start justify-center gap-1 mb-3">
          <motion.span
            key={Math.round(current.temperature)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="text-9xl md:text-[11rem] font-extralight leading-none text-transparent bg-clip-text
              bg-gradient-to-b from-white via-cyan-50 to-cyan-400/70 drop-shadow-[0_10px_35px_rgba(0,240,255,0.25)] select-none"
            style={{ fontFeatureSettings: '"tnum"' }}
          >
            {formatTempUnit(current.temperature, unit).replace(`°${unit}`, '')}
          </motion.span>
          <button
            onClick={onToggleUnit}
            className="mt-4 md:mt-6 rounded-xl border border-cyan-400/30 bg-slate-900/60 backdrop-blur-xl px-3 py-1.5
              text-base font-semibold text-cyan-300 hover:border-cyan-400/60 hover:bg-cyan-500/20 hover:scale-105 transition-all shadow-lg"
          >
            °{unit}
          </button>
        </div>

        {/* Feels like + high/low */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-base font-medium text-cyan-100/80 rounded-2xl border border-cyan-500/10 bg-slate-950/40 backdrop-blur-md px-6 py-2.5">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-cyan-400" />
            <span>Feels {formatTempUnit(current.apparentTemperature, unit)}</span>
          </div>
          <div className="h-4 w-[1px] bg-cyan-400/20 hidden sm:block" />
          <div className="flex items-center gap-4">
            <span className="text-amber-300/90">H: {formatTempUnit(current.tempMax, unit)}</span>
            <span className="text-cyan-300/90">L: {formatTempUnit(current.tempMin, unit)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}