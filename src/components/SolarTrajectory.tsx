import { GlassCard } from './GlassCard';
import { Sunrise, Sunset, Clock, Sun } from 'lucide-react';
import { sunPosition, formatHour } from '@/lib/utils';
import type { CurrentWeather } from '@/lib/types';

interface SolarTrajectoryProps {
  current: CurrentWeather;
}

export function SolarTrajectory({ current }: SolarTrajectoryProps) {
  const { progress, isDay } = sunPosition(current.sunrise, current.sunset);
  const srHour = new Date(current.sunrise).getHours();
  const ssHour = new Date(current.sunset).getHours();

  // Calculate daylight duration & solar noon
  const sunriseTime = new Date(current.sunrise).getTime();
  const sunsetTime = new Date(current.sunset).getTime();
  const diffMs = sunsetTime - sunriseTime;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.round((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  const noonHour = new Date((sunriseTime + sunsetTime) / 2).getHours();

  // SVG arc parameters (Expanded scale to fill top area)
  const width = 280;
  const height = 110;
  const arcRadius = 110;
  const cx = width / 2;
  const cy = height + 5;
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const angle = Math.PI * (1 - clampedProgress);
  const sunX = cx + Math.cos(angle) * arcRadius;
  const sunY = cy - Math.sin(angle) * arcRadius;

  return (
    <GlassCard title="Solar Arc" icon={Sunrise} className="p-4 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center justify-between flex-1 gap-2 pt-1">
        {/* Arc SVG */}
        <div className="relative w-full flex justify-center my-auto">
          <svg viewBox={`0 0 ${width} ${height + 15}`} className="w-full h-auto max-w-[280px] overflow-visible">
            <defs>
              <linearGradient id="sunGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="#fbbf24" />
                <stop offset="100%" stopColor="#fde68a" />
              </linearGradient>
              <linearGradient id="sunFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </linearGradient>
              <radialGradient id="sunGlow">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Filled area under arc */}
            <path
              d={`M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${cy} Z`}
              fill="url(#sunFill)"
            />

            {/* Arc track */}
            <path
              d={`M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 1 ${cx + arcRadius} ${cy}`}
              fill="none"
              stroke="rgba(34, 211, 238, 0.15)"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Progress arc */}
            {isDay && (
              <path
                d={`M ${cx - arcRadius} ${cy} A ${arcRadius} ${arcRadius} 0 0 1 ${sunX} ${sunY}`}
                fill="none"
                stroke="url(#sunGrad)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            )}

            {/* Horizon line */}
            <line x1="10" y1={cy} x2={width - 10} y2={cy} stroke="rgba(34, 211, 238, 0.2)" strokeWidth="1" />

            {/* Sun position indicator */}
            {isDay && (
              <>
                <circle cx={sunX} cy={sunY} r="14" fill="url(#sunGlow)" opacity="0.6" />
                <circle cx={sunX} cy={sunY} r="6" fill="#fbbf24" />
                <circle cx={sunX} cy={sunY} r="3" fill="#fef3c7" />
              </>
            )}

            {/* Sunrise/sunset markers */}
            <circle cx={cx - arcRadius} cy={cy} r="3.5" fill="#f59e0b" opacity="0.7" />
            <circle cx={cx + arcRadius} cy={cy} r="3.5" fill="#f59e0b" opacity="0.7" />
          </svg>
        </div>

        {/* Sunrise / Sunset Row */}
        <div className="flex items-center justify-between w-full px-1">
          <div className="flex items-center gap-1.5">
            <Sunrise className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-medium text-cyan-100">{formatHour(srHour)}</span>
          </div>

          <span className="text-[11px] font-medium text-cyan-300/60 bg-slate-800/40 px-2 py-0.5 rounded-full border border-cyan-500/10">
            {isDay ? `${Math.round(progress * 100)}% of day` : 'Night'}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-medium text-cyan-100">{formatHour(ssHour)}</span>
            <Sunset className="w-3.5 h-3.5 text-amber-500" />
          </div>
        </div>

        {/* Fills bottom space with relevant metrics */}
        <div className="grid grid-cols-2 gap-2 w-full pt-2 border-t border-cyan-500/10 mt-auto">
          <div className="flex items-center gap-2 rounded-lg bg-slate-800/40 border border-cyan-500/10 px-2.5 py-1.5">
            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-cyan-300/50">Daylight</span>
              <span className="text-xs font-medium text-cyan-100">{hours}h {minutes}m</span>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-slate-800/40 border border-cyan-500/10 px-2.5 py-1.5">
            <Sun className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase tracking-wider text-cyan-300/50">Solar Noon</span>
              <span className="text-xs font-medium text-cyan-100">{formatHour(noonHour)}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}