import type { Ref } from 'react';
import { CATEGORY_THEME, PAST_THEME } from '../constants';
import type { DurationItem, Milestone, MilestoneStatus, PointItem } from '../types';
import { durationsEndingIn, durationsStartingIn } from '../utils/timeline';
import { DurationEndCard, DurationStartCard } from './DurationCards';
import { PointCard } from './PointCard';

const DOT_STYLE: Record<MilestoneStatus, string> = {
  current: 'bg-rose-500 animate-pulse ring-4 ring-rose-200',
  past: 'bg-gray-300',
  upcoming: 'bg-rose-300',
};

const TITLE_STYLE: Record<MilestoneStatus, string> = {
  current: 'text-rose-600',
  past: 'text-gray-400',
  upcoming: 'text-gray-800',
};

interface MilestoneSectionProps {
  milestone: Milestone;
  status: MilestoneStatus;
  points: PointItem[];
  /** Durations (already category-filtered) that overlap this milestone. */
  durations: DurationItem[];
  ref?: Ref<HTMLElement>;
}

function weekRangeLabel({ startWeek, endWeek }: Milestone): string {
  return startWeek === endWeek ? `${startWeek}주차` : `${startWeek}~${endWeek}주차`;
}

export function MilestoneSection({ milestone, status, points, durations, ref }: MilestoneSectionProps) {
  const isPast = status === 'past';
  const trackCategories = [...new Set(durations.map((d) => d.category))];

  return (
    <section className="flex w-full relative" ref={ref} aria-current={status === 'current' ? 'step' : undefined}>
      <div className="relative flex-shrink-0 w-16">
        <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-rose-100" />
        <div className={`absolute left-[7.5px] top-2 w-4 h-4 rounded-full border-2 border-white z-10 ${DOT_STYLE[status]}`} />
        <div className="absolute left-[28px] top-0 bottom-0 flex space-x-1.5 z-0" aria-hidden="true">
          {trackCategories.map((category) => (
            <div key={category} className={`w-1.5 h-full ${isPast ? PAST_THEME.track : CATEGORY_THEME[category].track}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 pb-10 pr-2 pt-1">
        <h2 className={`text-xl font-bold mb-4 flex items-center transition-colors duration-300 ${TITLE_STYLE[status]}`}>
          {weekRangeLabel(milestone)}
          {status === 'current' && (
            <span className="ml-3 text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">이번 주</span>
          )}
        </h2>

        {durationsStartingIn(durations, milestone).map((d) => (
          <DurationStartCard key={`start-${d.id}`} item={d} isPast={isPast} />
        ))}
        {durationsEndingIn(durations, milestone).map((d) => (
          <DurationEndCard key={`end-${d.id}`} item={d} isPast={isPast} />
        ))}

        <div className="space-y-3">
          {points.map((item) => (
            <PointCard key={`${item.weekGroup}-${item.title}`} item={item} status={status} />
          ))}
        </div>
      </div>
    </section>
  );
}
