import { TempUnit, WindUnit, PressureUnit } from '../types/weather';

export function formatTemp(celsius: number, unit: TempUnit = 'celsius'): string {
  if (unit === 'fahrenheit') {
    const f = Math.round((celsius * 9) / 5 + 32);
    return `${f}°`;
  }
  return `${Math.round(celsius)}°`;
}

export function formatTempNumber(celsius: number, unit: TempUnit = 'celsius'): number {
  if (unit === 'fahrenheit') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatWind(kmh: number, unit: WindUnit = 'kmh'): { value: string; unit: string } {
  if (unit === 'mph') {
    const mph = Math.round(kmh * 0.621371);
    return { value: `${mph}`, unit: 'mph' };
  }
  return { value: `${Math.round(kmh)}`, unit: 'km/h' };
}

export function formatPressure(hpa: number, unit: PressureUnit = 'hpa'): { value: string; unit: string } {
  if (unit === 'inhg') {
    const inhg = (hpa * 0.02953).toFixed(2);
    return { value: inhg, unit: 'inHg' };
  }
  return { value: `${Math.round(hpa)}`, unit: 'hPa' };
}

export function formatVisibility(meters: number, unit: WindUnit = 'kmh'): { value: string; unit: string } {
  if (unit === 'mph') {
    const miles = (meters / 1000) * 0.621371;
    return { value: miles >= 10 ? Math.round(miles).toString() : miles.toFixed(1), unit: 'mi' };
  }
  const km = meters / 1000;
  return { value: km >= 10 ? Math.round(km).toString() : km.toFixed(1), unit: 'km' };
}

export function formatHourTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    let hours = d.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours} ${ampm}`;
  } catch {
    return isoString;
  }
}

export function formatWeekday(isoDate: string): string {
  try {
    const d = new Date(isoDate + 'T12:00:00');
    return d.toLocaleDateString('en-US', { weekday: 'short' });
  } catch {
    return 'Day';
  }
}

export function formatHeaderDate(isoString?: string): string {
  const d = isoString ? new Date(isoString) : new Date();
  const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-US', { month: 'short' });
  return `${weekday} ${day} ${month}`;
}
