import { useEffect, useRef } from 'react';
import type { ActionItems, CategoryFilter } from '../types';
import { durationsOverlapping, filterByCategory, milestoneStatus } from '../utils/timeline';
import { MilestoneSection } from './MilestoneSection';

const SCROLL_DELAY_MS = 300;

interface TimelineProps {
  data: ActionItems;
  week: number;
  activeCategory: CategoryFilter;
}

export function Timeline({ data, week, activeCategory }: TimelineProps) {
  const currentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      currentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, SCROLL_DELAY_MS);
    return () => clearTimeout(timer);
  }, [week, activeCategory]);

  const durations = filterByCategory(data.durationItems, activeCategory);
  const points = filterByCategory(data.pointItems, activeCategory);

  return (
    <div className="flex flex-col">
      {data.milestones.map((milestone) => {
        const milestonePoints = points.filter((p) => p.weekGroup === milestone.id);
        const milestoneDurations = durationsOverlapping(durations, milestone);
        if (milestonePoints.length === 0 && milestoneDurations.length === 0) return null;

        const status = milestoneStatus(milestone, week);
        return (
          <MilestoneSection
            key={milestone.id}
            milestone={milestone}
            status={status}
            points={milestonePoints}
            durations={milestoneDurations}
            ref={status === 'current' ? currentRef : undefined}
          />
        );
      })}
    </div>
  );
}
