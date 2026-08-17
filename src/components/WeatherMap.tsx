import { useState } from 'react';
import { motion } from 'framer-motion';
import { Map as MapIcon, Thermometer, Wind, CloudRain } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import type { GeoLocation, CurrentWeather } from '@/weather/types';
import { getWeatherLabel } from '@/weather/codes';
import { formatTempUnit } from '@/weather/utils';

interface Props {
  location: GeoLocation;
  current: CurrentWeather;
  unit: 'C' | 'F';
}

type Overlay = 'temp' | 'wind' | 'precip';

const OVERLAY_LAYERS: Record<
  Overlay,
  { url: string; label: string; icon: React.ReactNode }
> = {
  temp: {
    url: 'https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png',
    label: 'Temperature',
    icon: <Thermometer className="w-4 h-4" />,
  },
  wind: {
    url: 'https://tile.openweathermap.org/map/wind_new/{z}/{x}/{y}.png',
    label: 'Wind',
    icon: <Wind className="w-4 h-4" />,
  },
  precip: {
    url: 'https://tile.openweathermap.org/map/precipitation_new/{z}/{x}/{y}.png',
    label: 'Precipitation',
    icon: <CloudRain className="w-4 h-4" />,
  },
};

function makeIcon(color: string) {
  return L.divIcon({
    className: 'aether-marker',
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};box-shadow:0 0 12px ${color},0 0 4px ${color};border:2px solid rgba(255,255,255,0.6)"></div>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
  });
}

export default function WeatherMap({ location, current, unit }: Props) {
  const [overlay, setOverlay] = useState<Overlay | null>('temp');

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="glass rounded-2xl p-5"
    >
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-white/60">
          <MapIcon className="w-4 h-4" />
          <span className="text-xs font-medium uppercase tracking-wide">
            Weather Map
          </span>
        </div>
        <div className="flex gap-1.5">
          <OverlayButton
            active={overlay === 'temp'}
            onClick={() => setOverlay(overlay === 'temp' ? null : 'temp')}
            icon={OVERLAY_LAYERS.temp.icon}
            label="Temp"
          />
          <OverlayButton
            active={overlay === 'wind'}
            onClick={() => setOverlay(overlay === 'wind' ? null : 'wind')}
            icon={OVERLAY_LAYERS.wind.icon}
            label="Wind"
          />
          <OverlayButton
            active={overlay === 'precip'}
            onClick={() => setOverlay(overlay === 'precip' ? null : 'precip')}
            icon={OVERLAY_LAYERS.precip.icon}
            label="Precip"
          />
        </div>
      </div>

      <div className="rounded-xl overflow-hidden h-[280px] md:h-[340px] relative z-0">
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={8}
          scrollWheelZoom={false}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; OpenStreetMap &copy; CARTO'
          />
          {overlay && (
            <TileLayer
              url={OVERLAY_LAYERS[overlay].url}
              opacity={0.7}
              attribution="OpenWeatherMap"
            />
          )}
          <Marker
            position={[location.latitude, location.longitude]}
            icon={makeIcon('var(--accent)')}
          >
            <Popup>
              <div style={{ color: '#111' }}>
                <strong>{location.name}</strong>
                <br />
                {getWeatherLabel(current.weatherCode)} ·{' '}
                {formatTempUnit(current.temperature, unit)}
              </div>
            </Popup>
          </Marker>
          <CircleMarker
            center={[location.latitude, location.longitude]}
            radius={30}
            pathOptions={{
              color: 'var(--accent)',
              fillColor: 'var(--accent)',
              fillOpacity: 0.08,
              weight: 1,
            }}
          />
        </MapContainer>
      </div>
      <p className="text-[10px] text-white/30 mt-2">
        Weather overlays powered by OpenWeatherMap tiles. Toggle layers above.
      </p>
    </motion.div>
  );
}

function OverlayButton({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
        active
          ? 'glass-strong text-white'
          : 'glass text-white/50 hover:text-white/80'
      }`}
      style={active ? { boxShadow: '0 0 16px var(--glow)' } : {}}
    >
      {icon}
      {label}
    </button>
  );
}
