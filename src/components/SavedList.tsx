import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatTemp } from '../utils/units';
import { determineWeatherMood, getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon, PlusIcon, SearchIcon, TrashIcon, LocationPinIcon } from './WeatherIcons';

interface SavedListProps {
  savedLocations: LocationItem[];
  currentLocation: LocationItem | null;
  activeLocation: LocationItem;
  onSelectLocation: (loc: LocationItem) => void;
  onRemoveLocation: (id: string) => void;
  onOpenSearch: () => void;
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

interface CityWeatherPreview {
  temp: number;
  apparentTemp: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  isDay: number;
}

export function SavedList({
  savedLocations,
  currentLocation,
  activeLocation,
  onSelectLocation,
  onRemoveLocation,
  onOpenSearch,
  mood,
  unitSettings,
}: SavedListProps) {
  const theme = MOOD_THEMES[mood];
  const [previews, setPreviews] = useState<Record<string, CityWeatherPreview>>({});
  const [swipedId, setSwipedId] = useState<string | null>(null);

  // Fetch quick weather summaries for saved locations
  useEffect(() => {
    const listToFetch = [...savedLocations];
    if (currentLocation && !listToFetch.some((l) => l.latitude === currentLocation.latitude && l.longitude === currentLocation.longitude)) {
      listToFetch.unshift(currentLocation);
    }

    if (listToFetch.length === 0) return;

    let isMounted = true;
    async function loadPreviews() {
      const results: Record<string, CityWeatherPreview> = {};

      await Promise.all(
        listToFetch.map(async (loc) => {
          try {
            const res = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${loc.latitude}&longitude=${loc.longitude}&current=temperature_2m,apparent_temperature,weather_code,is_day&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
            );
            if (!res.ok) return;
            const data = await res.json();
            results[loc.id] = {
              temp: data.current.temperature_2m,
              apparentTemp: data.current.apparent_temperature,
              tempMax: data.daily?.temperature_2m_max?.[0] ?? data.current.temperature_2m,
              tempMin: data.daily?.temperature_2m_min?.[0] ?? data.current.temperature_2m,
              weatherCode: data.current.weather_code,
              isDay: data.current.is_day,
            };
          } catch {
            // ignore individual error
          }
        })
      );

      if (isMounted) {
        setPreviews(results);
      }
    }

    loadPreviews();
    return () => {
      isMounted = false;
    };
  }, [savedLocations, currentLocation]);

  const allItems: LocationItem[] = [];
  if (currentLocation) {
    allItems.push({ ...currentLocation, isCurrentLocation: true });
  }
  savedLocations.forEach((loc) => {
    if (!currentLocation || loc.id !== currentLocation.id) {
      allItems.push(loc);
    }
  });

