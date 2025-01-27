import moment from 'moment';
import { google } from '$lib/generated/build_event_stream_proto';

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
  const millis = d.milliseconds();

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (seconds > 0) parts.push(`${seconds}s`);

  if (parts.length == 0) {
    return `${millis}ms`;
  }

  return parts.join(' ');
}

export function protoTimestampDate(timestamp: google.protobuf.ITimestamp | null | undefined): Date {
  const millis = Number(timestamp?.seconds || 0) * 1e3 + Number(timestamp?.nanos || 0) / 1e6;
  return new Date(millis);
}

/**
 * Convert the google.protobuf.Duration to seconds.
 */
export function protoDurationToSeconds(
  duration: google.protobuf.IDuration | null | undefined
): number {
  const seconds = Number(duration?.seconds || 0);
  const nanos = duration?.nanos || 0;
  return seconds + nanos / 1e9;
}
