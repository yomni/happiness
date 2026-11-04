import { describe, expect, it } from 'vitest';
import { CalendarDate } from './calendarDate';
import { PregnancyPeriod } from './pregnancyPeriod';

const DUE_DATE = CalendarDate.parse('2027-04-18')!;
const periodOn = (today: string) => PregnancyPeriod.fromDueDate(DUE_DATE, CalendarDate.parse(today)!);

describe('PregnancyPeriod constructor', () => {
  it.each([-1, 1.5, Number.NaN])('rejects invalid totalDays %s', (totalDays) => {
    expect(() => new PregnancyPeriod(totalDays)).toThrow(RangeError);
  });

  it('is immutable', () => {
    const period = new PregnancyPeriod(10);
    expect(Object.isFrozen(period)).toBe(true);
  });
});

describe('PregnancyPeriod weeks and days (N주 M일, 0-indexed)', () => {
  it.each([
    [0, 0, 0],
    [6, 0, 6],
    [7, 1, 0],
    [38, 5, 3],
    [280, 40, 0],
  ])('totalDays %i is %i주 %i일', (totalDays, weeks, daysInWeek) => {
    const period = new PregnancyPeriod(totalDays);
    expect(period.weeks).toBe(weeks);
    expect(period.daysInWeek).toBe(daysInWeek);
  });

  it('formats progress as N주 M일', () => {
    expect(new PregnancyPeriod(38).formatProgressString()).toBe('5주 3일');
  });
});

describe('PregnancyPeriod.fromDueDate', () => {
  it('treats the due date as 40주 0일', () => {
    const period = periodOn('2027-04-18');
    expect(period.formatProgressString()).toBe('40주 0일');
    expect(period.dDay).toBe(0);
  });

  it('starts the pregnancy 280 days before the due date', () => {
    expect(periodOn('2026-07-12').totalDays).toBe(0);
    expect(periodOn('2026-07-13').totalDays).toBe(1);
  });

  it('clamps dates before the pregnancy start to 0일', () => {
    expect(periodOn('2026-01-01').totalDays).toBe(0);
  });

  it('keeps counting after the due date', () => {
    const period = periodOn('2027-04-25');
    expect(period.formatProgressString()).toBe('41주 0일');
    expect(period.dDay).toBe(-7);
  });

  it('computes today (2026-11-04) as 16주 3일', () => {
    expect(periodOn('2026-11-04').formatProgressString()).toBe('16주 3일');
  });
});

describe('PregnancyPeriod D-Day', () => {
  it.each([
    [279, 'D-1'],
    [280, 'D-Day'],
    [281, 'D+1'],
    [0, 'D-280'],
  ])('totalDays %i is %s', (totalDays, expected) => {
    expect(new PregnancyPeriod(totalDays).formatDDayString()).toBe(expected);
  });
});

describe('PregnancyPeriod trimesters', () => {
  it.each([
    [13 * 7 + 6, 'first'],
    [14 * 7, 'second'],
    [27 * 7 + 6, 'second'],
    [28 * 7, 'third'],
  ])('totalDays %i is in the %s trimester', (totalDays, trimester) => {
    const period = new PregnancyPeriod(totalDays);
    expect(period.isFirstTrimester).toBe(trimester === 'first');
    expect(period.isSecondTrimester).toBe(trimester === 'second');
    expect(period.isThirdTrimester).toBe(trimester === 'third');
  });
});
