import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { WeatherMood } from '../types/weather';
import { MOOD_THEMES } from '../utils/moodThemes';
import { CloseIcon } from './WeatherIcons';

interface PWAInstallButtonProps {
  mood: WeatherMood;
  className?: string;
  variant?: 'banner' | 'pill' | 'settings';
}

export function PWAInstallButton({ mood, className = '', variant = 'pill' }: PWAInstallButtonProps) {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const theme = MOOD_THEMES[mood];

  if (isInstalled) {
    return null;
  }

  // Not installable and not iOS
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = () => {
    if (isInstallable) {
      install();
    } else if (isIOS) {
      setShowIOSGuide(true);
    }
  };

  const buttonText = isIOS ? 'Install on iPhone' : 'Install App';

  return (
    <>
      {variant === 'settings' ? (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full min-h-[46px] px-4 py-2.5 rounded-2xl flex items-center justify-between font-semibold text-sm transition-all shadow-sm active:scale-[0.99] ${className}`}
          style={{
            background: theme.activePillBg,
            color: theme.activePillText,
          }}
        >
          <div className="flex items-center gap-2.5">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{buttonText}</span>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider opacity-80">PWA</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`min-h-[40px] px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold transition-all shadow-md active:scale-95 ${className}`}
          style={{
            background: theme.activePillBg,
            color: theme.activePillText,
            borderColor: theme.cardBorder,
            borderWidth: '1px',
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          <span>{buttonText}</span>
        </button>
      )}

      {/* iOS Safari Guide Modal */}
      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div
            className="w-full max-w-sm rounded-[32px] p-6 backdrop-blur-[28px] saturate-[170%] shadow-2xl relative"
            style={{
              background: theme.isDark
                ? 'linear-gradient(180deg, rgba(30, 25, 55, 0.98) 0%, rgba(15, 12, 35, 0.99) 100%)'
                : 'linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(240, 245, 255, 0.99) 100%)',
              borderColor: theme.cardBorder,
              borderWidth: '1px',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold tracking-tight" style={{ color: theme.textColor }}>
                Install on iOS Safari
              </h3>
              <button
                type="button"
                onClick={() => setShowIOSGuide(false)}
                aria-label="Close guide"
                className="w-8 h-8 rounded-full flex items-center justify-center bg-black/5 dark:bg-white/10"
                style={{ color: theme.textColor }}
              >
                <CloseIcon size={16} />
              </button>
            </div>

            <div className="space-y-3.5 text-sm font-medium" style={{ color: theme.textColor }}>
              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold flex-shrink-0">
                  1
                </span>
                <p className="leading-snug">
                  Tap the <strong className="font-semibold">Share</strong> button (box with upward arrow) at the bottom of Safari.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold flex-shrink-0">
                  2
                </span>
                <p className="leading-snug">
                  Scroll down and tap <strong className="font-semibold">Add to Home Screen</strong>.
                </p>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-2xl bg-black/5 dark:bg-white/5">
                <span className="w-6 h-6 rounded-full flex items-center justify-center bg-blue-500 text-white text-xs font-bold flex-shrink-0">
                  3
                </span>
                <p className="leading-snug">
                  Tap <strong className="font-semibold">Add</strong> in the top right. Glass Weather will appear on your home screen!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full py-3 rounded-full font-bold text-sm shadow-md transition-transform active:scale-95"
              style={{
                background: theme.activePillBg,
                color: theme.activePillText,
              }}
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
}
