import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';

interface SkeletonLoaderProps {
  mood: WeatherMood;
}

export function SkeletonLoader({ mood }: SkeletonLoaderProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div className="w-full px-5 py-4 flex flex-col items-center animate-pulse space-y-5">
      {/* Hero illustration placeholder */}
      <div className="w-40 h-40 rounded-full bg-white/20 backdrop-blur-md mb-2" />

      {/* Hero Temp skeleton */}
      <div className="w-56 h-28 rounded-3xl bg-white/20 backdrop-blur-md" />

      {/* Condition & pill skeleton */}
      <div className="w-36 h-7 rounded-full bg-white/20" />
      <div className="flex gap-3">
        <div className="w-28 h-8 rounded-full bg-white/20" />
        <div className="w-28 h-8 rounded-full bg-white/20" />
      </div>

      {/* Hourly strip skeleton */}
      <div
        className="w-full h-36 rounded-[30px] p-4 flex gap-3 overflow-hidden backdrop-blur-xl"
        style={{ background: theme.cardBg, borderColor: theme.cardBorder, borderWidth: '1px' }}
      >
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="w-14 h-full rounded-2xl bg-white/20 flex-shrink-0" />
        ))}
      </div>

      {/* Grid skeleton */}
      <div className="w-full grid grid-cols-2 gap-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-28 rounded-[28px] backdrop-blur-xl p-4 flex flex-col justify-between"
            style={{ background: theme.cardBg, borderColor: theme.cardBorder, borderWidth: '1px' }}
          >
            <div className="w-16 h-3 rounded-full bg-white/20" />
            <div className="w-12 h-6 rounded-md bg-white/25" />
            <div className="w-20 h-2.5 rounded-full bg-white/15" />
          </div>
        ))}
        {/* Lunar Phase skeleton */}
        <div
          className="col-span-2 h-32 rounded-[28px] backdrop-blur-xl p-4 flex flex-col justify-between"
          style={{ background: theme.cardBg, borderColor: theme.cardBorder, borderWidth: '1px' }}
        >
          <div className="flex justify-between">
            <div className="w-24 h-3 rounded-full bg-white/20" />
            <div className="w-8 h-8 rounded-full bg-white/20" />
          </div>
          <div className="w-36 h-6 rounded-md bg-white/25" />
          <div className="w-full h-2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}
