import type { Category, CategoryFilter } from './types';
import { CalendarDate } from './utils/calendarDate';

export const DUE_DATE = CalendarDate.parse('2027-04-18')!;

export const CATEGORY_FILTERS: CategoryFilter[] = ['전체', '검사', '영양제', '복지', '준비물', '태교'];

interface CategoryTheme {
  /** Outlined badge on point cards. */
  badge: string;
  /** Solid badge on duration start cards. */
  solidBadge: string;
  /** Vertical track next to the timeline while a duration is active. */
  track: string;
  /** Duration start card. */
  startCard: string;
  /** Duration end card (dashed border). */
  endCard: string;
}

// Full class names are spelled out so Tailwind can detect them.
export const CATEGORY_THEME: Record<Category, CategoryTheme> = {
  검사: {
    badge: 'bg-blue-50 text-blue-800 border-blue-200',
    solidBadge: 'bg-blue-500',
    track: 'bg-blue-400',
    startCard: 'border-blue-300 bg-blue-50/80 shadow-sm',
    endCard: 'border-blue-200 bg-blue-50/30',
  },
  영양제: {
    badge: 'bg-green-50 text-green-800 border-green-200',
    solidBadge: 'bg-green-500',
    track: 'bg-green-400',
    startCard: 'border-green-300 bg-green-50/80 shadow-sm',
    endCard: 'border-green-200 bg-green-50/30',
  },
  복지: {
    badge: 'bg-yellow-50 text-yellow-800 border-yellow-200',
    solidBadge: 'bg-yellow-500',
    track: 'bg-yellow-400',
    startCard: 'border-yellow-300 bg-yellow-50/80 shadow-sm',
    endCard: 'border-yellow-200 bg-yellow-50/30',
  },
  준비물: {
    badge: 'bg-purple-50 text-purple-800 border-purple-200',
    solidBadge: 'bg-purple-500',
    track: 'bg-purple-400',
    startCard: 'border-purple-300 bg-purple-50/80 shadow-sm',
    endCard: 'border-purple-200 bg-purple-50/30',
  },
  태교: {
    badge: 'bg-pink-50 text-pink-800 border-pink-200',
    solidBadge: 'bg-pink-400',
    track: 'bg-pink-400',
    startCard: 'border-pink-300 bg-pink-50/80 shadow-sm',
    endCard: 'border-pink-200 bg-pink-50/30',
  },
};

export const PAST_THEME = {
  badge: 'bg-gray-50 text-gray-400 border-gray-100',
  solidBadge: 'bg-gray-400',
  track: 'bg-gray-200',
} as const;
