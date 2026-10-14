export type MoonPhaseKey =
  | 'new_moon'
  | 'waxing_crescent'
  | 'first_quarter'
  | 'waxing_gibbous'
  | 'full_moon'
  | 'waning_gibbous'
  | 'last_quarter'
  | 'waning_crescent';

export interface LunarPhaseInfo {
  key: MoonPhaseKey;
  name: string;
  illumination: number; // 0 to 100 percentage
  ageDays: number; // 0 to 29.53
  phaseFraction: number; // 0 to 1.0
  daysToFullMoon: number;
  stageDescription: string;
}

// Synodic month: mean period of the Moon's phases
const SYNODIC_MONTH = 29.53058867;
// Reference known New Moon: Jan 6, 2000, 18:14 UTC
const KNOWN_NEW_MOON_TIMESTAMP = Date.UTC(2000, 0, 6, 18, 14, 0);
const MS_PER_DAY = 86400000;

/**
 * Calculates the current lunar phase for a given date using synodic cycle approximation.
 */
export function getLunarPhase(dateInput?: Date | string | number): LunarPhaseInfo {
  const targetDate = dateInput ? new Date(dateInput) : new Date();
  const time = isNaN(targetDate.getTime()) ? Date.now() : targetDate.getTime();

  // Days since known new moon
  const daysSinceNewMoon = (time - KNOWN_NEW_MOON_TIMESTAMP) / MS_PER_DAY;

  // Normalized phase [0.0, 1.0)
  const normalizedFraction = ((daysSinceNewMoon % SYNODIC_MONTH) + SYNODIC_MONTH) % SYNODIC_MONTH;
  const phaseFraction = normalizedFraction / SYNODIC_MONTH;
  const ageDays = parseFloat(normalizedFraction.toFixed(1));

  // Illumination calculation: 0% at new moon, 100% at full moon
  const illumination = Math.round(((1 - Math.cos(phaseFraction * 2 * Math.PI)) / 2) * 100);

  // Days to next full moon (full moon occurs at phase 0.5)
  const diffToFull = phaseFraction <= 0.5 ? 0.5 - phaseFraction : 1.5 - phaseFraction;
  const daysToFullMoon = Math.max(0, Math.round(diffToFull * SYNODIC_MONTH));

  let key: MoonPhaseKey;
  let name: string;
  let stageDescription: string;

  if (phaseFraction < 0.03 || phaseFraction >= 0.97) {
    key = 'new_moon';
    name = 'New Moon';
    stageDescription = 'Not visible in night sky';
  } else if (phaseFraction < 0.22) {
    key = 'waxing_crescent';
    name = 'Waxing Crescent';
    stageDescription = 'Growing crescent in evening';
  } else if (phaseFraction < 0.28) {
    key = 'first_quarter';
    name = 'First Quarter';
    stageDescription = 'Half illuminated (waxing)';
  } else if (phaseFraction < 0.47) {
    key = 'waxing_gibbous';
    name = 'Waxing Gibbous';
    stageDescription = 'More than half lit';
  } else if (phaseFraction < 0.53) {
    key = 'full_moon';
    name = 'Full Moon';
    stageDescription = 'Fully illuminated';
  } else if (phaseFraction < 0.72) {
    key = 'waning_gibbous';
    name = 'Waning Gibbous';
    stageDescription = 'Decreasing illumination';
  } else if (phaseFraction < 0.78) {
    key = 'last_quarter';
    name = 'Last Quarter';
    stageDescription = 'Half illuminated (waning)';
  } else {
    key = 'waning_crescent';
    name = 'Waning Crescent';
    stageDescription = 'Slim crescent before dawn';
  }

  return {
    key,
    name,
    illumination,
    ageDays,
    phaseFraction,
    daysToFullMoon,
    stageDescription,
  };
}
