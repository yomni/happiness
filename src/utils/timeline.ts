import type { Category, CategoryFilter, DurationItem, Milestone, MilestoneStatus } from '../types';

/** Weeks past the last milestone stay pinned to it so the final section remains "current". */
export function clampToTimeline(week: number, milestones: Milestone[]): number {
  const lastWeek = Math.max(...milestones.map((m) => m.endWeek));
  return Math.min(week, lastWeek);
}

export function milestoneStatus(milestone: Milestone, week: number): MilestoneStatus {
  if (week > milestone.endWeek) return 'past';
  if (week >= milestone.startWeek) return 'current';
  return 'upcoming';
}

export function durationsOverlapping(items: DurationItem[], milestone: Milestone): DurationItem[] {
  return items.filter((d) => d.startWeek <= milestone.endWeek && d.endWeek >= milestone.startWeek);
}

export function durationsStartingIn(items: DurationItem[], milestone: Milestone): DurationItem[] {
  return items.filter((d) => d.startWeek >= milestone.startWeek && d.startWeek <= milestone.endWeek);
}

export function durationsEndingIn(items: DurationItem[], milestone: Milestone): DurationItem[] {
  return items.filter((d) => d.endWeek >= milestone.startWeek && d.endWeek <= milestone.endWeek);
}

export function ongoingDurations(items: DurationItem[], week: number): DurationItem[] {
  return items.filter((d) => week >= d.startWeek && week <= d.endWeek);
}

export function filterByCategory<T extends { category: Category }>(items: T[], filter: CategoryFilter): T[] {
  return filter === '전체' ? items : items.filter((item) => item.category === filter);
}
