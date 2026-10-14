import { WeatherCategory, WeatherConditionInfo, WeatherMood } from '../types/weather';

export function getWeatherCondition(code: number): WeatherConditionInfo {
  // WMO Weather interpretation codes (WW)
  switch (code) {
    case 0:
      return { label: 'Clear Sky', category: 'clear', isRainy: false };
    case 1:
      return { label: 'Mainly Clear', category: 'partly_cloudy', isRainy: false };
    case 2:
      return { label: 'Partly Cloudy', category: 'partly_cloudy', isRainy: false };
    case 3:
      return { label: 'Overcast', category: 'cloudy', isRainy: false };
    case 45:
      return { label: 'Foggy', category: 'fog', isRainy: false };
    case 48:
      return { label: 'Depositing Rime Fog', category: 'fog', isRainy: false };
    case 51:
      return { label: 'Light Drizzle', category: 'drizzle', isRainy: true };
    case 53:
      return { label: 'Moderate Drizzle', category: 'drizzle', isRainy: true };
    case 55:
      return { label: 'Dense Drizzle', category: 'drizzle', isRainy: true };
    case 56:
    case 57:
      return { label: 'Freezing Drizzle', category: 'drizzle', isRainy: true };
    case 61:
      return { label: 'Slight Rain', category: 'rain', isRainy: true };
    case 63:
      return { label: 'Moderate Rain', category: 'rain', isRainy: true };
    case 65:
      return { label: 'Heavy Rain', category: 'rain', isRainy: true };
    case 66:
    case 67:
      return { label: 'Freezing Rain', category: 'rain', isRainy: true };
    case 71:
      return { label: 'Slight Snow Fall', category: 'snow', isRainy: false };
    case 73:
      return { label: 'Moderate Snow Fall', category: 'snow', isRainy: false };
    case 75:
      return { label: 'Heavy Snow Fall', category: 'snow', isRainy: false };
    case 77:
      return { label: 'Snow Grains', category: 'snow', isRainy: false };
    case 80:
      return { label: 'Slight Rain Showers', category: 'rain', isRainy: true };
    case 81:
      return { label: 'Moderate Rain Showers', category: 'rain', isRainy: true };
    case 82:
      return { label: 'Violent Rain Showers', category: 'rain', isRainy: true };
    case 85:
      return { label: 'Slight Snow Showers', category: 'snow', isRainy: false };
    case 86:
      return { label: 'Heavy Snow Showers', category: 'snow', isRainy: false };
    case 95:
      return { label: 'Thunderstorm', category: 'thunderstorm', isRainy: true };
    case 96:
    case 99:
      return { label: 'Thunderstorm with Hail', category: 'thunderstorm', isRainy: true };
    default:
      return { label: 'Partly Cloudy', category: 'partly_cloudy', isRainy: false };
  }
}

/**
 * Determine weather mood:
 * - night if is_day === 0
 * - sunset within 45 min of sunrise/sunset
 * - rainy for drizzle/rain/thunderstorm codes
 * - otherwise sunny
 */
export function determineWeatherMood(
  weatherCode: number,
  isDay: number,
  currentTimeStr?: string,
  sunriseStr?: string,
  sunsetStr?: string
): WeatherMood {
  const condition = getWeatherCondition(weatherCode);

  // Check sunset/sunrise window (within 45 mins)
  if (currentTimeStr && sunriseStr && sunsetStr) {
    try {
      const now = new Date(currentTimeStr).getTime();
      const sunrise = new Date(sunriseStr).getTime();
      const sunset = new Date(sunsetStr).getTime();
      const diffSunrise = Math.abs(now - sunrise);
      const diffSunset = Math.abs(now - sunset);
      const fortyFiveMinsMs = 45 * 60 * 1000;

      if (diffSunrise <= fortyFiveMinsMs || diffSunset <= fortyFiveMinsMs) {
        return 'sunset';
      }
    } catch {
      // fallback
    }
  }

  // Night if not day
  if (isDay === 0) {
    return 'night';
  }

  // Rainy if condition is rainy or thunderstorm
  if (condition.isRainy) {
    return 'rainy';
  }

  return 'sunny';
}
