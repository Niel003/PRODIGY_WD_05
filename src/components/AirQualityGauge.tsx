import { GlassCard } from './GlassCard';
import { aqiCategory } from '@/lib/utils';
import { Wind } from 'lucide-react';
import type { AirQuality } from '@/lib/types';

interface AirQualityGaugeProps {
  airQuality: AirQuality;
}

export function AirQualityGauge({ airQuality }: AirQualityGaugeProps) {
  const aqi = airQuality.usAqi || airQuality.europeanAqi || 0;
  const cat = aqiCategory(aqi);

  const pollutants = [
    { label: 'PM2.5', value: airQuality.pm2_5, unit: 'µg/m³' },
    { label: 'PM10', value: airQuality.pm10, unit: 'µg/m³' },
    { label: 'O₃', value: airQuality.ozone, unit: 'µg/m³' },
    { label: 'NO₂', value: airQuality.nitrogenDioxide, unit: 'µg/m³' },
  ];

  return (
    <GlassCard title="Air Quality" icon={Wind} className="p-5 h-full flex flex-col justify-between">
      <div className="flex flex-col items-center justify-between flex-1 gap-4 py-2">
        {/* Prominent AQI Gauge Ring - Padding added so drop-shadow glow doesn't clip */}
        <div className="relative w-36 h-36 flex items-center justify-center my-auto p-2">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90 overflow-visible">
            <circle 
              cx="60" 
              cy="60" 
              r="48" 
              fill="none" 
              stroke="rgba(34, 211, 238, 0.1)" 
              strokeWidth="6" 
            />
            <circle
              cx="60"
              cy="60"
              r="48"
              fill="none"
              stroke={cat.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${(cat.percent / 100) * 301.59} 301.59`}
              style={{ filter: `drop-shadow(0 0 10px ${cat.color})`, transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>

          {/* Centered AQI Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-3xl font-light text-cyan-100 tracking-tight">{Math.round(aqi)}</span>
            <span className="text-xs uppercase tracking-widest text-cyan-300/50 font-medium">AQI</span>
          </div>
        </div>

        {/* Status Badge + Pollutant Grid - Bottom Section */}
        <div className="w-full space-y-3 mt-auto pt-2">
          {/* Centered Status Badge */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ background: cat.color, boxShadow: `0 0 10px ${cat.color}` }} />
            <span className="text-base font-semibold tracking-wide" style={{ color: cat.color }}>{cat.label}</span>
          </div>

          {/* 2x2 Grid for Pollutants */}
          <div className="grid grid-cols-2 gap-2 w-full">
            {pollutants.map((p) => (
              <div key={p.label} className="flex items-center justify-between rounded-lg bg-slate-800/50 border border-cyan-500/10 px-3 py-2">
                <span className="text-xs font-medium text-cyan-300/60">{p.label}</span>
                <span className="text-xs font-semibold text-cyan-100">{Math.round(p.value)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}