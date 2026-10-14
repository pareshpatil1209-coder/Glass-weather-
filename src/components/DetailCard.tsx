import React from 'react';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';

interface DetailCardProps {
  mood: WeatherMood;
  icon: React.ReactNode;
  label: string;
  value: string | number;
  unit?: string;
  caption: React.ReactNode;
  bottomSlot?: React.ReactNode;
  topRightSlot?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function DetailCard({
  mood,
  icon,
  label,
  value,
  unit,
  caption,
  bottomSlot,
  topRightSlot,
  className = '',
  valueClassName = '',
}: DetailCardProps) {
  const theme = MOOD_THEMES[mood];

  return (
    <div
      className={`relative p-4 rounded-[28px] backdrop-blur-[24px] saturate-[160%] flex flex-col justify-between overflow-hidden shadow-md ${className}`}
      style={{
        background: theme.cardBg,
        borderColor: theme.cardBorder,
        borderWidth: '1px',
        boxShadow: `${theme.cardShadow}, inset 0 1px 0 ${theme.topHighlight}`,
      }}
    >
      {/* Top Header: icon + uppercase label */}
      <div className="flex items-center justify-between w-full mb-2">
        <div className="flex items-center gap-1.5 opacity-80" style={{ color: theme.textSecondary }}>
          {icon}
          <span className="text-[11.5px] font-[600] uppercase tracking-[0.08em]">
            {label}
          </span>
        </div>
        {topRightSlot}
      </div>

      {/* Large Outfit Value + Small Unit */}
      <div className="flex items-baseline gap-1 my-1">
        <span
          className={`font-outfit text-[32px] font-[300] leading-none tracking-tight ${valueClassName}`}
          style={{ color: theme.textColor }}
        >
          {value}
        </span>
        {unit && (
          <span
            className="text-[14px] font-semibold opacity-75"
            style={{ color: theme.textSecondary }}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Metric graphic (progress bar, UV bar, etc.) */}
      {bottomSlot && <div className="mt-2.5 mb-1.5 w-full">{bottomSlot}</div>}

      {/* Caption */}
      <div
        className="text-[12px] font-medium leading-tight mt-1 opacity-80"
        style={{ color: theme.textSecondary }}
      >
        {caption}
      </div>
    </div>
  );
}
