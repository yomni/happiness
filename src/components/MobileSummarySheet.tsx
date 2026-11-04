import { useState, type ComponentProps } from 'react';
import { DashboardCard } from './DashboardCard';

type MobileSummarySheetProps = Omit<ComponentProps<typeof DashboardCard>, 'className'>;

/** Floating button + bottom sheet that shows the dashboard on small screens. */
export function MobileSummarySheet(props: MobileSummarySheetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const count = props.supplements.length + props.routines.length;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-6 right-6 bg-rose-500 text-white p-4 rounded-full shadow-2xl hover:bg-rose-600 active:scale-95 transition-all z-40 flex items-center justify-center border-2 border-white/20"
        aria-label="오늘 요약 보기"
      >
        <span className="text-2xl leading-none shadow-sm">💊</span>
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-green-500 text-white text-[11px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
            {count}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 backdrop-blur-sm transition-opacity"
          role="dialog"
          aria-modal="true"
          aria-label="오늘 챙길 리스트"
        >
          <div className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden pb-6 sm:pb-0 animate-[slideUp_0.3s_ease-out]">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gray-50/80">
              <h3 className="font-bold text-gray-800 text-lg">✨ 오늘 챙길 리스트</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="닫기"
                className="text-gray-500 bg-gray-200/80 hover:bg-gray-300 p-2 rounded-full w-8 h-8 flex items-center justify-center font-bold transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-5 bg-white">
              <DashboardCard {...props} className="border-none shadow-none p-0 bg-transparent" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
