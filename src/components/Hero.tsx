import { motion } from 'motion/react';
import { CurrentWeatherData, DailyForecastItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { getWeatherCondition } from '../utils/weatherCodes';
import { formatTemp } from '../utils/units';
import { WeatherIllustration } from './WeatherIllustration';

interface HeroProps {
  current: CurrentWeatherData;
  todayDaily?: DailyForecastItem;
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

export function Hero({ current, todayDaily, mood, unitSettings }: HeroProps) {
  const theme = MOOD_THEMES[mood];
  const condition = getWeatherCondition(current.weatherCode);

  const formattedTemp = formatTemp(current.temperature, unitSettings.temp);
  const formattedFeelsLike = formatTemp(current.apparentTemperature, unitSettings.temp);
  
  const highTemp = todayDaily ? formatTemp(todayDaily.tempMax, unitSettings.temp) : formattedTemp;
  const lowTemp = todayDaily ? formatTemp(todayDaily.tempMin, unitSettings.temp) : formattedTemp;

  return (
    <section className="relative flex flex-col items-center justify-center pt-2 pb-6 px-4">
      {/* 3D Soft Weather Illustration */}
      <div className="w-full flex justify-center mb-1">
        <WeatherIllustration
          category={condition.category}
          isDay={current.isDay}
        />
      </div>

      {/* Huge 140px Hero Temperature */}
      <motion.div
        key={`${current.temperature}-${unitSettings.temp}`}
        initial={{ opacity: 0, y: 12, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="font-outfit font-[200] leading-none select-none tracking-[-6px] pl-3"
        style={{
          fontSize: '136px',
          color: theme.textColor,
          textShadow: theme.isDark 
            ? '0 8px 32px rgba(0,0,0,0.45)' 
            : '0 6px 24px rgba(255,255,255,0.7)',
        }}
      >
        {formattedTemp}
      </motion.div>

      {/* Weather condition description (26px, weight 500) */}
      <motion.h2
        key={condition.label}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="text-[26px] font-[500] tracking-tight text-center mt-1 mb-4"
        style={{ color: theme.textColor }}
      >
        {condition.label}
      </motion.h2>

      {/* Two Liquid Glass Pills */}
      <div className="flex items-center gap-3">
        {/* Feels like pill */}
        <div
          className="px-4 py-2 rounded-full text-[14px] font-medium backdrop-blur-md transition-transform active:scale-95 shadow-sm"
          style={{
            background: theme.pillBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
            boxShadow: `inset 0 1px 0 ${theme.topHighlight}`,
          }}
        >
          Feels like {formattedFeelsLike}
        </div>

        {/* High / Low pill */}
        <div
          className="px-4 py-2 rounded-full text-[14px] font-medium backdrop-blur-md transition-transform active:scale-95 shadow-sm"
          style={{
            background: theme.pillBg,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
            color: theme.textColor,
            boxShadow: `inset 0 1px 0 ${theme.topHighlight}`,
          }}
        >
          H {highTemp} &nbsp;L {lowTemp}
        </div>
      </div>
    </section>
  );
}
