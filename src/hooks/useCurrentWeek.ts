import { useMemo } from 'react';
import { DUE_DATE } from '../constants';
import type { Milestone } from '../types';
import type { CalendarDate } from '../utils/calendarDate';
import { resolveCurrentDate } from '../utils/currentDate';
import { PregnancyPeriod } from '../utils/pregnancyPeriod';
import { clampToTimeline } from '../utils/timeline';

export interface CurrentWeek {
  today: CalendarDate;
  period: PregnancyPeriod;
  /** Gestational week used to place the user on the timeline. */
  timelineWeek: number;
}

export function useCurrentWeek(milestones: Milestone[]): CurrentWeek {
  return useMemo(() => {
    const today = resolveCurrentDate(window.location.search);
    const period = PregnancyPeriod.fromDueDate(DUE_DATE, today);
    return { today, period, timelineWeek: clampToTimeline(period.weeks, milestones) };
  }, [milestones]);
}
