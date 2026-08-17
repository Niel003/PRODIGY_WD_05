import { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Bar,
  ComposedChart,
} from 'recharts';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { useRef } from 'react';
import WeatherIcon from './WeatherIcon';
import { getWeatherCategory } from '@/weather/codes';
import { formatHour } from '@/weather/utils';
import type { HourlyForecast } from '@/weather/types';

interface Props {
  hourly: HourlyForecast;
  unit: 'C' | 'F';
}

export default function HourlyForecast({ hourly, unit }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const now = new Date();
    const startIdx = hourly.time.findIndex((t) => new Date(t) >= now);
    const idx = startIdx === -1 ? 0 : Math.max(0, startIdx);
    const slice = [];
    for (let i = idx; i < Math.min(idx + 24, hourly.time.length); i++) {
      slice.push({
        time: hourly.time[i],
        label: formatHour(hourly.time[i]),
        temp: hourly.temperature[i],
        precip: hourly.precipitationProbability[i] ?? 0,
        code: hourly.weatherCode[i],
        isDay: hourly.isDay[i] === 1,
      });
    }
    return slice;
  }, [hourly]);

  const chartData = data.map((d) => ({
    label: d.label,
    temp: d.temp,
    precip: d.precip,
  }));

  function scroll(dir: number) {
    scrollRef.current?.scrollBy({ left: dir * 300, behavior: 'smooth' });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2 text-white/60">
          <Clock className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Next 24 Hours
          </span>
        </div>
        <div className="hidden md:flex gap-1">
          <button
            onClick={() => scroll(-1)}
            className="p-1 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-1 rounded-lg hover:bg-white/10 transition text-white/50 hover:text-white"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Temperature curve */}
      <div className="h-32 -ml-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 5 }}>
            <defs>
              <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,12,26,0.9)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                fontSize: 12,
              }}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              itemStyle={{ color: 'var(--accent)' }}
              formatter={(v: any) => [`${Math.round(Number(v))}°${unit}`, 'Temp']}
            />
            <Area
              type="monotone"
              dataKey="temp"
              stroke="var(--accent)"
              strokeWidth={2}
              fill="url(#tempArea)"
              dot={false}
              activeDot={{ r: 4, fill: 'var(--accent)' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Hourly cards carousel */}
      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mt-1"
      >
        {data.map((d, i) => {
          const cat = getWeatherCategory(d.code);
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-1 min-w-[52px] py-2 px-1 rounded-xl hover:bg-white/5 transition"
            >
              <span className="text-[10px] text-white/50">{d.label}</span>
              <WeatherIcon
                category={cat}
                isDay={d.isDay}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-white">
                {Math.round(d.temp)}°
              </span>
              <span className="text-[9px] text-sky-300/70">{d.precip}%</span>
            </div>
          );
        })}
      </div>

      {/* Precipitation bars */}
      <div className="h-16 -ml-4 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 0, right: 5, bottom: 0, left: 5 }}>
            <XAxis dataKey="label" hide />
            <YAxis hide domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: 'rgba(10,12,26,0.9)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 12,
                fontSize: 12,
              }}
              formatter={(v: any) => [`${v}%`, 'Precip']}
              labelStyle={{ color: 'rgba(255,255,255,0.6)' }}
              itemStyle={{ color: '#5fb8d4' }}
            />
            <CartesianGrid vertical={false} horizontal={false} />
            <Bar
              dataKey="precip"
              fill="#5fb8d4"
              opacity={0.4}
              radius={[3, 3, 0, 0]}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
