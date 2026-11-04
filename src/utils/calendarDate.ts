const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const KST_DATE_FORMAT = new Intl.DateTimeFormat('en-US', {
  timeZone: 'Asia/Seoul',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
});

/** Immutable calendar day (no time, no timezone). Day arithmetic is done in UTC so DST never shifts it. */
export class CalendarDate {
  readonly year: number;
  readonly month: number;
  readonly day: number;

  private constructor(year: number, month: number, day: number) {
    this.year = year;
    this.month = month;
    this.day = day;
    Object.freeze(this);
  }

  /** Parses `YYYY-MM-DD`; returns null for malformed or non-existent dates. */
  static parse(value: string): CalendarDate | null {
    const match = DATE_PATTERN.exec(value);
    if (!match) return null;

    const [year, month, day] = match.slice(1).map(Number);
    return CalendarDate.of(year, month, day);
  }

  /** The current calendar day in Asia/Seoul, regardless of the browser timezone. */
  static todayInKST(now: Date = new Date()): CalendarDate {
    const parts = KST_DATE_FORMAT.formatToParts(now);
    const part = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value);
    const today = CalendarDate.of(part('year'), part('month'), part('day'));
    if (!today) throw new Error(`Unexpected KST date parts: ${JSON.stringify(parts)}`);
    return today;
  }

  /** Signed number of days from this date to `other`. */
  daysUntil(other: CalendarDate): number {
    return Math.round((other.toEpochMillis() - this.toEpochMillis()) / MS_PER_DAY);
  }

  toString(): string {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${this.year}-${pad(this.month)}-${pad(this.day)}`;
  }

  /** Single creation path that enforces the "real calendar day" invariant. */
  private static of(year: number, month: number, day: number): CalendarDate | null {
    if (![year, month, day].every(Number.isInteger)) return null;

    const probe = new Date(Date.UTC(year, month - 1, day));
    const exists =
      probe.getUTCFullYear() === year && probe.getUTCMonth() === month - 1 && probe.getUTCDate() === day;
    return exists ? new CalendarDate(year, month, day) : null;
  }

  /** e.g. 2027년 4월 18일 */
  toKoreanString(): string {
    return `${this.year}년 ${this.month}월 ${this.day}일`;
  }

  private toEpochMillis(): number {
    return Date.UTC(this.year, this.month - 1, this.day);
  }
}
