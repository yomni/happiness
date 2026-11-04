import { CATEGORY_THEME, PAST_THEME } from '../constants';
import type { MilestoneStatus, PointItem } from '../types';

const CARD_STYLE: Record<MilestoneStatus, string> = {
  current: 'bg-white shadow-md border-rose-200',
  past: 'bg-white/50 border-gray-100 shadow-sm opacity-60',
  upcoming: 'bg-white shadow-sm border-gray-100',
};

interface PointCardProps {
  item: PointItem;
  status: MilestoneStatus;
}

export function PointCard({ item, status }: PointCardProps) {
  const isPast = status === 'past';

  return (
    <div className={`border rounded-xl p-4 transition-all duration-300 ${CARD_STYLE[status]}`}>
      <span
        className={`inline-block px-2 py-1 rounded text-xs font-semibold border mb-2 ${isPast ? PAST_THEME.badge : CATEGORY_THEME[item.category].badge}`}
      >
        {item.category}
      </span>
      <h3 className={`text-base font-bold mb-1 ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>{item.title}</h3>
      <p className={`text-xs leading-relaxed ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
    </div>
  );
}
