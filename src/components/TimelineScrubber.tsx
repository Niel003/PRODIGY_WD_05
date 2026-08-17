import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatHour, formatTempUnit } from '@/lib/utils';
import { getWeatherInfo } from '@/lib/weatherCodes';
import type { HourlyPoint } from '@/lib/types';

interface TimelineScrubberProps {
  hourly: HourlyPoint[];
  selectedHour: number;
  onHourChange: (hour: number) => void;
  unit: 'C' | 'F';
}

export function TimelineScrubber({ hourly, selectedHour, onHourChange, unit }: TimelineScrubberProps) {
  if (hourly.length === 0) return null;

  const temps = hourly.map((h) => h.temperature);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const range = maxTemp - minTemp || 1;

  return (
    <div className="rounded-2xl border border-cyan-400/20 bg-slate-900/40 backdrop-blur-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-cyan-400/60" />
        <span className="text-xs font-medium uppercase tracking-wider text-cyan-300/60">24-Hour Timeline · Time Travel</span>
      </div>

      {/* Slider */}
      <div className="relative mb-3">
        <input
          type="range"
          min={0}
          max={hourly.length - 1}
          value={selectedHour}
          onChange={(e) => onHourChange(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer
            bg-gradient-to-r from-cyan-500/30 via-amber-500/30 to-cyan-500/30
            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-cyan-400
            [&::-webkit-slider-thumb]:shadow-[0_0_12px_rgba(34,211,238,0.6)]
            [&::-webkit-slider-thumb]:cursor-pointer
            [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-cyan-400 [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:cursor-pointer"
        />
      </div>

      {/* Hourly strip */}
      <div className="flex items-end justify-between gap-1 overflow-x-auto scrollbar-hide">
        {hourly.map((h, i) => {
          const info = getWeatherInfo(h.weatherCode);
          const heightPercent = ((h.temperature - minTemp) / range) * 100;
          const isSelected = i === selectedHour;

          return (
            <button
              key={i}
              onClick={() => onHourChange(i)}
              className="flex flex-col items-center gap-1 shrink-0 group"
              style={{ minWidth: '32px' }}
            >
              <span className={`text-[10px] ${isSelected ? 'text-cyan-300 font-medium' : 'text-cyan-300/40'}`}>
                {formatTempUnit(h.temperature, unit).replace(`°${unit}`, '°')}
              </span>
              <div className="relative w-1.5 rounded-full bg-slate-700/40 overflow-hidden" style={{ height: '40px' }}>
                <motion.div
                  className="absolute bottom-0 w-full rounded-full"
                  style={{
                    background: isSelected
                      ? 'linear-gradient(to top, #22d3ee, #fbbf24)'
                      : `linear-gradient(to top, rgba(34, 211, 238, 0.3), rgba(251, 191, 36, 0.3))`,
                  }}
                  initial={{ height: 0 }}
                  animate={{ height: `${heightPercent}%` }}
                  transition={{ duration: 0.4, delay: i * 0.02 }}
                />
              </div>
              <span className={`text-[9px] ${isSelected ? 'text-cyan-200' : 'text-cyan-300/40'}`}>
                {formatHour(h.hour)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected hour detail */}
      <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-800/30 border border-cyan-400/10 px-3 py-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-cyan-100 font-medium">{formatHour(hourly[selectedHour].hour)}</span>
          <span className="text-xs text-cyan-300/50">{getWeatherInfo(hourly[selectedHour].weatherCode).label}</span>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <span className="text-cyan-300/60">{Math.round(hourly[selectedHour].precipitationProbability)}% rain</span>
          <span className="text-cyan-100">{formatTempUnit(hourly[selectedHour].temperature, unit)}</span>
        </div>
      </div>
    </div>
  );
}
