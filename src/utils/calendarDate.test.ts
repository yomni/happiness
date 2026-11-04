import { describe, expect, it } from 'vitest';
import { CalendarDate } from './calendarDate';

describe('CalendarDate.parse', () => {
  it('parses a valid YYYY-MM-DD string', () => {
    expect(CalendarDate.parse('2027-04-18')?.toString()).toBe('2027-04-18');
  });

  it.each(['', '2027-4-18', '2027/04/18', '2027-04-18T00:00:00', 'abcd-ef-gh'])(
    'returns null for malformed input %j',
    (value) => {
      expect(CalendarDate.parse(value)).toBeNull();
    },
  );

  it.each(['2027-02-29', '2027-02-30', '2026-13-01', '2026-00-10', '2026-04-31'])(
    'returns null for non-existent date %s',
    (value) => {
      expect(CalendarDate.parse(value)).toBeNull();
    },
  );

  it('accepts a leap day in a leap year', () => {
    expect(CalendarDate.parse('2028-02-29')?.toString()).toBe('2028-02-29');
  });
});

describe('CalendarDate.todayInKST', () => {
  it('uses the Seoul calendar day even when UTC is still on the previous day', () => {
    // 2026-11-04 08:30 KST == 2026-11-03 23:30 UTC
    const now = new Date('2026-11-03T23:30:00Z');
    expect(CalendarDate.todayInKST(now).toString()).toBe('2026-11-04');
  });

  it('rolls over at KST midnight', () => {
    expect(CalendarDate.todayInKST(new Date('2026-11-04T14:59:59Z')).toString()).toBe('2026-11-04');
    expect(CalendarDate.todayInKST(new Date('2026-11-04T15:00:00Z')).toString()).toBe('2026-11-05');
  });
});

describe('CalendarDate.daysUntil', () => {
  const date = (value: string) => CalendarDate.parse(value)!;

  it('counts calendar days between two dates', () => {
    expect(date('2026-11-04').daysUntil(date('2026-11-05'))).toBe(1);
    expect(date('2026-07-12').daysUntil(date('2027-04-18'))).toBe(280);
  });

  it('is negative when the other date is earlier', () => {
    expect(date('2027-04-20').daysUntil(date('2027-04-18'))).toBe(-2);
  });

  it('is zero for the same day', () => {
    expect(date('2027-04-18').daysUntil(date('2027-04-18'))).toBe(0);
  });
});

describe('CalendarDate formatting', () => {
  it('formats as YYYY-MM-DD and in Korean', () => {
    const date = CalendarDate.parse('2027-04-08')!;
    expect(date.toString()).toBe('2027-04-08');
    expect(date.toKoreanString()).toBe('2027년 4월 8일');
  });
});
