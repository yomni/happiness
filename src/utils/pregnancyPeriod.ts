const DAYS_IN_WEEK = 7;
const DAYS_IN_FULL_TERM = 280;

/** Immutable value object describing gestational age in elapsed days. */
export class PregnancyPeriod {
  readonly totalDays: number;

  constructor(totalDays: number) {
    if (!Number.isInteger(totalDays) || totalDays < 0) {
      throw new RangeError('totalDays must be a non-negative integer');
    }

    this.totalDays = totalDays;
    Object.freeze(this);
  }

  /** Gestational week, numbered from week 1. */
  get weeks(): number {
    return Math.floor(this.totalDays / DAYS_IN_WEEK) + 1;
  }

  /** Day within the gestational week, numbered from day 1. */
  get daysInWeek(): number {
    return (this.totalDays % DAYS_IN_WEEK) + 1;
  }

  /** Signed days until the estimated due date; negative means past due. */
  get dDay(): number {
    return DAYS_IN_FULL_TERM - this.totalDays;
  }

  get isFirstTrimester(): boolean {
    return this.weeks >= 1 && this.weeks <= 13;
  }

  get isSecondTrimester(): boolean {
    return this.weeks >= 14 && this.weeks <= 27;
  }

  get isThirdTrimester(): boolean {
    return this.weeks >= 28;
  }

  formatProgressString(): string {
    return `${this.weeks}주 ${this.daysInWeek}일차`;
  }

  formatDDayString(): string {
    return this.dDay >= 0 ? `D-${this.dDay}` : `D+${Math.abs(this.dDay)}`;
  }
}
