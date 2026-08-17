import { motion } from 'framer-motion';
import { Sunrise, Sunset } from 'lucide-react';
import { getDayProgress, formatTime } from '@/weather/utils';
import type { DailyForecast } from '@/weather/types';

interface Props {
  daily: DailyForecast;
}

export default function SolarArc({ daily }: Props) {
  const sunrise = daily.sunrise[0];
  const sunset = daily.sunset[0];
  const progress = getDayProgress(sunrise, sunset);

  const W = 320;
  const H = 140;
  const padding = 20;
  const arcWidth = W - padding * 2;
  const arcHeight = H - padding - 30;

  const startX = padding;
  const endX = W - padding;
  const baseY = H - 30;
  const peakY = baseY - arcHeight;

  const sunX = startX + (endX - startX) * progress;
  const sunY = baseY - Math.sin(progress * Math.PI) * arcHeight;

  const isDayNow = progress > 0 && progress < 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center gap-2 text-white/60 mb-2">
        <Sunrise className="w-4 h-4" />
        <span className="text-xs font-medium uppercase tracking-wide">
          Sun Trajectory
        </span>
      </div>

      <div className="relative w-full" style={{ maxWidth: W }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
          <defs>
            <linearGradient id="arcGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
              <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.7" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id="arcFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Filled area under arc */}
          <path
            d={`M ${startX} ${baseY} Q ${(startX + endX) / 2} ${peakY * 0.4} ${endX} ${baseY} Z`}
            fill="url(#arcFill)"
          />

          {/* Arc path */}
          <path
            d={`M ${startX} ${baseY} Q ${(startX + endX) / 2} ${peakY * 0.4} ${endX} ${baseY}`}
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Horizon line */}
          <line
            x1={startX - 6}
            y1={baseY}
            x2={endX + 6}
            y2={baseY}
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Sunrise & sunset markers */}
          <circle cx={startX} cy={baseY} r="4" fill="var(--accent)" opacity="0.5" />
          <circle cx={endX} cy={baseY} r="4" fill="var(--accent)" opacity="0.5" />

          {/* Sun position */}
          {isDayNow && (
            <>
              <motion.circle
                initial={{ cx: startX, cy: baseY }}
                animate={{ cx: sunX, cy: sunY }}
                transition={{ duration: 1, ease: 'easeOut' }}
                r="10"
                fill="var(--accent)"
                style={{ filter: 'blur(0.5px)' }}
              />
              <motion.circle
                initial={{ cx: startX, cy: baseY }}
                animate={{ cx: sunX, cy: sunY }}
                transition={{ duration: 1, ease: 'easeOut' }}
                r="18"
                fill="var(--accent)"
                opacity="0.2"
              />
            </>
          )}
        </svg>

        {/* Labels */}
        <div className="flex justify-between mt-1 px-1">
          <div className="flex items-center gap-1 text-white/60">
            <Sunrise className="w-3 h-3" />
            <span className="text-xs">{formatTime(sunrise)}</span>
          </div>
          <div className="flex items-center gap-1 text-white/60">
            <span className="text-xs">{formatTime(sunset)}</span>
            <Sunset className="w-3 h-3" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
