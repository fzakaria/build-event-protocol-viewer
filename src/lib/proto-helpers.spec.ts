import { expect, describe, it } from 'vitest';
import { decodeAll } from './proto-helpers';

describe('decodeAll', () => {
  it('should return null if file is undefined', async () => {
    const result = await decodeAll(undefined);
    expect(result).toEqual([]);
  });

  it('should handle an invalid file', async () => {
    const invalidFile = new Uint8Array([0, 1, 2, 3, 4, 5]);
    try {
      const file = new File([invalidFile], 'invalidFile');
      await decodeAll(file);
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });
});
