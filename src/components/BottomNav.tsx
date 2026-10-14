import { motion } from 'motion/react';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { SunCloudIcon, MapTabIcon, BookmarkIcon } from './WeatherIcons';

export type NavTab = 'weather' | 'map' | 'saved';

interface BottomNavProps {
  activeTab: NavTab;
  onChangeTab: (tab: NavTab) => void;
  mood: WeatherMood;
}

const TABS: { id: NavTab; label: string; icon: typeof SunCloudIcon }[] = [
  { id: 'weather', label: 'Weather', icon: SunCloudIcon },
  { id: 'map', label: 'Map', icon: MapTabIcon },
  { id: 'saved', label: 'Saved', icon: BookmarkIcon },
];

export function BottomNav({ activeTab, onChangeTab, mood }: BottomNavProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <nav
      aria-label="Main Navigation"
      className="fixed left-1/2 -translate-x-1/2 z-40 w-[calc(100%-48px)] max-w-[370px] select-none"
      style={{
        bottom: 'calc(28px + env(safe-area-inset-bottom, 0px))',
      }}
    >
      <div
        className="relative flex items-center justify-between p-1.5 rounded-full backdrop-blur-[24px] saturate-[160%] shadow-xl"
        style={{
          background: theme.cardBg,
          borderColor: theme.cardBorder,
          borderWidth: '1px',
          boxShadow: `${theme.cardShadow}, inset 0 1px 0 ${theme.topHighlight}`,
        }}
      >
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onChangeTab(tab.id)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className="relative flex-1 py-2.5 px-3 rounded-full flex items-center justify-center gap-2 text-sm font-semibold transition-colors duration-200 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60 min-h-[44px]"
              style={{
                color: isActive ? theme.activePillText : theme.textSecondary,
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabPill"
                  className="absolute inset-0 rounded-full z-[-1] shadow-md"
                  style={{
                    background: theme.activePillBg,
                    borderColor: theme.cardBorder,
                    borderWidth: '1px',
                    boxShadow: `0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 ${theme.topHighlight}`,
                  }}
                  transition={{
                    type: 'spring',
                    stiffness: 400,
                    damping: 34,
                  }}
                />
              )}

              <Icon
                size={18}
                className={`stroke-[1.8] transition-transform ${
                  isActive ? 'scale-110' : 'opacity-80'
                }`}
              />
              <span className={`tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
