import { useState } from 'react';
import { DashboardCard } from './components/DashboardCard';
import { Header } from './components/Header';
import { MobileSummarySheet } from './components/MobileSummarySheet';
import { Timeline } from './components/Timeline';
import { actionItems } from './data/actionItems';
import { useCurrentWeek } from './hooks/useCurrentWeek';
import type { CategoryFilter } from './types';
import { ongoingDurations } from './utils/timeline';

function App() {
  const { today, period, timelineWeek } = useCurrentWeek(actionItems.milestones);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('전체');

  const ongoing = ongoingDurations(actionItems.durationItems, timelineWeek);
  const summary = {
    week: timelineWeek,
    supplements: ongoing.filter((d) => d.category === '영양제'),
    routines: ongoing.filter((d) => d.category !== '영양제'),
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 좌측 여백 | 중앙 타임라인 | 우측 사이드바: 양쪽 flex-1로 중앙(max-w-md)을 화면 정중앙에 고정 */}
      <div className="flex w-full max-w-[1300px] justify-center">
        <div className="hidden lg:block flex-1 max-w-[320px]" />

        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col relative pb-10 min-h-screen z-10">
          <Header today={today} period={period} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />
          <main className="flex-1 px-4 py-6 md:py-8">
            <Timeline data={actionItems} week={timelineWeek} activeCategory={activeCategory} />
          </main>
        </div>

        {/* 우측 사이드바 대시보드 (PC/태블릿 전용, 스크롤 따라다님) */}
        <aside className="hidden lg:block flex-1 max-w-[320px] relative">
          <div className="sticky top-10 left-6 w-72 mt-10 ml-8">
            <DashboardCard {...summary} />
          </div>
        </aside>
      </div>

      <MobileSummarySheet {...summary} />
    </div>
  );
}

export default App;
