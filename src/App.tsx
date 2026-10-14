/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LocationItem } from './types/weather';
import { useGeolocation, DEFAULT_FALLBACK_LOCATION } from './hooks/useGeolocation';
import { useSavedLocations } from './hooks/useSavedLocations';
import { useWeather } from './hooks/useWeather';
import { MOOD_THEMES } from './utils/moodThemes';
import { BackgroundMood } from './components/BackgroundMood';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HourlyStrip } from './components/HourlyStrip';
import { DetailsGrid } from './components/DetailsGrid';
import { WeekList } from './components/WeekList';
import { BottomNav, NavTab } from './components/BottomNav';
import { MapView } from './components/MapView';
import { SavedList } from './components/SavedList';
import { SearchSheet } from './components/SearchSheet';
import { SettingsSheet } from './components/SettingsSheet';
import { SkeletonLoader } from './components/SkeletonLoader';
import { ErrorCard } from './components/ErrorCard';
import { OfflineIndicator } from './components/OfflineIndicator';
import { LocationPinIcon, CloseIcon } from './components/WeatherIcons';

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('weather');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [dismissGeoPrompt, setDismissGeoPrompt] = useState(false);

  // Geolocation
  const { currentCoords, geoError, isLocating, requestLocation } = useGeolocation();

  // Saved locations & Units
  const {
    savedLocations,
    addLocation,
    removeLocation,
    isLocationSaved,
    unitSettings,
    setUnitSettings,
  } = useSavedLocations();

  // Active City state (default to fallback until GPS resolves)
  const [activeLocation, setActiveLocation] = useState<LocationItem>(DEFAULT_FALLBACK_LOCATION);
  const [userGpsLocation, setUserGpsLocation] = useState<LocationItem | null>(null);

  // When GPS coordinates resolve, reverse lookup or set GPS location
  useEffect(() => {
    if (!currentCoords) return;
    const coords = currentCoords;

    let isMounted = true;
    async function resolveGpsCity() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${coords.latitude}&longitude=${coords.longitude}&current=temperature_2m&timezone=auto`
        );
        const data = await res.json();
        const timezoneStr = data.timezone || 'Local';
        const cityName = timezoneStr.includes('/')
          ? timezoneStr.split('/')[1].replace(/_/g, ' ')
          : 'My Location';

        const gpsItem: LocationItem = {
          id: 'user-gps-current',
          name: cityName,
          admin1: timezoneStr.split('/')[0],
          country: 'Local',
          latitude: coords.latitude,
          longitude: coords.longitude,
          timezone: timezoneStr,
          isCurrentLocation: true,
        };

        if (isMounted) {
          setUserGpsLocation(gpsItem);
          setActiveLocation(gpsItem);
        }
      } catch {
        if (isMounted) {
          const fallbackGps: LocationItem = {
            id: 'user-gps-current',
            name: 'Current Location',
            latitude: coords.latitude,
            longitude: coords.longitude,
            isCurrentLocation: true,
          };
          setUserGpsLocation(fallbackGps);
          setActiveLocation(fallbackGps);
        }
      }
    }

    resolveGpsCity();
    return () => {
      isMounted = false;
    };
  }, [currentCoords]);

  // Weather data hook for the active city
  const { weather, mood, isLoading, isRefreshing, error, refetch } = useWeather(activeLocation);
  const currentTheme = MOOD_THEMES[mood];

  // Select location handler
  const handleSelectLocation = (loc: LocationItem) => {
    setActiveLocation(loc);
    setActiveTab('weather');
  };

  // Reset to GPS current location
  const handleResetToCurrentLocation = () => {
    if (userGpsLocation) {
      setActiveLocation(userGpsLocation);
      setActiveTab('weather');
    } else {
      requestLocation();
    }
  };

  return (
    <BackgroundMood mood={mood}>
      {/* Gentle Location Permission Prompt (if denied or fallback in use) */}
      <AnimatePresence>
        {!dismissGeoPrompt && geoError && !userGpsLocation && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-4 mt-3 p-3.5 rounded-2xl backdrop-blur-md flex items-center justify-between text-xs font-medium shadow-md z-30"
            style={{
              background: currentTheme.isDark ? 'rgba(255, 255, 255, 0.14)' : 'rgba(255, 255, 255, 0.75)',
              borderColor: currentTheme.cardBorder,
              borderWidth: '1px',
              color: currentTheme.textColor,
            }}
          >
            <div className="flex items-center gap-2 pr-2">
              <LocationPinIcon size={16} className="text-amber-500 flex-shrink-0" />
              <span>Showing Tokyo as default. Tap to enable device location.</span>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button
                type="button"
                onClick={requestLocation}
                disabled={isLocating}
                className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-500 text-white shadow-sm active:scale-95 transition-transform"
              >
                {isLocating ? 'Locating...' : 'Enable'}
              </button>
              <button
                type="button"
                onClick={() => setDismissGeoPrompt(true)}
                aria-label="Dismiss prompt"
                className="p-1 opacity-60 hover:opacity-100"
              >
                <CloseIcon size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Offline Mode Indicator */}
      <OfflineIndicator mood={mood} />

      {/* Screen Container with Tab Switch Animations */}
      <div className="relative flex-1 flex flex-col w-full">
        <AnimatePresence mode="wait">
          {activeTab === 'weather' && (
            <motion.div
              key="weather-screen"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex-1 flex flex-col w-full overflow-y-auto no-scrollbar"
            >
              {/* Floating Header */}
              <Header
                location={activeLocation}
                mood={mood}
                lastUpdated={weather?.lastUpdated}
                isRefreshing={isRefreshing}
                onRefresh={refetch}
                onOpenSearch={() => setIsSearchOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onResetToCurrentLocation={handleResetToCurrentLocation}
              />

              {/* Body Content */}
              {isLoading && !weather ? (
                <SkeletonLoader mood={mood} />
              ) : error ? (
                <ErrorCard message={error} onRetry={refetch} mood={mood} />
              ) : weather ? (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08 },
                    },
                  }}
                  className="flex flex-col"
                >
                  {/* Hero Section */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <Hero
                      current={weather.current}
                      todayDaily={weather.daily[0]}
                      mood={mood}
                      unitSettings={unitSettings}
                    />
                  </motion.div>

                  {/* Hourly Strip */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <HourlyStrip
                      hourly={weather.hourly}
                      mood={mood}
                      unitSettings={unitSettings}
                    />
                  </motion.div>

                  {/* Details Grid */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <DetailsGrid
                      current={weather.current}
                      hourlyFirst={weather.hourly[0]}
                      mood={mood}
                      unitSettings={unitSettings}
                    />
                  </motion.div>

                  {/* 7-Day Forecast */}
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 },
                    }}
                  >
                    <WeekList
                      daily={weather.daily}
                      currentTemp={weather.current.temperature}
                      mood={mood}
                      unitSettings={unitSettings}
                    />
                  </motion.div>
                </motion.div>
              ) : null}
            </motion.div>
          )}

          {activeTab === 'map' && (
            <motion.div
              key="map-screen"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex-1 w-full h-full relative"
            >
              <MapView
                currentLocation={userGpsLocation}
                activeLocation={activeLocation}
                savedLocations={savedLocations}
                onSelectLocation={handleSelectLocation}
                onOpenSearch={() => setIsSearchOpen(true)}
                mood={mood}
                unitSettings={unitSettings}
              />
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div
              key="saved-screen"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex-1 flex flex-col w-full"
            >
              <SavedList
                savedLocations={savedLocations}
                currentLocation={userGpsLocation}
                activeLocation={activeLocation}
                onSelectLocation={handleSelectLocation}
                onRemoveLocation={removeLocation}
                onOpenSearch={() => setIsSearchOpen(true)}
                mood={mood}
                unitSettings={unitSettings}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pinned 28px Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        mood={mood}
      />

      {/* Search Bottom Sheet */}
      <SearchSheet
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={handleSelectLocation}
        onSaveLocation={addLocation}
        isLocationSaved={isLocationSaved}
        mood={mood}
      />

      {/* Settings Bottom Sheet */}
      <SettingsSheet
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        unitSettings={unitSettings}
        onUpdateUnits={setUnitSettings}
        mood={mood}
      />
    </BackgroundMood>
  );
}
