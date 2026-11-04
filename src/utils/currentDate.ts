import { CalendarDate } from './calendarDate';

const CURRENT_DATE_PARAM = 'current_date';

/** Reads `?current_date=YYYY-MM-DD` for debugging; falls back to today in KST when missing or invalid. */
export function resolveCurrentDate(search: string, now: Date = new Date()): CalendarDate {
  const param = new URLSearchParams(search).get(CURRENT_DATE_PARAM);
  return (param && CalendarDate.parse(param)) || CalendarDate.todayInKST(now);
}
