import moment from 'moment';

/**
 * Converts a duration in seconds to a human-readable string.
 * The format is "Xh Ym Zs", including only the relevant units (up to the largest unit).
 *
 * @param duration - The duration in seconds.
 * @returns A formatted string, e.g., "1h 5m 30s" or "45s".
 */
export function humanizeDuration(duration: number): string {
  const d = moment.duration(duration, 'seconds');

  const hours = d.hours();
  const minutes = d.minutes();
  const seconds = d.seconds();

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

  return parts.join(' ');
}
