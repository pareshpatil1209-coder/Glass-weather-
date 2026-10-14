import { DailyForecastItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatWeekday, formatTemp } from '../utils/units';
import { getWeatherCondition } from '../utils/weatherCodes';
import { WeatherIcon, DropletIcon } from './WeatherIcons';

interface WeekListProps {
  daily: DailyForecastItem[];
  currentTemp: number;
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

export function WeekList({ daily, currentTemp, mood, unitSettings }: WeekListProps) {
  const theme = MOOD_THEMES[mood];

  if (!daily || daily.length === 0) return null;

  // Calculate week min and max across all 7 days
  const weekMin = Math.min(...daily.map((d) => d.tempMin));
  const weekMax = Math.max(...daily.map((d) => d.tempMax));
  const tempSpan = Math.max(weekMax - weekMin, 1);

  return (
    <section
      className="w-full px-4 my-3"
      style={{ marginBottom: 'calc(120px + env(safe-area-inset-bottom, 0px))' }}
    >
      {/* Section label */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <span
          className="text-[13px] font-[600] uppercase tracking-[0.08em]"
          style={{ color: theme.textSecondary }}
        >
          7-Day Forecast
        </span>
      </div>

      {/* Glass card container */}
      <div
        className="w-full rounded-[30px] backdrop-blur-[24px] saturate-[160%] overflow-hidden shadow-lg"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          borderWidth: '1px',
          boxShadow: `${theme.cardShadow}, inset 0 1px 0 ${theme.topHighlight}`,
        }}
      >
        <div className="flex flex-col">
          {daily.slice(0, 7).map((item, index) => {
            const isToday = index === 0;
            const dayLabel = isToday ? 'Today' : formatWeekday(item.date);
            const condition = getWeatherCondition(item.weatherCode);

            // Min and Max range bar calculations
            const leftOffset = Math.max(0, ((item.tempMin - weekMin) / tempSpan) * 100);
            const barWidth = Math.max(12, ((item.tempMax - item.tempMin) / tempSpan) * 100);

            // Today current temp dot
            const currentDotPos = isToday
              ? Math.min(Math.max(((currentTemp - weekMin) / tempSpan) * 100, 2), 98)
              : null;

            const showRainChance = item.precipitationProbabilityMax >= 30;

            return (
              <div key={item.date} className="flex flex-col">
                <div className="h-[56px] px-5 flex items-center justify-between gap-3 text-sm">
                  {/* Day Name */}
                  <div className="w-16 flex-shrink-0 flex flex-col">
                    <span
                      className={`font-medium ${isToday ? 'font-bold' : ''}`}
                      style={{ color: theme.textColor }}
                    >
                      {dayLabel}
                    </span>
                  </div>

                  {/* Icon & Rain probability */}
                  <div className="w-14 flex-shrink-0 flex items-center gap-1.5 justify-start">
                    <WeatherIcon
                      category={condition.category}
                      isDay={1}
                      size={20}
                      className="stroke-[1.8] flex-shrink-0"
                    />
                    {showRainChance ? (
                      <span className="text-[11px] font-semibold text-blue-500 flex items-center">
                        <DropletIcon size={10} className="stroke-[2] mr-0.5" />
                        {item.precipitationProbabilityMax}%
                      </span>
                    ) : (
                      <div className="w-5" />
                    )}
                  </div>

                  {/* Low Temp */}
                  <span
                    className="w-8 text-right font-outfit text-[14px] font-[400] opacity-75"
                    style={{ color: theme.textSecondary }}
                  >
                    {formatTemp(item.tempMin, unitSettings.temp)}
                  </span>

                  {/* Range Bar */}
                  <div className="relative flex-1 h-1.5 bg-black/10 dark:bg-white/10 rounded-full mx-1">
                    <div
                      className="absolute top-0 h-full rounded-full transition-all duration-500"
                      style={{
                        left: `${leftOffset}%`,
                        width: `${barWidth}%`,
                        background: 'linear-gradient(90deg, #38BDF8 0%, #F59E0B 100%)',
                      }}
                    />
                    {/* Current Temp Dot for Today */}
                    {isToday && currentDotPos !== null && (
                      <div
                        className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-black/25 shadow-md transform -translate-x-1/2"
                        style={{ left: `${currentDotPos}%` }}
                        title={`Current: ${formatTemp(currentTemp, unitSettings.temp)}`}
                      />
                    )}
                  </div>

                  {/* High Temp */}
                  <span
                    className="w-8 text-right font-outfit text-[14px] font-[500]"
                    style={{ color: theme.textColor }}
                  >
                    {formatTemp(item.tempMax, unitSettings.temp)}
                  </span>
                </div>

                {/* Hairline divider */}
                {index < daily.length - 1 && (
                  <div
                    className="w-full h-[1px] ml-5 mr-5"
                    style={{ background: theme.dividerColor }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
