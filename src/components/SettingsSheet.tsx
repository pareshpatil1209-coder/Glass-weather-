import { motion, AnimatePresence } from 'motion/react';
import { UnitSettings, WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { CloseIcon, CheckIcon } from './WeatherIcons';
import { PWAInstallButton } from './PWAInstallButton';

interface SettingsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  unitSettings: UnitSettings;
  onUpdateUnits: (units: UnitSettings) => void;
  mood: WeatherMood;
}

export function SettingsSheet({
  isOpen,
  onClose,
  unitSettings,
  onUpdateUnits,
  mood,
}: SettingsSheetProps) {
  const theme = MOOD_THEMES[mood];

  const setTemp = (temp: 'celsius' | 'fahrenheit') => {
    onUpdateUnits({ ...unitSettings, temp });
  };

  const setWind = (wind: 'kmh' | 'mph') => {
    onUpdateUnits({ ...unitSettings, wind });
  };

  const setPressure = (pressure: 'hpa' | 'inhg') => {
    onUpdateUnits({ ...unitSettings, pressure });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed bottom-0 left-1/2 -translate-x-1/2 z-50 w-full max-w-[430px] rounded-t-[36px] backdrop-blur-[28px] saturate-[170%] p-6 flex flex-col shadow-2xl"
            style={{
              background: theme.isDark
                ? 'linear-gradient(180deg, rgba(30, 25, 55, 0.95) 0%, rgba(15, 12, 35, 0.98) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(240, 245, 255, 0.98) 100%)',
              borderColor: theme.cardBorder,
              borderWidth: '1px 1px 0 1px',
              borderStyle: 'solid',
            }}
          >
            {/* Grabber */}
            <div className="w-12 h-1.5 rounded-full bg-slate-400/40 self-center mb-5 cursor-pointer" onClick={onClose} />

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold tracking-tight" style={{ color: theme.textColor }}>
                  Weather Settings
                </h3>
                <p className="text-xs font-medium opacity-75 mt-0.5" style={{ color: theme.textSecondary }}>
                  Customize measurement units and preferences
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close settings"
                className="w-9 h-9 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10 transition-transform active:scale-95"
                style={{ color: theme.textColor }}
              >
                <CloseIcon size={18} />
              </button>
            </div>

            {/* Unit Toggles */}
            <div className="space-y-5 pb-6">
              {/* Temperature Unit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.textSecondary }}>
                  Temperature
                </label>
                <div
                  className="grid grid-cols-2 p-1.5 rounded-full"
                  style={{
                    background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setTemp('celsius')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.temp === 'celsius'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.temp === 'celsius' ? theme.activePillBg : 'transparent',
                      color: unitSettings.temp === 'celsius' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.temp === 'celsius' && <CheckIcon size={15} />}
                    Celsius (°C)
                  </button>
                  <button
                    type="button"
                    onClick={() => setTemp('fahrenheit')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.temp === 'fahrenheit'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.temp === 'fahrenheit' ? theme.activePillBg : 'transparent',
                      color: unitSettings.temp === 'fahrenheit' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.temp === 'fahrenheit' && <CheckIcon size={15} />}
                    Fahrenheit (°F)
                  </button>
                </div>
              </div>

              {/* Wind Speed Unit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.textSecondary }}>
                  Wind Speed
                </label>
                <div
                  className="grid grid-cols-2 p-1.5 rounded-full"
                  style={{
                    background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setWind('kmh')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.wind === 'kmh'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.wind === 'kmh' ? theme.activePillBg : 'transparent',
                      color: unitSettings.wind === 'kmh' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.wind === 'kmh' && <CheckIcon size={15} />}
                    km/h
                  </button>
                  <button
                    type="button"
                    onClick={() => setWind('mph')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.wind === 'mph'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.wind === 'mph' ? theme.activePillBg : 'transparent',
                      color: unitSettings.wind === 'mph' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.wind === 'mph' && <CheckIcon size={15} />}
                    mph
                  </button>
                </div>
              </div>

              {/* Atmospheric Pressure Unit */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.textSecondary }}>
                  Atmospheric Pressure
                </label>
                <div
                  className="grid grid-cols-2 p-1.5 rounded-full"
                  style={{
                    background: theme.isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setPressure('hpa')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.pressure === 'hpa'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.pressure === 'hpa' ? theme.activePillBg : 'transparent',
                      color: unitSettings.pressure === 'hpa' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.pressure === 'hpa' && <CheckIcon size={15} />}
                    Hectopascals (hPa)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPressure('inhg')}
                    className={`min-h-[44px] rounded-full text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      unitSettings.pressure === 'inhg'
                        ? 'shadow-md scale-[1.01]'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                    style={{
                      background: unitSettings.pressure === 'inhg' ? theme.activePillBg : 'transparent',
                      color: unitSettings.pressure === 'inhg' ? theme.activePillText : theme.textColor,
                    }}
                  >
                    {unitSettings.pressure === 'inhg' && <CheckIcon size={15} />}
                    Inches of Mercury (inHg)
                  </button>
                </div>
              </div>

              {/* PWA Installation Option */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: theme.textSecondary }}>
                  Install Application
                </label>
                <PWAInstallButton mood={mood} variant="settings" />
              </div>

              {/* About app notice */}
              <div
                className="mt-4 p-4 rounded-2xl text-xs font-medium space-y-1"
                style={{
                  background: theme.isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)',
                  color: theme.textSecondary,
                }}
              >
                <div className="font-semibold" style={{ color: theme.textColor }}>
                  Glass Weather
                </div>
                <div>Powered by Open-Meteo & RainViewer public radar. Designed with Google × Liquid Glass aesthetic.</div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
