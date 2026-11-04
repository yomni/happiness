import { CATEGORY_FILTERS, DUE_DATE } from '../constants';
import type { CategoryFilter } from '../types';
import type { CalendarDate } from '../utils/calendarDate';
import type { PregnancyPeriod } from '../utils/pregnancyPeriod';

interface HeaderProps {
  today: CalendarDate;
  period: PregnancyPeriod;
  activeCategory: CategoryFilter;
  onCategoryChange: (category: CategoryFilter) => void;
}

export function Header({ today, period, activeCategory, onCategoryChange }: HeaderProps) {
  return (
    <header className="bg-rose-500 text-white pt-6 px-6 pb-4 rounded-b-3xl shadow-md sticky top-0 z-30 flex flex-col">
      <h1 className="text-2xl font-bold mb-1">행복이를 기다리며 🌱</h1>
      <p className="text-rose-100 text-sm mb-4">출산 예정일: {DUE_DATE.toKoreanString()}</p>

      <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mb-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-xs text-rose-100 uppercase tracking-wider mb-1">현재 날짜</p>
            <p className="text-lg font-semibold">{today.toString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-rose-100 uppercase tracking-wider mb-1">
              현재 주수 · {period.formatDDayString()}
            </p>
            <p className="text-3xl font-bold">{period.formatProgressString()}</p>
          </div>
        </div>
      </div>

      <nav className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide" aria-label="카테고리 필터">
        {CATEGORY_FILTERS.map((category) => (
          <button
            key={category}
            type="button"
            onClick={() => onCategoryChange(category)}
            aria-pressed={activeCategory === category}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
              ${activeCategory === category ? 'bg-white text-rose-600 shadow-sm' : 'bg-rose-400/50 text-rose-50 hover:bg-rose-400'}`}
          >
            {category}
          </button>
        ))}
      </nav>
    </header>
  );
}
