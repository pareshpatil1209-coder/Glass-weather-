import { WeatherMood } from '../types/weather';

export interface MoodTheme {
  name: WeatherMood;
  isDark: boolean;
  backgroundGradient: string;
  orb1: string;
  orb2: string;
  orb3: string;
  textColor: string;
  textSecondary: string;
  accentColor: string;
  accentGradient: string;
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  topHighlight: string;
  pillBg: string;
  activePillBg: string;
  activePillText: string;
  dividerColor: string;
  savedCardTint: string;
}

export const MOOD_THEMES: Record<WeatherMood, MoodTheme> = {
  sunny: {
    name: 'sunny',
    isDark: false,
    backgroundGradient: 'linear-gradient(165deg, #B7D9F6 0%, #D9EAFB 45%, #FBEACB 100%)',
    orb1: 'rgba(255, 203, 69, 0.40)', // Golden warm
    orb2: 'rgba(154, 208, 255, 0.45)', // Sky blue
    orb3: 'rgba(255, 235, 175, 0.45)', // Warm cream
    textColor: '#0E2540',
    textSecondary: '#3B5675',
    accentColor: '#E59B00',
    accentGradient: 'linear-gradient(135deg, #FFB703 0%, #FD9E00 100%)',
    cardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.70) 0%, rgba(255, 255, 255, 0.32) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.82)',
    cardShadow: '0 12px 32px -4px rgba(35, 78, 128, 0.14), 0 4px 12px -2px rgba(35, 78, 128, 0.08)',
    topHighlight: 'rgba(255, 255, 255, 0.95)',
    pillBg: 'rgba(255, 255, 255, 0.45)',
    activePillBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.80) 100%)',
    activePillText: '#0E2540',
    dividerColor: 'rgba(14, 37, 64, 0.08)',
    savedCardTint: 'rgba(255, 203, 69, 0.18)',
  },
  rainy: {
    name: 'rainy',
    isDark: true,
    backgroundGradient: 'linear-gradient(165deg, #3F5A7C 0%, #5B7089 50%, #4A8693 100%)',
    orb1: 'rgba(74, 134, 147, 0.50)', // Muted cyan
    orb2: 'rgba(63, 90, 124, 0.60)', // Slate blue
    orb3: 'rgba(140, 185, 204, 0.35)', // Rain highlight
    textColor: '#F4F8FC',
    textSecondary: '#C4D3E0',
    accentColor: '#6BD4F0',
    accentGradient: 'linear-gradient(135deg, #4EA8DE 0%, #3582B8 100%)',
    cardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.24) 0%, rgba(255, 255, 255, 0.08) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.32)',
    cardShadow: '0 12px 36px -4px rgba(10, 25, 45, 0.40), 0 4px 12px -2px rgba(10, 25, 45, 0.25)',
    topHighlight: 'rgba(255, 255, 255, 0.45)',
    pillBg: 'rgba(255, 255, 255, 0.16)',
    activePillBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.38) 0%, rgba(255, 255, 255, 0.22) 100%)',
    activePillText: '#FFFFFF',
    dividerColor: 'rgba(255, 255, 255, 0.12)',
    savedCardTint: 'rgba(74, 134, 147, 0.22)',
  },
  night: {
    name: 'night',
    isDark: true,
    backgroundGradient: 'linear-gradient(165deg, #0E1538 0%, #1D1B4F 48%, #3A2A6B 100%)',
    orb1: 'rgba(58, 42, 107, 0.65)', // Deep violet
    orb2: 'rgba(30, 27, 79, 0.70)', // Midnight
    orb3: 'rgba(112, 85, 180, 0.40)', // Soft star glow
    textColor: '#F5F3FF',
    textSecondary: '#C2BEEC',
    accentColor: '#A78BFA',
    accentGradient: 'linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)',
    cardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(255, 255, 255, 0.07) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.30)',
    cardShadow: '0 12px 40px -4px rgba(5, 7, 24, 0.60), 0 4px 14px -2px rgba(5, 7, 24, 0.35)',
    topHighlight: 'rgba(255, 255, 255, 0.40)',
    pillBg: 'rgba(255, 255, 255, 0.14)',
    activePillBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.34) 0%, rgba(255, 255, 255, 0.18) 100%)',
    activePillText: '#FFFFFF',
    dividerColor: 'rgba(255, 255, 255, 0.12)',
    savedCardTint: 'rgba(139, 92, 246, 0.24)',
  },
  sunset: {
    name: 'sunset',
    isDark: false,
    backgroundGradient: 'linear-gradient(165deg, #FFD9BC 0%, #FFA78E 46%, #C4ABD3 100%)',
    orb1: 'rgba(255, 138, 101, 0.48)', // Coral
    orb2: 'rgba(255, 198, 160, 0.50)', // Peach
    orb3: 'rgba(196, 171, 211, 0.55)', // Dusty purple
    textColor: '#2A1538',
    textSecondary: '#664275',
    accentColor: '#D94848',
    accentGradient: 'linear-gradient(135deg, #F87171 0%, #E11D48 100%)',
    cardBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.68) 0%, rgba(255, 255, 255, 0.28) 100%)',
    cardBorder: 'rgba(255, 255, 255, 0.80)',
    cardShadow: '0 12px 34px -4px rgba(78, 30, 80, 0.15), 0 4px 12px -2px rgba(78, 30, 80, 0.08)',
    topHighlight: 'rgba(255, 255, 255, 0.95)',
    pillBg: 'rgba(255, 255, 255, 0.45)',
    activePillBg: 'linear-gradient(135deg, rgba(255, 255, 255, 0.92) 0%, rgba(255, 255, 255, 0.74) 100%)',
    activePillText: '#2A1538',
    dividerColor: 'rgba(42, 21, 56, 0.09)',
    savedCardTint: 'rgba(255, 140, 105, 0.20)',
  },
};
