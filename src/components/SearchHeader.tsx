import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, MapPin, Plus, Search, Star, X } from 'lucide-react';
import { geocode, reverseGeocode } from '@/lib/api';
import type { GeoResult, SavedCity } from '@/lib/types';

interface SearchHeaderProps {
  onSelectCity: (result: GeoResult) => void;
  onUseLocation: () => void;
  favorites: SavedCity[];
  onAddFavorite: (city: SavedCity) => void;
  onRemoveFavorite: (id: number) => void;
  currentCity: string;
}

export function SearchHeader({
  onSelectCity,
  onUseLocation,
  favorites,
  onAddFavorite,
  onRemoveFavorite,
  currentCity,
}: SearchHeaderProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeoResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showFavMenu, setShowFavMenu] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    const timer = setTimeout(() => {
      geocode(query)
        .then((r) => {
          if (!cancelled) {
            setResults(r);
            setShowResults(true);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  const handleSelect = (r: GeoResult) => {
    onSelectCity(r);
    setQuery('');
    setResults([]);
    setShowResults(false);
  };

  const handleLocate = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      const result = await reverseGeocode(pos.coords.latitude, pos.coords.longitude);
      onSelectCity(result);
    });
    onUseLocation();
  };

  return (
    <div className="relative z-50">
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <div className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/60 backdrop-blur-xl px-4 py-2.5
            focus-within:border-cyan-400/40 focus-within:shadow-[0_0_25px_rgba(34,211,238,0.1)] transition-all">
            <Search className="w-4 h-4 text-cyan-400/60 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => results.length > 0 && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              placeholder="Search any city..."
              className="flex-1 bg-transparent text-sm text-cyan-100 placeholder:text-slate-500 outline-none"
            />
            {loading && <div className="w-4 h-4 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />}
          </div>

          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full mt-2 w-full rounded-xl border border-cyan-400/20 bg-slate-900/90 backdrop-blur-xl overflow-hidden shadow-2xl"
              >
                {results.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r)}
                    className="flex items-center gap-2 w-full px-4 py-2.5 text-left text-sm text-cyan-100
                      hover:bg-cyan-500/10 transition-colors border-b border-cyan-400/5 last:border-0"
                  >
                    <MapPin className="w-3.5 h-3.5 text-cyan-400/50" />
                    <span className="font-medium">{r.name}</span>
                    {r.admin1 && <span className="text-slate-400">{r.admin1}</span>}
                    {r.country && <span className="text-slate-500 text-xs">{r.country}</span>}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Locate button */}
        <button
          onClick={handleLocate}
          className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/60 backdrop-blur-xl
            px-4 py-2.5 text-sm text-cyan-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all"
        >
          <LocateFixed className="w-4 h-4" />
          <span className="hidden sm:inline">My Location</span>
        </button>

        {/* Favorites */}
        <div className="relative">
          <button
            onClick={() => setShowFavMenu(!showFavMenu)}
            className="flex items-center gap-2 rounded-full border border-cyan-400/20 bg-slate-900/60 backdrop-blur-xl
              px-4 py-2.5 text-sm text-cyan-200 hover:border-cyan-400/40 hover:bg-cyan-500/10 transition-all"
          >
            <Star className="w-4 h-4" />
            <span className="hidden sm:inline">Saved</span>
          </button>

          <AnimatePresence>
            {showFavMenu && (
              <>
                <div className="fixed inset-0" onClick={() => setShowFavMenu(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-full right-0 mt-2 w-72 rounded-xl border border-cyan-400/20 bg-slate-900/90 backdrop-blur-xl
                    overflow-hidden shadow-2xl p-2"
                >
                  <div className="flex items-center justify-between px-2 py-1.5 mb-1">
                    <span className="text-xs uppercase tracking-wider text-cyan-300/60">Favorite Cities</span>
                    <button
                      onClick={() => {
                        onAddFavorite({
                          id: Date.now(),
                          name: currentCity,
                          latitude: 0,
                          longitude: 0,
                        });
                      }}
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {favorites.length === 0 ? (
                    <div className="px-3 py-4 text-center text-sm text-slate-500">
                      No saved cities yet. Search and add one.
                    </div>
                  ) : (
                    favorites.map((f) => (
                      <div
                        key={f.id}
                        className="flex items-center gap-2 rounded-lg px-2 py-2 hover:bg-cyan-500/10 transition-colors group"
                      >
                        <button
                          onClick={() => {
                            onSelectCity(f);
                            setShowFavMenu(false);
                          }}
                          className="flex-1 flex items-center gap-2 text-left text-sm text-cyan-100"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-400/70" />
                          <span className="font-medium">{f.name}</span>
                          {f.admin1 && <span className="text-slate-400 text-xs">{f.admin1}</span>}
                        </button>
                        <button
                          onClick={() => onRemoveFavorite(f.id)}
                          className="opacity-0 group-hover:opacity-100 text-slate-500 hover:text-red-400 transition-all"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Quick favorites bar */}
      {favorites.length > 0 && (
        <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
          {favorites.map((f) => (
            <button
              key={f.id}
              onClick={() => onSelectCity(f)}
              className="flex items-center gap-1.5 rounded-full border border-cyan-400/15 bg-slate-900/40 backdrop-blur-md
                px-3 py-1.5 text-xs text-cyan-200/80 hover:border-cyan-400/30 hover:bg-cyan-500/10
                transition-all whitespace-nowrap shrink-0"
            >
              <Star className="w-3 h-3 text-amber-400/60" />
              {f.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
