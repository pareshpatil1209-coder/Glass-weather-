import { LocationItem, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatHeaderDate } from '../utils/units';
import { LocationPinIcon, SearchIcon, SettingsIcon, RefreshCwIcon } from './WeatherIcons';

interface HeaderProps {
  location: LocationItem;
  mood: WeatherMood;
  lastUpdated?: string;
  isRefreshing?: boolean;
  onRefresh?: () => void;
  onOpenSearch: () => void;
  onOpenSettings: () => void;
  onResetToCurrentLocation?: () => void;
}

export function Header({
  location,
  mood,
  lastUpdated,
  isRefreshing,
  onRefresh,
  onOpenSearch,
  onOpenSettings,
  onResetToCurrentLocation,
}: HeaderProps) {
  const theme = MOOD_THEMES[mood];
  const dateFormatted = formatHeaderDate();

  return (
    <header
      className="relative z-20 flex items-center justify-between px-5 pb-3"
      style={{ paddingTop: 'max(20px, calc(12px + env(safe-area-inset-top, 0px)))' }}
    >
      {/* Left: Location Pin button */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onResetToCurrentLocation}
          aria-label={location.isCurrentLocation ? 'Current GPS Location' : 'Locate current position'}
          className="relative w-11 h-11 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-sm"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
            boxShadow: `inset 0 1px 0 ${theme.topHighlight}`,
          }}
        >
          <LocationPinIcon size={20} className={location.isCurrentLocation ? 'text-blue-500' : ''} />
          {location.isCurrentLocation && (
            <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-500 ring-2 ring-white/80" />
          )}
        </button>

        {/* City and date info */}
        <div className="flex flex-col">
          <h1
            className="text-[22px] font-semibold tracking-tight leading-tight line-clamp-1"
            style={{ color: theme.textColor }}
          >
            {location.name}
          </h1>
          <div
            className="text-[13px] font-medium tracking-normal opacity-85 flex items-center gap-1.5"
            style={{ color: theme.textSecondary }}
          >
            <span>{location.isCurrentLocation ? 'Current location' : (location.country || 'Saved')}</span>
            <span>·</span>
            <span>{dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Right: Actions (Refresh, Search, Settings) */}
      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            aria-label="Refresh weather data"
            title={lastUpdated ? `Updated at ${lastUpdated}` : 'Refresh'}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
            style={{
              background: theme.cardBg,
              borderColor: theme.cardBorder,
              borderWidth: '1px',
              color: theme.textColor,
            }}
          >
            <RefreshCwIcon
              size={18}
              className={isRefreshing ? 'animate-spin' : ''}
            />
          </button>
        )}

        <button
          type="button"
          onClick={onOpenSearch}
          aria-label="Search cities"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
          }}
        >
          <SearchIcon size={19} />
        </button>

        <button
          type="button"
          onClick={onOpenSettings}
          aria-label="Weather settings and units"
          className="w-10 h-10 rounded-full flex items-center justify-center transition-transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/40"
          style={{
            background: theme.cardBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
          }}
        >
          <SettingsIcon size={19} />
        </button>
      </div>
    </header>
  );
}
