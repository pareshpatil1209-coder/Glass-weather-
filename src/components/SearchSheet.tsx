import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationItem, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { SearchIcon, CloseIcon, LocationPinIcon, PlusIcon, CheckIcon } from './WeatherIcons';

interface SearchSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (loc: LocationItem) => void;
  onSaveLocation: (loc: LocationItem) => void;
  isLocationSaved: (lat: number, lon: number) => boolean;
  mood: WeatherMood;
}

interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  country_code?: string;
  admin1?: string;
  timezone?: string;
}

const POPULAR_SEARCHES: LocationItem[] = [
  { id: 'nyc', name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006 },
  { id: 'london', name: 'London', admin1: 'England', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278 },
  { id: 'tokyo', name: 'Tokyo', admin1: 'Tokyo Prefecture', country: 'Japan', latitude: 35.6762, longitude: 139.6503 },
  { id: 'paris', name: 'Paris', admin1: 'Île-de-France', country: 'France', latitude: 48.8566, longitude: 2.3522 },
  { id: 'sydney', name: 'Sydney', admin1: 'New South Wales', country: 'Australia', latitude: -33.8688, longitude: 151.2093 },
  { id: 'dubai', name: 'Dubai', admin1: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708 },
];

export function SearchSheet({
  isOpen,
  onClose,
  onSelectLocation,
  onSaveLocation,
  isLocationSaved,
  mood,
}: SearchSheetProps) {
  const theme = MOOD_THEMES[mood];
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<LocationItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
    } else {
      setQuery('');
      setResults([]);
      setSearchError(null);
    }
  }, [isOpen]);

  // Debounced search 300ms
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      setSearchError(null);
      try {
        const res = await fetch(
          `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
            query.trim()
          )}&count=8&language=en&format=json`
        );
        if (!res.ok) throw new Error('Search failed');
        const data = await res.json();
        if (data.results && Array.isArray(data.results)) {
          const formatted: LocationItem[] = data.results.map((r: GeocodingResult) => ({
            id: `${r.id}-${r.name}`,
            name: r.name,
            admin1: r.admin1,
            country: r.country,
            countryCode: r.country_code,
            latitude: r.latitude,
            longitude: r.longitude,
            timezone: r.timezone,
          }));
          setResults(formatted);
        } else {
          setResults([]);
        }
      } catch {
        setSearchError('Could not fetch search results. Check connection.');
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] max-h-[85vh] rounded-t-[36px] backdrop-blur-[28px] saturate-[170%] p-6 flex flex-col shadow-2xl overflow-hidden"
            style={{
              background: theme.isDark
                ? 'linear-gradient(180deg, rgba(30, 25, 55, 0.95) 0%, rgba(15, 12, 35, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 245, 255, 0.98) 100%)',
              borderColor: theme.cardBorder,
              borderWidth: '1px 1px 0 1px',
              borderStyle: 'solid',
            }}
          >
            {/* Sheet grabber */}
            <div className="w-12 h-1.5 rounded-full bg-slate-400/40 self-center mb-5 cursor-pointer" onClick={onClose} />

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.textColor }}>
                Search Cities
              </h3>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close search"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 transition-transform active:scale-95"
                style={{ color: theme.textColor }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Search Input field */}
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-full mb-4 shadow-inner"
              style={{
                background: theme.isDark ? 'rgba(255, 255, 255, 0.10)' : 'rgba(0, 0, 0, 0.05)',
                borderColor: theme.cardBorder,
                borderWidth: '1px',
              }}
            >
              <SearchIcon size={18} className="opacity-60" style={{ color: theme.textColor }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search city, state or country..."
                className="flex-1 bg-transparent border-none outline-none text-base font-medium placeholder:opacity-50"
                style={{ color: theme.textColor }}
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  aria-label="Clear search input"
                  className="opacity-60 hover:opacity-100"
                  style={{ color: theme.textColor }}
                >
                  <CloseIcon size={16} />
                </button>
              )}
            </div>

            {/* Results or Suggestions List */}
            <div className="flex-1 overflow-y-auto no-scrollbar space-y-2 pb-6 min-h-[220px]">
              {isSearching && (
                <div className="py-8 flex flex-col items-center justify-center opacity-70">
                  <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin mb-2" style={{ color: theme.accentColor }} />
                  <span className="text-sm font-medium" style={{ color: theme.textSecondary }}>Searching world locations...</span>
                </div>
              )}

              {searchError && (
                <div className="py-6 text-center text-sm font-medium text-rose-500">
                  {searchError}
                </div>
              )}

              {!isSearching && query.length >= 2 && results.length === 0 && (
                <div className="py-8 text-center text-sm font-medium opacity-70" style={{ color: theme.textSecondary }}>
                  No matching cities found for &quot;{query}&quot;.
                </div>
              )}

              {/* Dynamic search results */}
              {!isSearching && results.length > 0 && (
                <div className="space-y-1.5">
                  <div className="text-[12px] font-semibold uppercase tracking-wider px-2 mb-1" style={{ color: theme.textSecondary }}>
                    Search Results
                  </div>
                  {results.map((loc) => {
                    const isSaved = isLocationSaved(loc.latitude, loc.longitude);
                    return (
                      <div
                        key={loc.id}
                        className="flex items-center justify-between p-3 rounded-2xl transition-colors hover:bg-black/5 dark:hover:bg-white/10"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            onSelectLocation(loc);
                            onClose();
                          }}
                          className="flex-1 flex items-center gap-3 text-left focus:outline-none"
                        >
                          <div className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10" style={{ color: theme.textColor }}>
                            <LocationPinIcon size={18} />
                          </div>
                          <div>
                            <div className="font-semibold text-[15px]" style={{ color: theme.textColor }}>
                              {loc.name}
                            </div>
                            <div className="text-[12px] opacity-75" style={{ color: theme.textSecondary }}>
                              {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                            </div>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => onSaveLocation(loc)}
                          aria-label={isSaved ? 'Already saved' : 'Save location'}
                          className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                            isSaved ? 'bg-emerald-500/20 text-emerald-500' : 'bg-black/5 dark:bg-white/10'
                          }`}
                          style={{ color: isSaved ? undefined : theme.textColor }}
                        >
                          {isSaved ? <CheckIcon size={16} /> : <PlusIcon size={16} />}
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Popular quick picks when input is empty */}
              {!query && (
                <div className="mt-2 space-y-1.5">
                  <div className="text-[12px] font-semibold uppercase tracking-wider px-2 mb-2" style={{ color: theme.textSecondary }}>
                    Popular Cities
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {POPULAR_SEARCHES.map((city) => (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          onSelectLocation(city);
                          onClose();
                        }}
                        className="flex items-center gap-2.5 p-3 rounded-2xl text-left bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all text-sm font-medium"
                        style={{ color: theme.textColor }}
                      >
                        <LocationPinIcon size={16} className="opacity-70 flex-shrink-0" />
                        <span className="truncate">{city.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
