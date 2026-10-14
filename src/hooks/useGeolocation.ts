import { useState, useEffect, useCallback } from 'react';
import { LocationItem } from '../types/weather';

export const DEFAULT_FALLBACK_LOCATION: LocationItem = {
  id: 'default-tokyo',
  name: 'Tokyo',
  admin1: 'Tokyo Prefecture',
  country: 'Japan',
  countryCode: 'JP',
  latitude: 35.6762,
  longitude: 139.6503,
  timezone: 'Asia/Tokyo',
  isCurrentLocation: false,
};

export function useGeolocation() {
  const [currentCoords, setCurrentCoords] = useState<{ latitude: number; longitude: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [hasPrompted, setHasPrompted] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLocating(false);
        setHasPrompted(true);
      },
      (error) => {
        let msg = 'Location access not available';
        if (error.code === error.PERMISSION_DENIED) {
          msg = 'Location permission denied. Showing default city.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg = 'Location information is unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg = 'Location request timed out.';
        }
        setGeoError(msg);
        setIsLocating(false);
        setHasPrompted(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  useEffect(() => {
    // Attempt once on initial mount
    requestLocation();
  }, [requestLocation]);

  return {
    currentCoords,
    geoError,
    hasPrompted,
    isLocating,
    requestLocation,
    clearGeoError: () => setGeoError(null),
  };
}
