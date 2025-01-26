import { expect, test } from 'vitest';
import { humanizeDuration } from './build-event-summary';
import moment from 'moment';

test('humanizeDuration should return the correct string', () => {
  let duration = moment.duration(1, 'seconds');
  let result = humanizeDuration(duration.asSeconds());
  expect(result).toBe('1s');

  duration = moment.duration({
    seconds: 2,
    minutes: 2
  });
  result = humanizeDuration(duration.asSeconds());
  expect(result).toBe('2m 2s');

  duration = moment.duration({
    seconds: 2,
    minutes: 4,
    hours: 1
  });
  result = humanizeDuration(duration.asSeconds());
  expect(result).toBe('1h 4m 2s');
});
