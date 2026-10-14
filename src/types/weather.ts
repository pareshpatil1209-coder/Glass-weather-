export type WeatherMood = 'sunny' | 'rainy' | 'night' | 'sunset';

export interface LocationItem {
  id: string;
  name: string;
  admin1?: string;
  country?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
  isCurrentLocation?: boolean;
}

export type TempUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'mph';
export type PressureUnit = 'hpa' | 'inhg';

export interface UnitSettings {
  temp: TempUnit;
  wind: WindUnit;
  pressure: PressureUnit;
}

export interface CurrentWeatherData {
  time: string;
  temperature: number;
  apparentTemperature: number;
  relativeHumidity: number;
  weatherCode: number;
  isDay: number;
  windSpeed: number;
  windDirection: number;
  windGusts: number;
  surfacePressure: number;
}

export interface HourlyForecastItem {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
  visibility: number; // in meters
  uvIndex: number;
  dewPoint: number;
  isDay: number;
}

export interface DailyForecastItem {
  date: string;
  weatherCode: number;
  tempMax: number;
  tempMin: number;
  precipitationProbabilityMax: number;
  sunrise: string;
  sunset: string;
}

export interface FullWeatherData {
  current: CurrentWeatherData;
  hourly: HourlyForecastItem[];
  daily: DailyForecastItem[];
  elevation: number;
  timezone: string;
  timezoneAbbreviation: string;
  lastUpdated: string;
}

export type WeatherCategory = 
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunderstorm';

export interface WeatherConditionInfo {
  label: string;
  category: WeatherCategory;
  isRainy: boolean;
}
