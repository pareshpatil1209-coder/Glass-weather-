import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';

interface OfflineIndicatorProps {
  mood: WeatherMood;
}

export function OfflineIndicator({ mood }: OfflineIndicatorProps) {
  const isOnline = useOnlineStatus();
  const theme = MOOD_THEMES[mood];

  if (isOnline) return null;

  return (
    <div
      className="mx-4 mt-2 px-3.5 py-1.5 rounded-full backdrop-blur-md flex items-center justify-center gap-2 text-xs font-semibold shadow-md z-30 transition-all border border-amber-500/30"
      style={{
        background: theme.isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(254, 243, 199, 0.90)',
        color: theme.isDark ? '#FDE68A' : '#92400E',
      }}
    >
      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
      <span>Offline Mode · Displaying cached forecast</span>
    </div>
  );
}
