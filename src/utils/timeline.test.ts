import { describe, expect, it } from 'vitest';
import type { DurationItem, Milestone, PointItem } from '../types';
import {
  clampToTimeline,
  durationsEndingIn,
  durationsOverlapping,
  durationsStartingIn,
  filterByCategory,
  milestoneStatus,
  ongoingDurations,
} from './timeline';

const milestones: Milestone[] = [
  { id: 'm1', startWeek: 4, endWeek: 5 },
  { id: 'm2', startWeek: 6, endWeek: 8 },
  { id: 'm11', startWeek: 41, endWeek: 44 },
];

const duration = (id: string, startWeek: number, endWeek: number, category: DurationItem['category'] = '영양제'): DurationItem => ({
  id,
  startWeek,
  endWeek,
  category,
  title: id,
  description: '',
});

describe('clampToTimeline', () => {
  it('keeps weeks inside the timeline', () => {
    expect(clampToTimeline(16, milestones)).toBe(16);
  });

  it('caps weeks after the last milestone to its end week', () => {
    expect(clampToTimeline(50, milestones)).toBe(44);
  });

  it('returns the week unchanged when there are no milestones', () => {
    expect(clampToTimeline(16, [])).toBe(16);
  });
});

describe('milestoneStatus', () => {
  const m2 = milestones[1];

  it.each([
    [5, 'upcoming'],
    [6, 'current'],
    [8, 'current'],
    [9, 'past'],
  ] as const)('week %i is %s for weeks 6~8', (week, status) => {
    expect(milestoneStatus(m2, week)).toBe(status);
  });
});

describe('duration helpers', () => {
  const m2 = milestones[1]; // 6~8
  const items = [duration('before', 1, 5), duration('starts', 7, 20), duration('ends', 1, 6), duration('spans', 4, 40)];

  it('finds durations overlapping a milestone', () => {
    expect(durationsOverlapping(items, m2).map((d) => d.id)).toEqual(['starts', 'ends', 'spans']);
  });

  it('finds durations starting in a milestone', () => {
    expect(durationsStartingIn(items, m2).map((d) => d.id)).toEqual(['starts']);
  });

  it('finds durations ending in a milestone', () => {
    expect(durationsEndingIn(items, m2).map((d) => d.id)).toEqual(['ends']);
  });

  it('finds durations ongoing in a week, inclusive on both ends', () => {
    expect(ongoingDurations(items, 5).map((d) => d.id)).toEqual(['before', 'ends', 'spans']);
    expect(ongoingDurations(items, 41)).toEqual([]);
  });
});

describe('filterByCategory', () => {
  const points: PointItem[] = [
    { weekGroup: 'm1', category: '검사', title: 'a', description: '' },
    { weekGroup: 'm1', category: '복지', title: 'b', description: '' },
  ];

  it('returns everything for 전체', () => {
    expect(filterByCategory(points, '전체')).toEqual(points);
  });

  it('returns only the selected category', () => {
    expect(filterByCategory(points, '복지').map((p) => p.title)).toEqual(['b']);
  });
});
