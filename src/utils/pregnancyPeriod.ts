import type { CalendarDate } from './calendarDate';

const DAYS_IN_WEEK = 7;
const DAYS_IN_FULL_TERM = 280;
const SECOND_TRIMESTER_START_WEEK = 14;
const THIRD_TRIMESTER_START_WEEK = 28;

/**
 * Immutable value object describing gestational age in elapsed days.
 * Follows the Korean clinical convention "N주 M일": both parts are 0-indexed and the due date is 40주 0일.
 */
export class PregnancyPeriod {
  readonly totalDays: number;

  constructor(totalDays: number) {
    if (!Number.isInteger(totalDays) || totalDays < 0) {
      throw new RangeError('totalDays must be a non-negative integer');
    }

    this.totalDays = totalDays;
    Object.freeze(this);
  }

  /** Gestational age on `today` for a pregnancy due on `dueDate`. Dates before conception count as 0일. */
  static fromDueDate(dueDate: CalendarDate, today: CalendarDate): PregnancyPeriod {
    const elapsedDays = DAYS_IN_FULL_TERM - today.daysUntil(dueDate);
    return new PregnancyPeriod(Math.max(0, elapsedDays));
  }

  /** Completed gestational weeks (the N in "N주 M일"). */
  get weeks(): number {
    return Math.floor(this.totalDays / DAYS_IN_WEEK);
  }

  /** Days past the completed weeks, 0..6 (the M in "N주 M일"). */
  get daysInWeek(): number {
    return this.totalDays % DAYS_IN_WEEK;
  }

  /** Signed days until the estimated due date; negative means past due. */
  get dDay(): number {
    return DAYS_IN_FULL_TERM - this.totalDays;
  }

  get isFirstTrimester(): boolean {
    return this.weeks < SECOND_TRIMESTER_START_WEEK;
  }

  get isSecondTrimester(): boolean {
    return this.weeks >= SECOND_TRIMESTER_START_WEEK && this.weeks < THIRD_TRIMESTER_START_WEEK;
  }

  get isThirdTrimester(): boolean {
    return this.weeks >= THIRD_TRIMESTER_START_WEEK;
  }

  formatProgressString(): string {
    return `${this.weeks}주 ${this.daysInWeek}일`;
  }

  formatDDayString(): string {
    if (this.dDay === 0) return 'D-Day';
    return this.dDay > 0 ? `D-${this.dDay}` : `D+${Math.abs(this.dDay)}`;
  }
}
