import { CATEGORY_THEME, PAST_THEME } from '../constants';
import type { DurationItem } from '../types';
import { ProductLink } from './ProductLink';

const isSupplement = (item: DurationItem) => item.category === '영양제';

interface DurationCardProps {
  item: DurationItem;
  isPast: boolean;
}

export function DurationStartCard({ item, isPast }: DurationCardProps) {
  const theme = CATEGORY_THEME[item.category];

  return (
    <div
      className={`mb-3 p-3 rounded-lg border flex flex-col gap-1
        ${isPast ? 'opacity-70 border-gray-200 bg-gray-50' : theme.startCard}`}
    >
      <div className="flex items-center gap-2">
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold text-white ${isPast ? PAST_THEME.solidBadge : theme.solidBadge}`}
        >
          {item.category} 시작
        </span>
        <span className={`text-sm font-bold flex items-center gap-1.5 ${isPast ? 'text-gray-500' : 'text-gray-800'}`}>
          {item.title}
          {item.productLink && !isPast && (
            <ProductLink
              href={item.productLink}
              tooltip={`${item.productName || item.title} 구매 검색`}
              className="inline-flex items-center justify-center w-5 h-5 bg-white border border-gray-200 text-gray-500 rounded-full hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 transition-colors shadow-sm"
            >
              <span className="text-[10px]" aria-label="구매 검색">
                🛒
              </span>
            </ProductLink>
          )}
        </span>
      </div>
      <p className={`text-xs ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>
        {item.description} ({isSupplement(item) ? '복용' : '진행'}: {item.startWeek}주 ~ {item.endWeek}주)
      </p>
    </div>
  );
}

export function DurationEndCard({ item, isPast }: DurationCardProps) {
  const theme = CATEGORY_THEME[item.category];

  return (
    <div
      className={`mb-4 p-3 rounded-lg border border-dashed flex flex-col gap-1
        ${isPast ? 'opacity-60 border-gray-200 bg-gray-50' : theme.endCard}`}
    >
      <div className="flex items-center gap-2">
        <span className="px-2 py-0.5 rounded text-xs font-bold text-gray-500 bg-gray-200">
          {isSupplement(item) ? '복용 종료' : '진행 완료'}
        </span>
        <span className={`text-sm font-bold ${isPast ? 'text-gray-400' : 'text-gray-600'}`}>{item.title}</span>
      </div>
      <p className="text-xs text-gray-400">
        이번 주({item.endWeek}주차)까지만 {isSupplement(item) ? '복용하세요' : '진행하세요'}.
      </p>
    </div>
  );
}
