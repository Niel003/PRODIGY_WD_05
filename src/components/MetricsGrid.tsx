import { motion } from 'framer-motion';
import {
  Wind,
  Gauge,
  Eye,
  Droplets,
  Thermometer,
  Activity,
} from 'lucide-react';
import type { AirQuality, CurrentWeather } from '@/weather/types';
import {
  aqiLevel,
  compassDirection,
  formatVisibility,
  formatTempUnit,
  pressureLevel,
  uvLevel,
  visibilityLabel,
} from '@/weather/utils';

interface Props {
  current: CurrentWeather;
  airQuality: AirQuality | null;
  unit: 'C' | 'F';
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4 },
  }),
};

export default function MetricsGrid({ current, airQuality, unit }: Props) {
  const uv = uvLevel(current.uvIndex);
  const aqi = aqiLevel(airQuality?.europeanAqi ?? null);

  const metrics = [
    {
      key: 'wind',
      icon: <Wind className="w-4 h-4" />,
      label: 'Wind',
      custom: <WindCompass speed={current.windSpeed} dir={current.windDirection} />,
    },
    {
      key: 'aqi',
      icon: <Activity className="w-4 h-4" />,
      label: 'Air Quality',
      custom: (
        <GaugeBar
          value={airQuality?.europeanAqi ?? null}
          label={aqi.label}
          color={aqi.color}
          pct={aqi.pct}
          sub={airQuality?.pm2_5 ? `PM2.5 ${airQuality.pm2_5.toFixed(0)} µg/m³` : ''}
        />
      ),
    },
    {
      key: 'uv',
      icon: <Thermometer className="w-4 h-4" />,
      label: 'UV Index',
      custom: (
        <GaugeBar
          value={current.uvIndex}
          label={uv.label}
          color={uv.color}
          pct={uv.pct}
          sub={`Index ${Math.round(current.uvIndex)}`}
        />
      ),
    },
    {
      key: 'humidity',
      icon: <Droplets className="w-4 h-4" />,
      label: 'Humidity',
      value: `${current.humidity}%`,
      barPct: current.humidity,
      barColor: '#5fb8d4',
    },
    {
      key: 'pressure',
      icon: <Gauge className="w-4 h-4" />,
      label: 'Pressure',
      value: `${Math.round(current.pressure)} hPa`,
      sub: pressureLevel(current.pressure),
    },
    {
      key: 'visibility',
      icon: <Eye className="w-4 h-4" />,
      label: 'Visibility',
      value: formatVisibility(current.visibility),
      sub: visibilityLabel(current.visibility),
    },
    {
      key: 'dewpoint',
      icon: <Thermometer className="w-4 h-4" />,
      label: 'Dew Point',
      value: formatTempUnit(current.dewPoint, unit),
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
      {metrics.map((m, i) => (
        <motion.div
          key={m.key}
          custom={i}
          variants={cardVariants}
          initial="hidden"
          animate="show"
          className="glass rounded-2xl p-4 flex flex-col gap-3 min-h-[140px]"
        >
          <div className="flex items-center gap-2 text-white/60">
            {m.icon}
            <span className="text-xs font-medium uppercase tracking-wide">
              {m.label}
            </span>
          </div>
          {m.custom ? (
            m.custom
          ) : (
            <div className="flex-1 flex flex-col justify-end">
              <p className="text-2xl font-display font-semibold text-white">
                {m.value}
              </p>
              {m.sub && (
                <p className="text-xs text-white/50 mt-0.5">{m.sub}</p>
              )}
              {m.barPct != null && (
                <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.barPct}%`,
                      background: m.barColor,
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}

function WindCompass({ speed, dir }: { speed: number; dir: number }) {
  return (
    <div className="flex items-center gap-3 flex-1">
      <div className="relative w-16 h-16 shrink-0">
        <div className="absolute inset-0 rounded-full border border-white/15" />
        <div className="absolute inset-0 flex items-center justify-center text-[9px] text-white/40 font-medium">
          <span className="absolute top-0.5">N</span>
          <span className="absolute bottom-0.5">S</span>
          <span className="absolute left-0.5">W</span>
          <span className="absolute right-0.5">E</span>
        </div>
        <motion.div
          animate={{ rotate: dir }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div
            className="w-0.5 h-7 rounded-full"
            style={{
              background: 'var(--accent)',
              transform: 'translateY(-25%)',
              boxShadow: '0 0 8px var(--glow)',
            }}
          />
        </motion.div>
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'var(--accent)',
          }}
        />
      </div>
      <div>
        <p className="text-xl font-display font-semibold text-white">
          {Math.round(speed)}
          <span className="text-xs text-white/50 ml-1">km/h</span>
        </p>
        <p className="text-xs text-white/60">
          {compassDirection(dir)}
        </p>
      </div>
    </div>
  );
}

function GaugeBar({
  value,
  label,
  color,
  pct,
  sub,
}: {
  value: number | null;
  label: string;
  color: string;
  pct: number;
  sub?: string;
}) {
  return (
    <div className="flex-1 flex flex-col justify-end gap-2">
      <div className="flex items-baseline justify-between">
        <p className="text-2xl font-display font-semibold text-white">
          {value != null ? Math.round(value) : '—'}
        </p>
        <p className="text-xs font-medium" style={{ color }}>
          {label}
        </p>
      </div>
      <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="h-full rounded-full"
          style={{ background: color }}
        />
      </div>
      {sub && <p className="text-[10px] text-white/40">{sub}</p>}
    </div>
  );
}
