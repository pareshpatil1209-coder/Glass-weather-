import { useState, useEffect, useCallback } from 'react';
import { FullWeatherData, WeatherMood, LocationItem } from '../types/weather';
import { determineWeatherMood } from '../utils/weatherCodes';

interface UseWeatherResult {
  weather: FullWeatherData | null;
  mood: WeatherMood;
  isLoading: boolean;
  isRefreshing: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  isOfflineCached: boolean;
}

const CACHE_PREFIX = 'glass_weather_cache_v1_';

export function useWeather(location: LocationItem | null): UseWeatherResult {
  const [weather, setWeather] = useState<FullWeatherData | null>(() => {
    if (!location) return null;
    try {
      const cacheKey = `${CACHE_PREFIX}${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`;
      const saved = localStorage.getItem(cacheKey);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return null;
  });

  const [mood, setMood] = useState<WeatherMood>('sunny');
  const [isLoading, setIsLoading] = useState<boolean>(!weather);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOfflineCached, setIsOfflineCached] = useState<boolean>(false);

  const fetchWeather = useCallback(async (isRefresh = false) => {
    if (!location) return;

    const cacheKey = `${CACHE_PREFIX}${location.latitude.toFixed(2)}_${location.longitude.toFixed(2)}`;

    // Try reading from cache first if no weather state exists
    let existingCached: FullWeatherData | null = null;
    try {
      const saved = localStorage.getItem(cacheKey);
      if (saved) {
        existingCached = JSON.parse(saved);
        if (!weather) {
          setWeather(existingCached);
          if (existingCached?.current) {
            setMood(
              determineWeatherMood(
                existingCached.current.weatherCode,
                existingCached.current.isDay,
                existingCached.current.time,
                existingCached.daily[0]?.sunrise,
                existingCached.daily[0]?.sunset
              )
            );
          }
        }
      }
    } catch {
      // ignore
    }

    if (isRefresh) {
      setIsRefreshing(true);
    } else if (!existingCached) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.latitude}&longitude=${location.longitude}&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,is_day,wind_speed_10m,wind_direction_10m,wind_gusts_10m,surface_pressure&hourly=temperature_2m,weather_code,precipitation_probability,visibility,uv_index,dew_point_2m,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,sunrise,sunset&timezone=auto&forecast_days=7`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather service responded with status ${response.status}`);
      }

      const json = await response.json();

      const current = {
        time: json.current.time,
        temperature: json.current.temperature_2m,
        apparentTemperature: json.current.apparent_temperature,
        relativeHumidity: json.current.relative_humidity_2m,
        weatherCode: json.current.weather_code,
        isDay: json.current.is_day,
        windSpeed: json.current.wind_speed_10m,
        windDirection: json.current.wind_direction_10m,
        windGusts: json.current.wind_gusts_10m ?? json.current.wind_speed_10m,
        surfacePressure: json.current.surface_pressure,
      };

      // Extract next 24-28 hours from hourly data starting around the current hour
      const hourlyTimes: string[] = json.hourly.time || [];
      const currentIso = json.current.time;
      let startIndex = hourlyTimes.findIndex((t) => t >= currentIso);
      if (startIndex === -1) startIndex = 0;

      const hourlySlice = hourlyTimes.slice(startIndex, startIndex + 25).map((t, idx) => {
        const i = startIndex + idx;
        return {
          time: t,
          temperature: json.hourly.temperature_2m[i] ?? 0,
          weatherCode: json.hourly.weather_code[i] ?? 0,
          precipitationProbability: json.hourly.precipitation_probability[i] ?? 0,
          visibility: json.hourly.visibility[i] ?? 10000,
          uvIndex: json.hourly.uv_index[i] ?? 0,
          dewPoint: json.hourly.dew_point_2m[i] ?? 0,
          isDay: json.hourly.is_day ? json.hourly.is_day[i] : (json.current.is_day ?? 1),
        };
      });

      // Daily list
      const dailyDates: string[] = json.daily.time || [];
      const dailyList = dailyDates.map((d, i) => ({
        date: d,
        weatherCode: json.daily.weather_code[i],
        tempMax: json.daily.temperature_2m_max[i],
        tempMin: json.daily.temperature_2m_min[i],
        precipitationProbabilityMax: json.daily.precipitation_probability_max[i] ?? 0,
        sunrise: json.daily.sunrise[i],
        sunset: json.daily.sunset[i],
      }));

      const fullData: FullWeatherData = {
        current,
        hourly: hourlySlice,
        daily: dailyList,
        elevation: json.elevation ?? 0,
        timezone: json.timezone ?? 'auto',
        timezoneAbbreviation: json.timezone_abbreviation ?? '',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      const todaySunrise = dailyList[0]?.sunrise;
      const todaySunset = dailyList[0]?.sunset;

      const computedMood = determineWeatherMood(
        current.weatherCode,
        current.isDay,
        current.time,
        todaySunrise,
        todaySunset
      );

      setWeather(fullData);
      setMood(computedMood);
      setIsOfflineCached(false);

      // Cache successful response in localStorage
      try {
        localStorage.setItem(cacheKey, JSON.stringify(fullData));
      } catch {
        // ignore quota error
      }
    } catch (err: unknown) {
      console.warn('Network weather fetch failed, attempting cached fallback:', err);
      if (existingCached) {
        setWeather(existingCached);
        setIsOfflineCached(true);
        setError(null);
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Unable to connect to weather service. Please check your connection.'
        );
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [location, weather]);

  useEffect(() => {
    fetchWeather(false);
  }, [location]);

  const refetch = useCallback(async () => {
    await fetchWeather(true);
  }, [fetchWeather]);

  return {
    weather,
    mood,
    isLoading,
    isRefreshing,
    error,
    refetch,
    isOfflineCached,
  };
}
