import React from 'react';
import { WeatherCategory } from '../types/weather';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  className?: string;
}

export function SunIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v2.5" />
      <path d="M12 19v2.5" />
      <path d="M4.93 4.93l1.77 1.77" />
      <path d="M17.3 17.3l1.77 1.77" />
      <path d="M2.5 12h2.5" />
      <path d="M19 12h2.5" />
      <path d="M4.93 19.07l1.77-1.77" />
      <path d="M17.3 6.7l1.77-1.77" />
    </svg>
  );
}

export function MoonIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-5.4-5.4c0-1.81.89-3.42 2.26-4.4A9.15 9.15 0 0 0 12 3z" />
    </svg>
  );
}

export function CloudIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17.5 19H7a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.47-1.83A4.5 4.5 0 0 1 17.5 19z" />
    </svg>
  );
}

export function SunCloudIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 3v1.5" />
      <path d="M18.36 5.64l-1.06 1.06" />
      <path d="M19.5 10.5H21" />
      <path d="M15.5 8.5A4 4 0 0 0 10 5.2" />
      <path d="M16 19.5H7.5a4 4 0 0 1-.4-7.98 5 5 0 0 1 9.5-1.27A3.75 3.75 0 0 1 16 19.5z" />
    </svg>
  );
}

export function MoonCloudIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M10.2 4.1a4.5 4.5 0 0 1 4.3 4.3" />
      <path d="M17 19.5H7.5a4 4 0 0 1-.4-7.98 5 5 0 0 1 9.5-1.27A3.75 3.75 0 0 1 17 19.5z" />
    </svg>
  );
}

export function RainIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 15H7a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.47-1.83A4.5 4.5 0 0 1 17 15z" />
      <path d="M8 18.5l-1 2" />
      <path d="M12 18.5l-1 2" />
      <path d="M16 18.5l-1 2" />
    </svg>
  );
}

export function DrizzleIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 14H7a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.47-1.83A4.5 4.5 0 0 1 17 14z" />
      <path d="M9 18v1" />
      <path d="M13 17v1.5" />
      <path d="M17 18v1" />
    </svg>
  );
}

export function ThunderstormIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 14H7a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.47-1.83A4.5 4.5 0 0 1 17 14z" />
      <path d="M12.5 15l-2.5 4h3l-1.5 3.5" />
    </svg>
  );
}

export function SnowIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M17 14H7a4.5 4.5 0 0 1-.5-8.97 6 6 0 0 1 11.47-1.83A4.5 4.5 0 0 1 17 14z" />
      <circle cx="8" cy="18" r="0.8" fill="currentColor" />
      <circle cx="12" cy="20" r="0.8" fill="currentColor" />
      <circle cx="16" cy="18" r="0.8" fill="currentColor" />
    </svg>
  );
}

export function FogIcon({ size = 24, className = '', ...props }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M4 11h16" />
      <path d="M3 15h18" />
      <path d="M6 19h12" />
      <path d="M17 7.5a4 4 0 0 0-7.8-1.2A3.5 3.5 0 0 0 4.5 9" />
    </svg>
  );
}

// Selector helper for Weather Category + Day/Night
export function WeatherIcon({
  category,
  isDay = 1,
  size = 24,
  className = '',
}: {
  category: WeatherCategory;
  isDay?: number;
  size?: number | string;
  className?: string;
}) {
  switch (category) {
    case 'clear':
      return isDay ? <SunIcon size={size} className={className} /> : <MoonIcon size={size} className={className} />;
    case 'partly_cloudy':
      return isDay ? <SunCloudIcon size={size} className={className} /> : <MoonCloudIcon size={size} className={className} />;
    case 'cloudy':
      return <CloudIcon size={size} className={className} />;
    case 'fog':
      return <FogIcon size={size} className={className} />;
    case 'drizzle':
      return <DrizzleIcon size={size} className={className} />;
    case 'rain':
      return <RainIcon size={size} className={className} />;
    case 'snow':
      return <SnowIcon size={size} className={className} />;
    case 'thunderstorm':
      return <ThunderstormIcon size={size} className={className} />;
    default:
      return isDay ? <SunIcon size={size} className={className} /> : <MoonIcon size={size} className={className} />;
  }
}

