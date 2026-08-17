import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { GlassCard } from './GlassCard';
import { formatHour } from '@/lib/utils';
import { BarChart3 } from 'lucide-react';
import type { HourlyPoint } from '@/lib/types';

interface HourlyChartProps {
  hourly: HourlyPoint[];
  unit: 'C' | 'F';
}

export function HourlyChart({ hourly, unit }: HourlyChartProps) {
  const data = hourly.map((h) => ({
    hour: formatHour(h.hour),
    temp: Math.round(h.temperature),
    precip: h.precipitationProbability,
  }));

  return (
    <GlassCard title="24-Hour Forecast" icon={BarChart3} className="p-4">
      <div className="flex flex-col gap-2">
        {/* Temperature */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <defs>
                <linearGradient id="tempArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(34, 211, 238, 0.4)' }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(34, 211, 238, 0.4)' }} axisLine={false} tickLine={false} width={30} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#cffafe',
                }}
                labelStyle={{ color: 'rgba(34, 211, 238, 0.6)' }}
              />
              <Area
                type="monotone"
                dataKey="temp"
                stroke="#22d3ee"
                strokeWidth={2}
                fill="url(#tempArea)"
                dot={false}
                name={`Temp (°${unit})`}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Precipitation */}
        <div className="h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: -25 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(34, 211, 238, 0.05)" />
              <XAxis dataKey="hour" tick={{ fontSize: 9, fill: 'rgba(34, 211, 238, 0.4)' }} interval={3} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: 'rgba(34, 211, 238, 0.4)' }} axisLine={false} tickLine={false} width={30} domain={[0, 100]} />
              <Tooltip
                contentStyle={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(34, 211, 238, 0.2)',
                  borderRadius: '8px',
                  fontSize: '12px',
                  color: '#cffafe',
                }}
              />
              <Line
                type="monotone"
                dataKey="precip"
                stroke="#60a5fa"
                strokeWidth={1.5}
                dot={false}
                name="Rain %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </GlassCard>
  );
}
