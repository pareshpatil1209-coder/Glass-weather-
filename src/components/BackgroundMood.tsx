import { motion, AnimatePresence } from 'motion/react';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';

interface BackgroundMoodProps {
  mood: WeatherMood;
  children: React.ReactNode;
}

export function BackgroundMood({ mood, children }: BackgroundMoodProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden flex justify-center bg-slate-950 font-figtree select-none">
      {/* Dynamic atmospheric ambient backdrop on wide desktop screens */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 blur-3xl transition-opacity duration-1000 hidden md:block"
        style={{ background: theme.backgroundGradient }}
      />

      {/* Main 430px mobile app viewport container */}
      <div className="relative w-full max-w-[430px] min-h-screen flex flex-col shadow-2xl overflow-hidden bg-black/10">
        {/* Full-bleed crossfading gradient background */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={mood}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: theme.backgroundGradient,
            }}
          >
            {/* 3 Blurred radial orbs for depth */}
            <div
              className="absolute -top-12 -left-16 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
              style={{ background: theme.orb1 }}
            />
            <div
              className="absolute top-1/4 -right-20 w-88 h-88 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
              style={{ background: theme.orb2 }}
            />
            <div
              className="absolute bottom-24 -left-12 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-all duration-1000"
              style={{ background: theme.orb3 }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Foreground Content */}
        <div className="relative z-10 flex-1 flex flex-col w-full">
          {children}
        </div>
      </div>
    </div>
  );
}
