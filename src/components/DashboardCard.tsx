import type { DurationItem } from '../types';
import { ProductLink } from './ProductLink';

interface DashboardCardProps {
  week: number;
  supplements: DurationItem[];
  routines: DurationItem[];
  className?: string;
}

/** Summary of supplements and routines to keep up with this week. */
export function DashboardCard({ week, supplements, routines, className = '' }: DashboardCardProps) {
  return (
    <div
      className={`bg-gradient-to-br from-rose-50 to-orange-50/50 rounded-2xl p-5 shadow-sm border border-rose-100 ${className}`}
    >
      <h2 className="text-base font-bold text-gray-800 mb-4 flex items-center">
        <span className="bg-white w-6 h-6 rounded-full flex items-center justify-center mr-2 shadow-sm text-xs">✨</span>
        복용해야되는 영양제 ({week}주차)
      </h2>

      {supplements.length > 0 && (
        <div className="mb-4">
          <h3 className="text-xs font-bold text-green-700 mb-2">💊 복용 중인 영양제</h3>
          <div className="flex flex-wrap gap-2">
            {supplements.map((s) =>
              s.productLink ? (
                <ProductLink
                  key={s.id}
                  href={s.productLink}
                  tooltip={s.productName || s.title}
                  className="bg-white text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-200 hover:bg-green-50 hover:border-green-400 transition-colors cursor-pointer flex items-center gap-1"
                >
                  {s.title} <span className="text-[10px] opacity-70">🛒</span>
                </ProductLink>
              ) : (
                <span
                  key={s.id}
                  className="bg-white text-green-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-green-100"
                >
                  {s.title}
                </span>
              ),
            )}
          </div>
        </div>
      )}

      {routines.length > 0 && (
        <div>
          <h3 className="text-xs font-bold text-pink-700 mb-2">💗 실천 중인 루틴</h3>
          <div className="flex flex-wrap gap-2">
            {routines.map((r) => (
              <span
                key={r.id}
                className="bg-white text-pink-800 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm border border-pink-100"
              >
                {r.title}
              </span>
            ))}
          </div>
        </div>
      )}

      {supplements.length === 0 && routines.length === 0 && (
        <p className="text-sm text-gray-500">현재 주차에 꾸준히 진행해야 할 항목이 없습니다.</p>
      )}
    </div>
  );
}
