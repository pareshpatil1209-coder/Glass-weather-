import { motion, useReducedMotion } from 'motion/react';
import { WeatherCategory } from '../types/weather';

interface WeatherIllustrationProps {
  category: WeatherCategory;
  isDay?: number;
  className?: string;
}

export function WeatherIllustration({
  category,
  isDay = 1,
  className = '',
}: WeatherIllustrationProps) {
  const shouldReduceMotion = useReducedMotion();

  const floatTransition = shouldReduceMotion
    ? undefined
    : {
        duration: 7,
        repeat: Infinity,
        ease: 'easeInOut' as const,
        repeatType: 'reverse' as const,
      };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Blurred ground shadow */}
      <div 
        className="absolute -bottom-3 w-40 h-7 rounded-full bg-black/15 blur-md pointer-events-none transition-all duration-700" 
        style={{ transform: 'scale(0.9)' }}
      />

      {/* Floating 3D Graphic */}
      <motion.div
        animate={shouldReduceMotion ? {} : { y: [-8, 8, -8] }}
        transition={floatTransition}
        className="relative z-10 w-48 h-48 flex items-center justify-center filter drop-shadow-lg"
      >
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full overflow-visible"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sun Gradients */}
            <radialGradient id="sunCore" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFF7D6" />
              <stop offset="40%" stopColor="#FFD13B" />
              <stop offset="85%" stopColor="#FFA000" />
              <stop offset="100%" stopColor="#F57C00" />
            </radialGradient>
            <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFE082" stopOpacity="0.8" />
              <stop offset="60%" stopColor="#FFCA28" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#FFB300" stopOpacity="0" />
            </radialGradient>

            {/* Cloud Gradients */}
            <linearGradient id="cloudFront" x1="20%" y1="0%" x2="80%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#F1F5F9" />
              <stop offset="90%" stopColor="#CBD5E1" />
              <stop offset="100%" stopColor="#94A3B8" />
            </linearGradient>
            <linearGradient id="cloudBack" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#E2E8F0" />
              <stop offset="70%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </linearGradient>
            <linearGradient id="rainCloud" x1="10%" y1="0%" x2="90%" y2="100%">
              <stop offset="0%" stopColor="#CBD5E1" />
              <stop offset="50%" stopColor="#64748B" />
              <stop offset="100%" stopColor="#334155" />
            </linearGradient>

            {/* Moon Gradients */}
            <radialGradient id="moonGlow" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="45%" stopColor="#E2E8F0" />
              <stop offset="85%" stopColor="#94A3B8" />
              <stop offset="100%" stopColor="#64748B" />
            </radialGradient>
            <radialGradient id="moonHalo" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#E0E7FF" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#C7D2FE" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity="0" />
            </radialGradient>

            {/* Rain drop gradient */}
            <linearGradient id="rainDrop" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#67E8F9" stopOpacity="0.2" />
              <stop offset="60%" stopColor="#38BDF8" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="1" />
            </linearGradient>

            {/* Thunder gradient */}
            <linearGradient id="thunderGrad" x1="0%" y1="0%" x2="50%" y2="100%">
              <stop offset="0%" stopColor="#FFFBEB" />
              <stop offset="30%" stopColor="#FDE047" />
              <stop offset="100%" stopColor="#F59E0B" />
            </linearGradient>

            {/* Soft 3D shadow filter */}
            <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodOpacity="0.22" floodColor="#0F172A" />
            </filter>
            <filter id="glowGleam" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Condition Rendering */}
          {category === 'clear' && isDay === 1 && (
            <g filter="url(#softShadow)">
              {/* Outer Pulsing Glow */}
              <circle cx="100" cy="100" r="75" fill="url(#sunGlow)" />
              {/* Sun Rays */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={100 + 72 * Math.cos((angle * Math.PI) / 180)}
                  y2={100 + 72 * Math.sin((angle * Math.PI) / 180)}
                  stroke="#FFD54F"
                  strokeWidth="5"
                  strokeLinecap="round"
                  opacity="0.75"
                />
              ))}
              {/* 3D Sun Sphere */}
              <circle cx="100" cy="100" r="48" fill="url(#sunCore)" />
              {/* Specular highlight */}
              <ellipse cx="86" cy="84" rx="16" ry="11" fill="#FFFFFF" opacity="0.45" transform="rotate(-20 86 84)" />
              <ellipse cx="78" cy="78" rx="6" ry="4" fill="#FFFFFF" opacity="0.8" />
            </g>
          )}

          {category === 'clear' && isDay === 0 && (
            <g filter="url(#softShadow)">
              {/* Moonlight halo */}
              <circle cx="100" cy="100" r="78" fill="url(#moonHalo)" />
              {/* Twinkling soft stars */}
              <circle cx="45" cy="55" r="2.5" fill="#FFFFFF" opacity="0.85" />
              <circle cx="155" cy="65" r="2" fill="#FFFFFF" opacity="0.9" />
              <circle cx="145" cy="145" r="3" fill="#FFFFFF" opacity="0.8" />
              <circle cx="50" cy="130" r="1.8" fill="#FFFFFF" opacity="0.75" />
              
              {/* 3D Moon Crescent */}
              <path
                d="M 125,48 A 52,52 0 1,0 152,142 A 44,44 0 0,1 125,48 Z"
                fill="url(#moonGlow)"
              />
              {/* Soft craters */}
              <circle cx="95" cy="85" r="7" fill="#64748B" opacity="0.25" />
              <circle cx="82" cy="115" r="10" fill="#64748B" opacity="0.2" />
              <circle cx="112" cy="125" r="5" fill="#64748B" opacity="0.2" />
              {/* Moon specular curve */}
              <path
                d="M 85,55 A 48,48 0 0,0 75,100"
                stroke="#FFFFFF"
                strokeWidth="4"
                strokeLinecap="round"
                fill="none"
                opacity="0.6"
              />
            </g>
          )}

          {(category === 'partly_cloudy' || category === 'fog') && (
            <g filter="url(#softShadow)">
              {/* Background Sun or Moon */}
              {isDay ? (
                <g transform="translate(10, -5)">
                  <circle cx="126" cy="72" r="34" fill="url(#sunCore)" />
                  <ellipse cx="118" cy="62" rx="9" ry="6" fill="#FFFFFF" opacity="0.6" />
                </g>
              ) : (
                <g transform="translate(10, -5)">
                  <path
                    d="M 130,45 A 36,36 0 1,0 150,110 A 30,30 0 0,1 130,45 Z"
                    fill="url(#moonGlow)"
                  />
                  <circle cx="60" cy="50" r="2" fill="#FFFFFF" opacity="0.8" />
                </g>
              )}

              {/* Fog lines if fog */}
              {category === 'fog' && (
                <g opacity="0.85" stroke="#FFFFFF" strokeWidth="5" strokeLinecap="round">
                  <line x1="45" y1="140" x2="155" y2="140" />
                  <line x1="35" y1="154" x2="165" y2="154" />
                  <line x1="55" y1="168" x2="145" y2="168" />
                </g>
              )}

              {/* 3D Foreground Cloud */}
              <g transform="translate(5, 10)">
                {/* Cloud base puff */}
                <path
                  d="M60 135 H145 C158 135 168 124 168 110 C168 98 159 88 147 86 C144 68 129 55 110 55 C95 55 82 63 76 76 C72 74 67 73 62 73 C48 73 36 85 36 100 C36 119 47 135 60 135 Z"
                  fill="url(#cloudFront)"
                />
                {/* Glossy top highlights */}
                <ellipse cx="110" cy="67" rx="20" ry="8" fill="#FFFFFF" opacity="0.75" />
                <ellipse cx="68" cy="88" rx="14" ry="6" fill="#FFFFFF" opacity="0.65" />
              </g>
            </g>
          )}

          {category === 'cloudy' && (
            <g filter="url(#softShadow)">
              {/* Back darker cloud */}
              <path
                d="M48 110 H135 C146 110 155 101 155 90 C155 80 147 72 137 70 C135 56 122 45 107 45 C95 45 84 52 79 62 C75 61 71 60 67 60 C55 60 45 70 45 82 C45 98 48 110 48 110 Z"
                fill="url(#cloudBack)"
                opacity="0.8"
                transform="translate(16, -10)"
              />
              {/* Front large puffy cloud */}
              <path
                d="M60 145 H150 C164 145 175 133 175 118 C175 105 165 94 152 92 C149 72 133 58 112 58 C96 58 82 67 76 81 C72 79 67 78 62 78 C47 78 34 91 34 107 C34 128 46 145 60 145 Z"
                fill="url(#cloudFront)"
              />
              <ellipse cx="112" cy="71" rx="22" ry="9" fill="#FFFFFF" opacity="0.8" />
              <ellipse cx="66" cy="94" rx="15" ry="7" fill="#FFFFFF" opacity="0.7" />
            </g>
          )}

          {(category === 'rain' || category === 'drizzle') && (
            <g filter="url(#softShadow)">
              {/* Dark Rain Cloud */}
              <path
                d="M58 120 H148 C162 120 173 108 173 94 C173 81 163 71 150 69 C147 50 131 36 111 36 C96 36 82 45 76 58 C72 56 67 55 62 55 C47 55 35 68 35 83 C35 103 45 120 58 120 Z"
                fill="url(#rainCloud)"
              />
              {/* Cloud highlight */}
              <ellipse cx="111" cy="48" rx="22" ry="8" fill="#FFFFFF" opacity="0.35" />

              {/* Animated Rain drops */}
              {[
                { x: 62, delay: 0, len: category === 'rain' ? 24 : 14 },
                { x: 86, delay: 0.35, len: category === 'rain' ? 28 : 16 },
                { x: 110, delay: 0.15, len: category === 'rain' ? 25 : 15 },
                { x: 134, delay: 0.5, len: category === 'rain' ? 26 : 14 },
                { x: 154, delay: 0.25, len: category === 'rain' ? 22 : 12 },
              ].map((drop, idx) => (
                <motion.line
                  key={idx}
                  x1={drop.x}
                  y1={130}
                  x2={drop.x - 6}
                  y2={130 + drop.len}
                  stroke="url(#rainDrop)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y1: [130, 150, 130],
                          y2: [130 + drop.len, 150 + drop.len, 130 + drop.len],
                          opacity: [0.3, 1, 0.3],
                        }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: Infinity,
                    delay: drop.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </g>
          )}

          {category === 'thunderstorm' && (
            <g filter="url(#softShadow)">
              {/* Dramatic Storm Cloud */}
              <path
                d="M58 115 H148 C162 115 173 103 173 89 C173 76 163 66 150 64 C147 45 131 31 111 31 C96 31 82 40 76 53 C72 51 67 50 62 50 C47 50 35 63 35 78 C35 98 45 115 58 115 Z"
                fill="url(#rainCloud)"
              />
              {/* Lightning Bolt */}
              <motion.polygon
                points="106,108 94,142 108,142 98,175 124,134 110,134 122,108"
                fill="url(#thunderGrad)"
                stroke="#FFFFFF"
                strokeWidth="1.2"
                filter="url(#glowGleam)"
                animate={
                  shouldReduceMotion
                    ? {}
                    : {
                        opacity: [1, 0.7, 1, 0.2, 1],
                        scale: [1, 1.05, 1, 0.98, 1],
                      }
                }
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  repeatDelay: 1.5,
                  ease: 'easeInOut',
                }}
              />
              {/* Rain drops */}
              {[
                { x: 64, delay: 0.1 },
                { x: 80, delay: 0.4 },
                { x: 136, delay: 0.2 },
                { x: 154, delay: 0.5 },
              ].map((drop, idx) => (
                <line
                  key={idx}
                  x1={drop.x}
                  y1={125}
                  x2={drop.x - 7}
                  y2={148}
                  stroke="url(#rainDrop)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.8"
                />
              ))}
            </g>
          )}

          {category === 'snow' && (
            <g filter="url(#softShadow)">
              {/* Frost Cloud */}
              <path
                d="M58 120 H148 C162 120 173 108 173 94 C173 81 163 71 150 69 C147 50 131 36 111 36 C96 36 82 45 76 58 C72 56 67 55 62 55 C47 55 35 68 35 83 C35 103 45 120 58 120 Z"
                fill="url(#cloudFront)"
              />
              {/* Snow flakes */}
              {[
                { cx: 70, cy: 140, r: 4, delay: 0 },
                { cx: 100, cy: 152, r: 5, delay: 0.4 },
                { cx: 130, cy: 142, r: 4.5, delay: 0.2 },
                { cx: 85, cy: 168, r: 3.5, delay: 0.6 },
                { cx: 120, cy: 172, r: 4, delay: 0.3 },
              ].map((flake, idx) => (
                <motion.circle
                  key={idx}
                  cx={flake.cx}
                  cy={flake.cy}
                  r={flake.r}
                  fill="#FFFFFF"
                  stroke="#BAE6FD"
                  strokeWidth="1.5"
                  animate={
                    shouldReduceMotion
                      ? {}
                      : {
                          y: [-4, 6, -4],
                          x: [-3, 3, -3],
                          opacity: [0.6, 1, 0.6],
                        }
                  }
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: flake.delay,
                    ease: 'easeInOut',
                  }}
                />
              ))}
            </g>
          )}
        </svg>
      </motion.div>
    </div>
  );
}
