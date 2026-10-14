import { CurrentWeatherData, HourlyForecastItem, UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { formatWind, formatPressure, formatVisibility, formatTemp } from '../utils/units';
import { getCompassDirection } from '../utils/compass';
import { getLunarPhase } from '../utils/lunarPhase';
import { DetailCard } from './DetailCard';
import {
  DropletIcon,
  WindIcon,
  UvIcon,
  EyeIcon,
  GaugeIcon,
  UmbrellaIcon,
  ArrowUpIcon,
  MoonPhaseIcon,
} from './WeatherIcons';

interface DetailsGridProps {
  current: CurrentWeatherData;
  hourlyFirst?: HourlyForecastItem;
  mood: WeatherMood;
  unitSettings: UnitSettings;
}

export function DetailsGrid({ current, hourlyFirst, mood, unitSettings }: DetailsGridProps) {
  const theme = MOOD_THEMES[mood];

  // Wind formatting
  const windInfo = formatWind(current.windSpeed, unitSettings.wind);
  const gustInfo = formatWind(current.windGusts, unitSettings.wind);
  const compassDir = getCompassDirection(current.windDirection);

  // Pressure formatting
  const pressureInfo = formatPressure(current.surfacePressure, unitSettings.pressure);
  const pressureTrend = current.surfacePressure > 1016 ? 'Rising' : current.surfacePressure < 1008 ? 'Falling' : 'Steady';

  // Visibility formatting
  const visibilityInfo = formatVisibility(hourlyFirst?.visibility ?? 10000, unitSettings.wind);

  // Humidity & Dew Point
  const dewPointCelsius = hourlyFirst?.dewPoint ?? (current.temperature - (100 - current.relativeHumidity) / 5);
  const dewPointStr = formatTemp(dewPointCelsius, unitSettings.temp);

  // Rain Chance
  const rainChance = hourlyFirst?.precipitationProbability ?? 0;

  // UV index category
  const uvValue = hourlyFirst?.uvIndex ?? (current.isDay ? 3.5 : 0);
  const uvCategory =
    uvValue <= 2 ? 'Low' : uvValue <= 5 ? 'Moderate' : uvValue <= 7 ? 'High' : uvValue <= 10 ? 'Very High' : 'Extreme';
  const uvPercent = Math.min(Math.max((uvValue / 11) * 100, 4), 96);

  // Lunar Phase approximation based on current date
  const lunar = getLunarPhase(current.time);

  return (
    <section className="w-full px-4 my-3">
      {/* Section label */}
      <div className="flex items-center justify-between mb-2.5 px-2">
        <span
          className="text-[13px] font-[600] uppercase tracking-[0.08em]"
          style={{ color: theme.textSecondary }}
        >
          Weather Details
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* 1. Humidity */}
        <DetailCard
          mood={mood}
          icon={<DropletIcon size={16} />}
          label="Humidity"
          value={Math.round(current.relativeHumidity)}
          unit="%"
          caption={`Dew point is ${dewPointStr}`}
          bottomSlot={
            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${current.relativeHumidity}%`,
                  background: 'linear-gradient(90deg, #38BDF8, #0284C7)',
                }}
              />
            </div>
          }
        />

        {/* 2. Wind */}
        <DetailCard
          mood={mood}
          icon={<WindIcon size={16} />}
          label="Wind"
          value={windInfo.value}
          unit={windInfo.unit}
          caption={`${compassDir} · Gusts up to ${gustInfo.value} ${gustInfo.unit}`}
          topRightSlot={
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 transition-transform duration-700"
              style={{
                transform: `rotate(${current.windDirection}deg)`,
                color: theme.textColor,
              }}
              title={`Wind from ${current.windDirection}°`}
            >
              <ArrowUpIcon size={14} />
            </div>
          }
        />

        {/* 3. UV Index */}
        <DetailCard
          mood={mood}
          icon={<UvIcon size={16} />}
          label="UV Index"
          value={uvValue.toFixed(0)}
          unit=""
          caption={`${uvCategory} exposure`}
          bottomSlot={
            <div className="relative w-full h-1.5 rounded-full overflow-visible">
              <div
                className="w-full h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, #22C55E 0%, #EAB308 35%, #F97316 65%, #EF4444 85%, #A855F7 100%)',
                }}
              />
              <div
                className="absolute -top-1 w-3.5 h-3.5 rounded-full bg-white ring-2 ring-black/20 shadow-md transform -translate-x-1/2 transition-all duration-500"
                style={{ left: `${uvPercent}%` }}
              />
            </div>
          }
        />

        {/* 4. Rain Chance */}
        <DetailCard
          mood={mood}
          icon={<UmbrellaIcon size={16} />}
          label="Precipitation"
          value={rainChance}
          unit="%"
          caption={rainChance > 30 ? 'Rain likely today' : 'Low probability'}
          bottomSlot={
            <div className="w-full h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${rainChance}%`,
                  background: 'linear-gradient(90deg, #60A5FA, #2563EB)',
                }}
              />
            </div>
          }
        />

        {/* 5. Visibility */}
        <DetailCard
          mood={mood}
          icon={<EyeIcon size={16} />}
          label="Visibility"
          value={visibilityInfo.value}
          unit={visibilityInfo.unit}
          caption={parseFloat(visibilityInfo.value) >= 10 ? 'Clear line of sight' : 'Reduced visibility'}
        />

        {/* 6. Pressure */}
        <DetailCard
          mood={mood}
          icon={<GaugeIcon size={16} />}
          label="Pressure"
          value={pressureInfo.value}
          unit={pressureInfo.unit}
          caption={`${pressureTrend} barometric reading`}
        />

        {/* 7. Lunar Phase */}
        <DetailCard
          mood={mood}
          className="col-span-2"
          icon={<MoonPhaseIcon phaseKey={lunar.key} size={16} />}
          label="Lunar Phase"
          value={lunar.name}
          valueClassName="text-[24px] sm:text-[26px] font-[300] tracking-tight"
          unit=""
          caption={
            <div className="flex items-center justify-between w-full text-[12px] pt-1">
              <span>{lunar.stageDescription}</span>
              <span className="font-semibold opacity-90">
                {lunar.daysToFullMoon === 0 ? 'Full moon tonight' : `Full moon in ${lunar.daysToFullMoon}d`}
              </span>
            </div>
          }
          topRightSlot={
            <div className="flex items-center gap-2">
              <span className="text-[12px] font-semibold opacity-80" style={{ color: theme.textSecondary }}>
                {lunar.illumination}% lit
              </span>
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 shadow-sm"
                style={{ color: theme.textColor }}
              >
                <MoonPhaseIcon phaseKey={lunar.key} size={18} />
              </div>
            </div>
          }
          bottomSlot={
            <div className="w-full space-y-1">
              <div className="relative w-full h-1.5 rounded-full overflow-hidden bg-black/10 dark:bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${Math.max(lunar.illumination, 4)}%`,
                    background: 'linear-gradient(90deg, #A78BFA 0%, #C084FC 50%, #FDE047 100%)',
                  }}
                />
              </div>
              <div
                className="flex justify-between text-[10.5px] font-medium opacity-65 pt-0.5"
                style={{ color: theme.textSecondary }}
              >
                <span>New Moon</span>
                <span>Age {lunar.ageDays}d / 29.5d</span>
                <span>Full Moon</span>
              </div>
            </div>
          }
        />
      </div>
    </section>
  );
}
