import { useEffect, useRef, useState } from 'react';
import { Search, LocateFixed, Star, X, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { searchCities, reverseGeocode } from '@/weather/api';
import type { GeoLocation } from '@/weather/types';

interface Props {
  onSelect: (loc: GeoLocation) => void;
  onGeolocate: () => void;
  geoLoading: boolean;
  favorites: GeoLocation[];
  activeId: number | null;
  onToggleFavorite: (loc: GeoLocation) => void;
  onRemoveFavorite: (id: number) => void;
}

export default function SearchBar({
  onSelect,
  onGeolocate,
  geoLoading,
  favorites,
  activeId,
  onToggleFavorite,
  onRemoveFavorite,
}: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const r = await searchCities(query);
        setResults(r);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  function handleSelect(loc: GeoLocation) {
    onSelect(loc);
    setQuery('');
    setResults([]);
    setOpen(false);
  }

  return (
    <div className="w-full">
      <div ref={containerRef} className="relative">
        <div className="glass-strong flex items-center gap-2 rounded-2xl px-4 py-3">
          <Search className="w-5 h-5 text-white/50 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => results.length && setOpen(true)}
            placeholder="Search city..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/40"
          />
          {loading && (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
          )}
          <button
            onClick={onGeolocate}
            disabled={geoLoading}
            title="Use my current location"
            className="p-1.5 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white disabled:opacity-40"
          >
            {geoLoading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white/80 rounded-full animate-spin" />
            ) : (
              <LocateFixed className="w-4 h-4" />
            )}
          </button>
        </div>

        <AnimatePresence>
          {open && results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-2 w-full glass-strong rounded-2xl overflow-hidden max-h-72 overflow-y-auto"
            >
              {results.map((r) => (
                <li key={`${r.id}-${r.latitude}`}>
                  <button
                    onClick={() => handleSelect(r)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition text-left"
                  >
                    <MapPin className="w-4 h-4 text-white/40 shrink-0" />
                    <span className="text-sm text-white/90">
                      {r.name}
                      {r.admin1 ? `, ${r.admin1}` : ''}
                      {r.country ? `, ${r.country}` : ''}
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      {/* Favorites bar */}
      {favorites.length > 0 && (
        <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {favorites.map((f) => (
            <div
              key={f.id}
              className={`group flex items-center gap-1.5 rounded-full pl-3 pr-1 py-1.5 text-xs whitespace-nowrap transition cursor-pointer ${
                activeId === f.id
                  ? 'glass-strong text-white'
                  : 'glass text-white/70 hover:text-white'
              }`}
              onClick={() => onSelect(f)}
            >
              <Star className="w-3 h-3 fill-current text-amber-300" />
              <span>{f.name}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveFavorite(f.id);
                }}
                className="p-0.5 rounded-full hover:bg-white/15 transition opacity-0 group-hover:opacity-100"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { reverseGeocode };
