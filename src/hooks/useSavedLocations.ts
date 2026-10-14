import { useState, useEffect, useCallback } from 'react';
import { LocationItem, UnitSettings } from '../types/weather';

const SAVED_LOCATIONS_KEY = 'glass_weather_saved_locations_v1';
const UNIT_SETTINGS_KEY = 'glass_weather_units_v1';

export const INITIAL_SAVED_LOCATIONS: LocationItem[] = [
  {
    id: 'tokyo-jp',
    name: 'Tokyo',
    admin1: 'Tokyo Prefecture',
    country: 'Japan',
    countryCode: 'JP',
    latitude: 35.6762,
    longitude: 139.6503,
    timezone: 'Asia/Tokyo',
  },
  {
    id: 'london-gb',
    name: 'London',
    admin1: 'England',
    country: 'United Kingdom',
    countryCode: 'GB',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  },
  {
    id: 'san-francisco-us',
    name: 'San Francisco',
    admin1: 'California',
    country: 'United States',
    countryCode: 'US',
    latitude: 37.7749,
    longitude: -122.4194,
    timezone: 'America/Los_Angeles',
  },
  {
    id: 'paris-fr',
    name: 'Paris',
    admin1: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    latitude: 48.8566,
    longitude: 2.3522,
    timezone: 'Europe/Paris',
  },
];

const DEFAULT_UNITS: UnitSettings = {
  temp: 'celsius',
  wind: 'kmh',
  pressure: 'hpa',
};

export function useSavedLocations() {
  const [savedLocations, setSavedLocations] = useState<LocationItem[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_LOCATIONS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return INITIAL_SAVED_LOCATIONS;
  });

  const [unitSettings, setUnitSettings] = useState<UnitSettings>(() => {
    try {
      const stored = localStorage.getItem(UNIT_SETTINGS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return DEFAULT_UNITS;
  });

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_LOCATIONS_KEY, JSON.stringify(savedLocations));
    } catch {
      // ignore
    }
  }, [savedLocations]);

  useEffect(() => {
    try {
      localStorage.setItem(UNIT_SETTINGS_KEY, JSON.stringify(unitSettings));
    } catch {
      // ignore
    }
  }, [unitSettings]);

  const addLocation = useCallback((loc: LocationItem) => {
    setSavedLocations((prev) => {
      if (prev.some((item) => item.latitude.toFixed(3) === loc.latitude.toFixed(3) && item.longitude.toFixed(3) === loc.longitude.toFixed(3))) {
        return prev;
      }
      return [loc, ...prev];
    });
  }, []);

  const removeLocation = useCallback((id: string) => {
    setSavedLocations((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const isLocationSaved = useCallback(
    (latitude: number, longitude: number) => {
      return savedLocations.some(
        (item) =>
          Math.abs(item.latitude - latitude) < 0.05 &&
          Math.abs(item.longitude - longitude) < 0.05
      );
    },
    [savedLocations]
  );

  return {
    savedLocations,
    addLocation,
    removeLocation,
    isLocationSaved,
    unitSettings,
    setUnitSettings,
  };
}