/* UI Stroke Icons */
export function LocationPinIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21c-4-4.5-7-8.2-7-12a7 7 0 1 1 14 0c0 3.8-3 7.5-7 12z" />
      <circle cx="12" cy="9" r="2.5" />
    </svg>
  );
}

export function SearchIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  );
}

export function SettingsIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

export function MapTabIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="1 6 8 2 16 6 23 2 23 18 16 22 8 18 1 22 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

export function BookmarkIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  );
}

export function DropletIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
    </svg>
  );
}

export function WindIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M9.59 4.59A2 2 0 1 1 11 8H2" />
      <path d="M12.59 19.41A2 2 0 1 0 14 16H2" />
      <path d="M17.73 7.73A2.5 2.5 0 1 1 19.5 12H2" />
    </svg>
  );
}

export function UvIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3.5" />
      <line x1="12" y1="20.5" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="6" y2="6" />
      <line x1="18" y1="18" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3.5" y2="12" />
      <line x1="20.5" y1="12" x2="23" y2="12" />
    </svg>
  );
}

export function EyeIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

export function GaugeIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 21a9 9 0 1 1 9-9c0 1.3-.27 2.53-.76 3.65" />
      <line x1="12" y1="12" x2="16.5" y2="7.5" />
      <circle cx="12" cy="12" r="1.5" />
    </svg>
  );
}

export function UmbrellaIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M23 12a11.05 11.05 0 0 0-22 0zm-5 7a3 3 0 0 1-6 0v-7" />
    </svg>
  );
}

export function ArrowUpIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  );
}

export function PlusIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export function CloseIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function CheckIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function TrashIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

export function RefreshCwIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

export function PlayIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function PauseIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity="0.2" />
      <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}

export function LayersIcon({ size = 20, className = '' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  );
}

export function MoonPhaseIcon({
  phaseKey,
  size = 20,
  className = '',
}: {
  phaseKey: string;
  size?: number | string;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* Outer Moon Rim */}
      <circle cx="12" cy="12" r="9" />

      {/* Internal illumination based on phase */}
      {phaseKey === 'new_moon' && (
        <circle cx="12" cy="12" r="5" strokeDasharray="2 3" opacity="0.4" />
      )}

      {phaseKey === 'waxing_crescent' && (
        <path
          d="M12 3a9 9 0 0 1 0 18c-3.8 0-6-4-6-9s2.2-9 6-9z"
          fill="currentColor"
          fillOpacity="0.25"
        />
      )}

      {phaseKey === 'first_quarter' && (
        <path
          d="M12 3a9 9 0 0 1 0 18V3z"
          fill="currentColor"
          fillOpacity="0.35"
        />
      )}

      {phaseKey === 'waxing_gibbous' && (
        <path
          d="M12 3a9 9 0 0 1 0 18c3.5 0 6-4 6-9s-2.5-9-6-9z"
          fill="currentColor"
          fillOpacity="0.35"
        />
      )}

      {phaseKey === 'full_moon' && (
        <>
          <circle cx="12" cy="12" r="9" fill="currentColor" fillOpacity="0.3" />
          <circle cx="10" cy="10" r="1.5" fill="currentColor" fillOpacity="0.4" />
          <circle cx="14" cy="14" r="2" fill="currentColor" fillOpacity="0.3" />
        </>
      )}

      {phaseKey === 'waning_gibbous' && (
        <path
          d="M12 3a9 9 0 0 0 0 18c3.5 0 6-4 6-9s-2.5-9-6-9z"
          fill="currentColor"
          fillOpacity="0.35"
        />
      )}

      {phaseKey === 'last_quarter' && (
        <path
          d="M12 3a9 9 0 0 0 0 18V3z"
          fill="currentColor"
          fillOpacity="0.35"
        />
      )}

      {phaseKey === 'waning_crescent' && (
        <path
          d="M12 3a9 9 0 0 0 0 18c3.8 0 6-4 6-9s-2.2-9-6-9z"
          fill="currentColor"
          fillOpacity="0.25"
        />
      )}
    </svg>
  );
}

