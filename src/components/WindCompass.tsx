import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { windDirLabel } from '@/lib/utils';
import { Wind } from 'lucide-react';

interface WindCompassProps {
  direction: number;
  speed: number;
}

export function WindCompass({ direction, speed }: WindCompassProps) {
  const dir = windDirLabel(direction);

  return (
    <GlassCard title="Wind" icon={Wind} className="p-4">
      <div className="flex items-center justify-center py-4">
        <div className="relative w-32 h-32">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
          <div className="absolute inset-2 rounded-full border border-cyan-400/10" />

          {/* Cardinal labels */}
          {['N', 'E', 'S', 'W'].map((label, i) => (
            <span
              key={label}
              className="absolute text-[10px] font-medium text-cyan-300/50"
              style={{
                top: i === 0 ? '2px' : i === 2 ? 'auto' : '50%',
                bottom: i === 2 ? '2px' : 'auto',
                left: i === 3 ? '2px' : i === 1 ? 'auto' : '50%',
                right: i === 1 ? '2px' : 'auto',
                transform: i === 0 || i === 2 ? 'translateX(-50%)' : 'translateY(-50%)',
              }}
            >
              {label}
            </span>
          ))}

          {/* Rotating needle */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ rotate: direction }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          >
            <div className="relative w-1 h-24">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0 h-0
                border-l-[5px] border-r-[5px] border-b-[12px] border-l-transparent border-r-transparent border-b-cyan-400" />
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-0.5 h-20 bg-gradient-to-b from-cyan-400 to-cyan-400/20 rounded-full" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0
                border-l-[4px] border-r-[4px] border-t-[8px] border-l-transparent border-r-transparent border-t-slate-600" />
            </div>
          </motion.div>

          {/* Center dot */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
        </div>
      </div>

      <div className="text-center">
        <div className="text-2xl font-light text-cyan-100">{Math.round(speed)} <span className="text-sm text-cyan-300/50">km/h</span></div>
        <div className="text-sm text-cyan-300/60 mt-0.5">{dir} · {Math.round(direction)}°</div>
      </div>
    </GlassCard>
  );
}
