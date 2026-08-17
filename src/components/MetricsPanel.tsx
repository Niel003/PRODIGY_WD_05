import { GlassCard } from './GlassCard';
import { formatTempUnit, uvCategory } from '@/lib/utils';
import { Eye, Gauge, Droplets, Sun, Thermometer } from 'lucide-react';
import type { CurrentWeather } from '@/lib/types';

interface MetricsPanelProps {
  current: CurrentWeather;
  unit: 'C' | 'F';
}

interface MetricItemProps {
  icon: typeof Eye;
  label: string;
  value: string;
  subValue?: string;
  barPercent?: number;
  barColor?: string;
}

function MetricItem({ icon: Icon, label, value, subValue, barPercent, barColor }: MetricItemProps) {
  return (
    <div className="rounded-xl bg-slate-800/30 border border-cyan-400/10 p-3">
      <div className="flex items-center gap-2 mb-1.5">
        <Icon className="w-3.5 h-3.5 text-cyan-400/50" />
        <span className="text-[10px] uppercase tracking-wider text-cyan-300/50">{label}</span>
      </div>
      <div className="text-lg font-light text-cyan-100">{value}</div>
      {subValue && <div className="text-[10px] text-cyan-300/40 mt-0.5">{subValue}</div>}
      {barPercent !== undefined && (
        <div className="mt-2 h-1 rounded-full bg-slate-700/40 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${barPercent}%`, background: barColor, boxShadow: `0 0 6px ${barColor}` }}
          />
        </div>
      )}
    </div>
  );
}

export function MetricsPanel({ current, unit }: MetricsPanelProps) {
  const uv = uvCategory(current.uvIndex);
  const humidityPercent = Math.min(current.humidity, 100);
  const visibilityKm = current.visibility / 1000;

  return (
    <GlassCard title="Metrics" icon={Gauge} className="p-4">
      <div className="grid grid-cols-2 gap-2.5">
        <MetricItem
          icon={Droplets}
          label="Humidity"
          value={`${Math.round(current.humidity)}%`}
          barPercent={humidityPercent}
          barColor="#22d3ee"
        />
        <MetricItem
          icon={Sun}
          label="UV Index"
          value={`${Math.round(current.uvIndex)}`}
          subValue={uv.label}
          barPercent={Math.min((current.uvIndex / 11) * 100, 100)}
          barColor={uv.color}
        />
        <MetricItem
          icon={Gauge}
          label="Pressure"
          value={`${Math.round(current.pressure)}`}
          subValue="hPa"
        />
        <MetricItem
          icon={Eye}
          label="Visibility"
          value={`${visibilityKm.toFixed(1)}`}
          subValue="km"
        />
        <MetricItem
          icon={Thermometer}
          label="Dew Point"
          value={formatTempUnit(current.dewPoint, unit)}
        />
        <MetricItem
          icon={Droplets}
          label="Precip."
          value={`${current.precipitation.toFixed(1)}`}
          subValue="mm"
        />
      </div>
    </GlassCard>
  );
}
