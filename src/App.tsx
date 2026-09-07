import { useEffect, useState, useRef } from 'react';
import actionItemsData from './data/actionItems.json';
import { getKSTDate, calculatePregnancyWeek, formatDateString } from './utils/dateUtils';
import './index.css';

interface Milestone {
  id: string;
  startWeek: number;
  endWeek: number;
}

interface PointItem {
  weekGroup: string;
  category: string;
  title: string;
  description: string;
}

interface DurationItem {
  id: string;
  startWeek: number;
  endWeek: number;
  category: string;
  title: string;
  description: string;
}

const DUE_DATE = new Date('2027-04-18T00:00:00+09:00');
const CATEGORIES = ['전체', '검사', '영양제', '복지', '준비물', '태교'];

function App() {
  const [currentDate, setCurrentDate] = useState<Date>(getKSTDate());
  const [currentWeek, setCurrentWeek] = useState<number>(0);
  const [activeCategory, setActiveCategory] = useState<string>('전체');
  const [isMobileModalOpen, setIsMobileModalOpen] = useState<boolean>(false);
  
  const currentWeekRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const dateParam = params.get('current_date');
    
    let activeDate = getKSTDate();
    if (dateParam) {
      const parsedDate = new Date(`${dateParam}T00:00:00+09:00`);
      if (!isNaN(parsedDate.getTime())) {
        activeDate = parsedDate;
      }
    }
    
    setCurrentDate(activeDate);
    setCurrentWeek(calculatePregnancyWeek(activeDate, DUE_DATE));
  }, []);

  useEffect(() => {
    if (currentWeekRef.current) {
      setTimeout(() => {
        currentWeekRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    }
  }, [currentWeek, activeCategory]);

  const getCategoryStyle = (category: string, isPast: boolean) => {
    if (isPast) return 'bg-gray-50 text-gray-400 border-gray-100';
    switch (category) {
      case '검사': return 'bg-blue-50 text-blue-800 border-blue-200';
      case '영양제': return 'bg-green-50 text-green-800 border-green-200';
      case '복지': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case '태교': return 'bg-pink-50 text-pink-800 border-pink-200';
      case '준비물': return 'bg-purple-50 text-purple-800 border-purple-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  const getTrackColor = (category: string, isPast: boolean) => {
    if (isPast) return 'bg-gray-200';
    switch (category) {
      case '영양제': return 'bg-green-400';
      case '태교': return 'bg-pink-400';
      default: return 'bg-gray-400';
    }
  };

  const currentOngoingItems = actionItemsData.durationItems.filter(
    (d: DurationItem) => currentWeek >= d.startWeek && currentWeek <= d.endWeek
  );
  const currentSupplements = currentOngoingItems.filter(d => d.category === '영양제');
  const currentCare = currentOngoingItems.filter(d => d.category !== '영양제');

  const DashboardCard = ({ className = "" }) => (
    <div className={`bg-gradient-to-br from-rose-50 to-orange-50/50 rounded-2xl p-5 shadow-sm border border-rose-100 ${className}`}>
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm text-xs">✨</span> 
        복용해야되는 영양제 ({currentWeek}주차)
      </h2>
      
      {currentSupplements.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold text-green-700 mb-2">💊 복용 중인 영양제</h3>
          <div className="flex flex-wrap gap-2">
            {currentSupplements.map(s => (
              <span key={s.id} className="bg-white text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-100">
                {s.title}
              </span>
            ))}
          </div>
        </div>
      )}
      
      {currentCare.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-pink-700 mb-2">💗 실천 중인 루틴</h3>
          <div className="flex flex-wrap gap-2">
            {currentCare.map(c => (
              <span key={c.id} className="bg-white text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-pink-100">
                {c.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {currentSupplements.length === 0 && currentCare.length === 0 && (
        <p className="text-sm text-gray-500">현재 주차에 꾸준히 진행해야 할 항목이 없습니다.</p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      {/* 
        3단 레이아웃: 좌측 여백(균형잡기) | 중앙 타임라인 | 우측 사이드바 
        flex-1을 양쪽에 배치하여 중앙(max-w-md)이 모니터 정중앙에 고정되도록 합니다.
      */}
      <div className="flex w-full max-w-[1300px] justify-center">
        
        {/* 왼쪽: 투명한 여백 공간 (우측 사이드바와 동일한 너비를 가져서 중앙을 완벽하게 맞춤) */}
        <div className="hidden lg:block flex-1 max-w-[320px]" />

        {/* 중앙: 메인 타임라인 영역 (항상 정중앙에 위치) */}
        <div className="w-full max-w-md bg-white shadow-2xl flex flex-col relative pb-10 min-h-screen z-10">
          
          <header className="bg-rose-500 text-white pt-6 px-6 pb-4 rounded-b-3xl shadow-md sticky top-0 z-30 flex flex-col">
            <h1 className="text-2xl font-bold mb-1">행복이를 기다리며 🌱</h1>
            <p className="text-rose-100 text-sm mb-4">출산 예정일: 2027년 4월 18일</p>
            
            <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm mb-4">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-xs text-rose-100 uppercase tracking-wider mb-1">현재 날짜</p>
                  <p className="text-lg font-semibold">{formatDateString(currentDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-rose-100 uppercase tracking-wider mb-1">현재 주차</p>
                  <p className="text-3xl font-bold">{currentWeek}주차</p>
                </div>
              </div>
            </div>

            <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-semibold transition-colors
                    ${activeCategory === cat 
                      ? 'bg-white text-rose-600 shadow-sm' 
                      : 'bg-rose-400/50 text-rose-50 hover:bg-rose-400'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          <main className="flex-1 px-4 py-6 md:py-8">
            
            {/* Timeline */}
            <div className="flex flex-col">
              {actionItemsData.milestones.map((milestone: Milestone) => {
                const isPast = currentWeek > milestone.endWeek;
                const isCurrent = currentWeek >= milestone.startWeek && currentWeek <= milestone.endWeek;
                
                const rawPoints = actionItemsData.pointItems.filter((p: PointItem) => p.weekGroup === milestone.id);
                const rawDurations = actionItemsData.durationItems.filter(
                  (d: DurationItem) => d.startWeek <= milestone.endWeek && d.endWeek >= milestone.startWeek
                );

                const points = activeCategory === '전체' 
                  ? rawPoints 
                  : rawPoints.filter(p => p.category === activeCategory);
                  
                const activeDurations = activeCategory === '전체'
                  ? rawDurations
                  : rawDurations.filter(d => d.category === activeCategory);

                if (points.length === 0 && activeDurations.length === 0) {
                  return null;
                }

                const hasSupplement = activeDurations.some(d => d.category === '영양제');
                const hasCare = activeDurations.some(d => d.category === '태교');

                return (
                  <div 
                    key={milestone.id} 
                    className="flex w-full relative"
                    ref={isCurrent ? currentWeekRef : null}
                  >
                    <div className="relative flex-shrink-0 w-16">
                      <div className="absolute left-[15px] top-0 bottom-0 w-0.5 bg-rose-100" />
                      
                      <div className={`absolute left-[7.5px] top-2 w-4 h-4 rounded-full border-2 border-white z-10
                        ${isCurrent ? 'bg-rose-500 animate-pulse ring-4 ring-rose-200' : (isPast ? 'bg-gray-300' : 'bg-rose-300')}`} 
                      />

                      <div className="absolute left-[28px] top-0 bottom-0 flex space-x-1.5 z-0">
                        {hasSupplement && (
                          <div className={`w-1.5 h-full ${getTrackColor('영양제', isPast)}`} />
                        )}
                        {hasCare && (
                          <div className={`w-1.5 h-full ${getTrackColor('태교', isPast)}`} />
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-1 pb-10 pr-2 pt-1">
                      <h2 className={`text-xl font-bold mb-4 flex items-center transition-colors duration-300
                        ${isCurrent ? 'text-rose-600' : (isPast ? 'text-gray-400' : 'text-gray-800')}`}>
                        {milestone.startWeek === milestone.endWeek 
                          ? `${milestone.startWeek}주차` 
                          : `${milestone.startWeek}~${milestone.endWeek}주차`}
                        {isCurrent && (
                          <span className="ml-3 text-xs bg-rose-100 text-rose-600 px-2 py-1 rounded-full font-medium">
                            이번 주
                          </span>
                        )}
                      </h2>
                      
                      {activeDurations.map(d => (
                         d.startWeek >= milestone.startWeek && d.startWeek <= milestone.endWeek ? (
                          <div key={`start-${d.id}`} className={`mb-3 p-3 rounded-lg border flex flex-col gap-1 
                            ${isPast ? 'opacity-70 border-gray-200 bg-gray-50' : 
                             (d.category==='영양제' ? 'border-green-300 bg-green-50/80 shadow-sm' : 'border-pink-300 bg-pink-50/80 shadow-sm')}`}>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold text-white 
                                ${isPast ? 'bg-gray-400' : (d.category === '영양제' ? 'bg-green-500' : 'bg-pink-400')}`}>
                                {d.category} 시작
                              </span>
                              <span className={`text-sm font-bold ${isPast ? 'text-gray-500' : 'text-gray-800'}`}>
                                {d.title}
                              </span>
                            </div>
                            <p className={`text-xs ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                              {d.description} ({d.category === '영양제' ? '복용' : '진행'}: {d.startWeek}주 ~ {d.endWeek}주)
                            </p>
                          </div>
                         ) : null
                      ))}

                      {activeDurations.map(d => (
                         d.endWeek >= milestone.startWeek && d.endWeek <= milestone.endWeek ? (
                          <div key={`end-${d.id}`} className={`mb-4 p-3 rounded-lg border border-dashed flex flex-col gap-1 
                            ${isPast ? 'opacity-60 border-gray-200 bg-gray-50' : 
                             (d.category==='영양제' ? 'border-green-200 bg-green-50/30' : 'border-pink-200 bg-pink-50/30')}`}>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-0.5 rounded text-xs font-bold text-gray-500 bg-gray-200`}>
                                {d.category === '영양제' ? '복용 종료' : '진행 완료'}
                              </span>
                              <span className={`text-sm font-bold ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                                {d.title}
                              </span>
                            </div>
                            <p className={`text-xs text-gray-400`}>
                              이번 주({d.endWeek}주차)까지만 {d.category === '영양제' ? '복용하세요' : '진행하세요'}.
                            </p>
                          </div>
                         ) : null
                      ))}

                      <div className="space-y-3">
                        {points.map((item: PointItem, i: number) => (
                          <div 
                            key={`p-${i}`} 
                            className={`border rounded-xl p-4 transition-all duration-300
                              ${isCurrent ? 'bg-white shadow-md border-rose-200' : 
                               (isPast ? 'bg-white/50 border-gray-100 shadow-sm opacity-60' : 'bg-white shadow-sm border-gray-100')}
                            `}
                          >
                            <span className={`inline-block px-2 py-1 rounded text-xs font-semibold border mb-2 ${getCategoryStyle(item.category, isPast)}`}>
                              {item.category}
                            </span>
                            <h3 className={`text-base font-bold mb-1 ${isPast ? 'text-gray-500' : 'text-gray-900'}`}>
                              {item.title}
                            </h3>
                            <p className={`text-xs leading-relaxed ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
                              {item.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>

        {/* 오른쪽: 사이드바 대시보드 (PC/태블릿에서만 보임, 스크롤 따라다님) */}
        <div className="hidden lg:block flex-1 max-w-[320px] relative">
          <div className="sticky top-10 left-6 w-72 mt-10 ml-8">
            <DashboardCard />
          </div>
        </div>

      </div>

      {/* 모바일 하단 플로팅 버튼 (Floating Action Button) */}
      <button 
        onClick={() => setIsMobileModalOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-rose-500 text-white p-4 rounded-full shadow-2xl hover:bg-rose-600 active:scale-95 transition-all z-40 flex items-center justify-center border-2 border-white/20"
        aria-label="오늘 요약 보기"
      >
        <span className="text-2xl leading-none shadow-sm">💊</span>
        {(currentSupplements.length > 0 || currentCare.length > 0) && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {currentSupplements.length + currentCare.length}
          </span>
        )}
      </button>

      {/* 모바일 대시보드 팝업(모달) */}
      {isMobileModalOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-opacity">
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pb-6 sm:pb-0 animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/80">
              <h3 className="font-bold text-gray-800 text-lg">✨ 오늘 챙길 리스트</h3>
              <button 
                onClick={() => setIsMobileModalOpen(false)} 
                className="text-gray-500 bg-gray-200/80 hover:bg-gray-300 p-2 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-5 bg-white">
              <DashboardCard className="border-none shadow-none p-0 bg-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* 모달 슬라이드업 애니메이션 용 커스텀 CSS */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}} />
    </div>
  );
}

export default App;
