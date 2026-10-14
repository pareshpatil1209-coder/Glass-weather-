import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { RefreshCwIcon } from './WeatherIcons';

interface ErrorCardProps {
  message: string;
  onRetry: () => void;
  mood: WeatherMood;
}

export function ErrorCard({ message, onRetry, mood }: ErrorCardProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div className="w-full px-5 py-12 flex flex-col items-center justify-center text-center">
      <div
        className="max-w-[340px] p-6 rounded-[32px] backdrop-blur-[24px] saturate-[160%] shadow-xl flex flex-col items-center"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          borderWidth: '1px',
          boxShadow: theme.cardShadow,
        }}
      >
        <div
          className="w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-rose-500/10 text-rose-500"
        >
          <RefreshCwIcon size={24} />
        </div>

        <h3 className="text-lg font-bold mb-1" style={{ color: theme.textColor }}>
          Weather Unavailable
        </h3>

        <p className="text-sm opacity-80 mb-5 leading-relaxed" style={{ color: theme.textSecondary }}>
          {message}
        </p>

        <button
          type="button"
          onClick={onRetry}
          className="px-6 py-2.5 rounded-full font-bold text-sm shadow-md transition-transform active:scale-95 flex items-center gap-2"
          style={{
            background: theme.activePillBg,
            color: theme.activePillText,
          }}
        >
          <RefreshCwIcon size={16} />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
}
