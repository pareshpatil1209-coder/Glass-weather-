import React from 'react';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  mood: WeatherMood;
  children: React.ReactNode;
  className?: string;
  pill?: boolean;
}

export function GlassCard({
  mood,
  children,
  className = '',
  pill = false,
  style,
  ...props
}: GlassCardProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div
      className={`relative backdrop-blur-[24px] saturate-[160%] transition-colors duration-500 ${
        pill ? 'rounded-full' : 'rounded-[30px]'
      } ${className}`}
      style={{
        background: theme.cardBg,
        borderColor: theme.cardBorder,
        borderWidth: '1px',
        borderStyle: 'solid',
        boxShadow: `${theme.cardShadow}, inset 0 1px 0 0 ${theme.topHighlight}`,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