  return (
    <div
      className="flex-1 w-full px-5 overflow-y-auto no-scrollbar"
      style={{
        paddingTop: 'max(24px, calc(12px + env(safe-area-inset-top, 0px)))',
        paddingBottom: 'calc(130px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      {/* Header with Title and Add Button */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[26px] font-bold tracking-tight" style={{ color: theme.textColor }}>
          Saved locations
        </h2>
        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Add location"
          className="w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 shadow-md"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
            boxShadow: `inset 0 1px 0 ${theme.topHighlight}`,
          }}
        >
          <PlusIcon size={20} />
        </button>
      </div>

      {/* Glass Search Pill shortcut */}
      <button
        type="button"
        onClick={onOpenSearch}
        className="w-full mb-6 px-4 py-3 rounded-full flex items-center gap-3 backdrop-blur-[24px] saturate-[160%] transition-transform active:scale-[0.99] shadow-sm text-left"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          borderWidth: '1px',
          color: theme.textColor,
          boxShadow: `inset 0 1px 0 ${theme.topHighlight}`,
        }}
      >
        <SearchIcon size={18} className="opacity-60 flex-shrink-0" />
        <span className="text-sm font-medium opacity-70">Search for a city to add it...</span>
      </button>

      {/* Cards List */}
      {allItems.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-[30px] backdrop-blur-[24px] saturate-[160%] text-center flex flex-col items-center justify-center shadow-lg my-6"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            boxShadow: theme.cardShadow,
          }}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4 bg-black/5 dark:bg-white/10" style={{ color: theme.textColor }}>
            <LocationPinIcon size={28} />
          </div>
          <h3 className="text-lg font-bold mb-1" style={{ color: theme.textColor }}>
            No Saved Locations
          </h3>
          <p className="text-sm opacity-75 max-w-[240px] mb-5" style={{ color: theme.textSecondary }}>
            Search for a city to add it to your quick weather cards list.
          </p>
          <button
            type="button"
            onClick={onOpenSearch}
            className="px-5 py-2.5 rounded-full text-sm font-bold shadow-md transition-transform active:scale-95"
            style={{
              background: theme.activePillBg,
              color: theme.activePillText,
            }}
          >
            Search Cities
          </button>
        </motion.div>
      ) : (
        <div className="space-y-3.5">
          <AnimatePresence mode="popLayout">
            {allItems.map((loc) => {
              const preview = previews[loc.id];
              const weatherCode = preview?.weatherCode ?? 1;
              const isDay = preview?.isDay ?? 1;
              const condition = getWeatherCondition(weatherCode);
              const cardMood = determineWeatherMood(weatherCode, isDay);
              const cardTheme = MOOD_THEMES[cardMood];

              const tempStr = preview ? formatTemp(preview.temp, unitSettings.temp) : '--°';
              const highStr = preview ? formatTemp(preview.tempMax, unitSettings.temp) : '--°';
              const lowStr = preview ? formatTemp(preview.tempMin, unitSettings.temp) : '--°';

              const isCurrent = loc.isCurrentLocation;
              const isActive = activeLocation.id === loc.id;
              const isSwiped = swipedId === loc.id;

              return (
                <motion.div
                  key={loc.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.35 }}
                  className="relative group rounded-[30px] overflow-hidden"
                >
                  {/* Underneath Delete button on swipe */}
                  {!isCurrent && (
                    <div className="absolute inset-y-0 right-0 w-24 bg-rose-500 rounded-[30px] flex items-center justify-center pr-3 z-0">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveLocation(loc.id);
                        }}
                        aria-label={`Remove ${loc.name}`}
                        className="text-white flex flex-col items-center gap-1 font-semibold text-xs"
                      >
                        <TrashIcon size={20} />
                        <span>Remove</span>
                      </button>
                    </div>
                  )}

                  {/* Glass Weather Card */}
                  <motion.div
                    drag={isCurrent ? false : 'x'}
                    dragConstraints={{ left: -90, right: 0 }}
                    dragElastic={0.1}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40) {
                        setSwipedId(loc.id);
                      } else {
                        setSwipedId(null);
                      }
                    }}
                    animate={{ x: isSwiped ? -80 : 0 }}
                    onClick={() => {
                      if (isSwiped) {
                        setSwipedId(null);
                      } else {
                        onSelectLocation(loc);
                      }
                    }}
                    className={`relative z-10 w-full rounded-[30px] backdrop-blur-[24px] saturate-[160%] transition-shadow cursor-pointer select-none ${
                      isCurrent ? 'p-5 min-h-[140px]' : 'p-4 min-h-[120px]'
                    } ${isActive ? 'ring-2 ring-white/70' : ''}`}
                    style={{
                      background: cardTheme.cardBg,
                      borderColor: cardTheme.cardBorder,
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      boxShadow: `${cardTheme.cardShadow}, inset 0 1px 0 ${cardTheme.topHighlight}`,
                    }}
                  >
                    {/* Ambient tinted wash based on city weather */}
                    <div
                      className="absolute inset-0 pointer-events-none rounded-[30px] transition-colors"
                      style={{ background: cardTheme.savedCardTint }}
                    />

                    <div className="relative z-10 flex items-start justify-between">
                      {/* Left side: City & Condition */}
                      <div className="flex-1 pr-2">
                        {isCurrent && (
                          <div
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider mb-1.5 shadow-sm"
                            style={{
                              background: theme.activePillBg,
                              color: theme.activePillText,
                            }}
                          >
                            <LocationPinIcon size={12} className="stroke-[2.2]" />
                            <span>My location</span>
                          </div>
                        )}

                        <h3
                          className="text-[20px] font-bold tracking-tight leading-tight line-clamp-1"
                          style={{ color: cardTheme.textColor }}
                        >
                          {loc.name}
                        </h3>

                        <p
                          className="text-[12.5px] font-medium opacity-80 line-clamp-1"
                          style={{ color: cardTheme.textSecondary }}
                        >
                          {[loc.admin1, loc.country].filter(Boolean).join(', ')}
                        </p>

                        <div className="flex items-center gap-1.5 mt-3">
                          <WeatherIcon
                            category={condition.category}
                            isDay={isDay}
                            size={18}
                            className="stroke-[1.8]"
                          />
                          <span
                            className="text-[13px] font-medium"
                            style={{ color: cardTheme.textColor }}
                          >
                            {condition.label}
                          </span>
                        </div>
                      </div>

                      {/* Right side: Big Temp & H/L */}
                      <div className="flex flex-col items-end">
                        <span
                          className="font-outfit text-[44px] font-[200] leading-none tracking-tight"
                          style={{ color: cardTheme.textColor }}
                        >
                          {tempStr}
                        </span>

                        <div
                          className="text-[12.5px] font-medium opacity-85 mt-2"
                          style={{ color: cardTheme.textSecondary }}
                        >
                          H {highStr} &nbsp;L {lowStr}
                        </div>

                        {/* Optional quick remove button */}
                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRemoveLocation(loc.id);
                            }}
                            aria-label={`Delete ${loc.name}`}
                            className="mt-2 text-xs font-semibold opacity-40 hover:opacity-100 transition-opacity p-1"
                            style={{ color: cardTheme.textSecondary }}
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
