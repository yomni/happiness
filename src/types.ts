export type Category = '검사' | '영양제' | '복지' | '준비물' | '태교';

export type CategoryFilter = '전체' | Category;

export interface Milestone {
  id: string;
  startWeek: number;
  endWeek: number;
}

/** One-off action that belongs to a single milestone. */
export interface PointItem {
  weekGroup: string;
  category: Category;
  title: string;
  description: string;
}

/** Ongoing action that spans several weeks (supplements, routines, ...). */
export interface DurationItem {
  id: string;
  startWeek: number;
  endWeek: number;
  category: Category;
  title: string;
  description: string;
  productName?: string;
  productLink?: string;
}

export interface ActionItems {
  milestones: Milestone[];
  pointItems: PointItem[];
  durationItems: DurationItem[];
}

export type MilestoneStatus = 'past' | 'current' | 'upcoming';
