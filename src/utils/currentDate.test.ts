import { describe, expect, it } from 'vitest';
import { resolveCurrentDate } from './currentDate';

const NOW = new Date('2026-11-03T23:30:00Z'); // 2026-11-04 KST

describe('resolveCurrentDate', () => {
  it('uses a valid current_date parameter', () => {
    expect(resolveCurrentDate('?current_date=2027-01-15', NOW).toString()).toBe('2027-01-15');
  });

  it('falls back to today in KST when the parameter is missing', () => {
    expect(resolveCurrentDate('', NOW).toString()).toBe('2026-11-04');
  });

  it.each(['?current_date=', '?current_date=2027-02-30', '?current_date=tomorrow'])(
    'falls back to today in KST for invalid parameter %s',
    (search) => {
      expect(resolveCurrentDate(search, NOW).toString()).toBe('2026-11-04');
    },
  );
});
