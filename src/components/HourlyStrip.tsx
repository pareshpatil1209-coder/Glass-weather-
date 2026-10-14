import { HourlyForecastItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatHourTime, formatTemp } from '../utils/units';
import { getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon } from './WeatherIcons';

interface HourlyStripProps {
  hourly: HourlyForecastItem[];
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

export function HourlyStrip({ hourly, mood, unitSettings }: HourlyStripProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div className="w-full px-4 my-3">
      {/* Section label */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <span
          className="text-[13px] font-[600] uppercase tracking-[0.08em]"
          style={{ color: theme.textSecondary }}
        >
          Hourly Forecast
        </span>
        <span
          className="text-[12px] font-medium opacity-75"
          style={{ color: theme.textSecondary }}
        >
          Next 24 Hours
        </span>
      </div>

      {/* Horizontally scrolling glass capsule strip */}
      <div
        className="w-full p-2.5 rounded-[32px] backdrop-blur-[24px] saturate-[160%] shadow-lg overflow-hidden"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          borderWidth: '1px',
          boxShadow: `${theme.cardShadow}, inset 0 1px 0 ${theme.topHighlight}`,
        }}
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory py-1 px-1">
          {hourly.map((item, index) => {
            const isNow = index === 0;
            const timeLabel = isNow ? 'Now' : formatHourTime(item.time);
            const condition = getWeatherCondition(item.weatherCode);
            const tempStr = formatTemp(item.temperature, unitSettings.temp);

            return (
              <div
                key={item.time}
                className={`flex-shrink-0 w-[60px] h-[120px] rounded-[24px] flex flex-col items-center justify-between py-3.5 snap-center transition-all ${
                  isNow ? 'scale-[1.02] shadow-md' : 'opacity-90 hover:opacity-100'
                }`}
                style={{
                  background: isNow ? theme.activePillBg : 'rgba(255, 255, 255, 0.08)',
                  borderColor: isNow ? theme.cardBorder : 'rgba(255, 255, 255, 0.12)',
                  borderWidth: '1px',
                  color: isNow ? theme.activePillText : theme.textColor,
                }}
              >
                {/* Time */}
                <span className={`text-[12px] font-semibold ${isNow ? 'opacity-100' : 'opacity-80'}`}>
                  {timeLabel}
                </span>

                {/* Weather icon */}
                <div className="my-auto flex items-center justify-center">
                  <WeatherIcon
                    category={condition.category}
                    isDay={item.isDay}
                    size={22}
                    className="stroke-[1.8]"
                  />
                </div>

                {/* Temperature */}
                <span className="font-outfit text-[16px] font-[500] tracking-tight">
                  {tempStr}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
