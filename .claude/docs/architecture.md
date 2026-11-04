# 시스템 아키텍처 및 기술 스택 설계서

## 1. 기술 스택 선정

이 프로젝트는 **GitHub Pages를 통해 배포되는 정적 페이지**라는 요구사항을 충족하기 위해 서버리스(Serverless) 프론트엔드 환경으로 구성됩니다.

- **프레임워크 (Framework)**: Vite + React + TypeScript
  - **이유**: 빠르고 가벼운 번들러인 Vite와 생태계가 풍부한 React를 사용하여 SPA(Single Page Application)로 구축합니다. GitHub Pages와 완벽하게 호환되며 정적 렌더링에 적합합니다. TypeScript를 적용해 주차별 데이터 구조의 타입 안정성을 확보합니다.
- **스타일링 (Styling)**: Tailwind CSS
  - **이유**: 모바일 친화적(Mobile-first)인 세로형 UI를 빠르게 구축할 수 있습니다. 유틸리티 클래스 기반이라 카테고리별(검사, 영양제 등) 시각적 색상/디자인 구분을 직관적으로 적용하기 좋습니다.
- **상태 관리 및 라우팅**: React `useState` & 브라우저 `URLSearchParams` API
  - **이유**: 복잡한 라우팅보다 `?current_date=yyyy-mm-dd` 단일 파라미터만 처리하면 되므로, 무거운 Router 라이브러리(React Router 등) 없이 `URLSearchParams` 만으로 파라미터를 읽어 처리하여 번들 사이즈를 줄입니다.
- **배포 (Deployment)**: GitHub Actions(`actions/deploy-pages`) + GitHub Pages, `main` 푸시 시 자동 배포

## 2. 디렉토리 구조

```text
happiness/
├── .claude/docs/           # 설계 문서 (본 문서)
├── .github/                # 이슈 템플릿, GitHub Pages 배포 워크플로우
├── public/                 # 파비콘 등 정적 에셋
├── src/
│   ├── components/         # 표시 전용 컴포넌트
│   │   ├── Header.tsx             # 예정일, 오늘 날짜, 주수·D-Day, 카테고리 필터
│   │   ├── Timeline.tsx           # milestone 목록, 현재 주차 자동 스크롤
│   │   ├── MilestoneSection.tsx   # 구간 하나 (트랙, 기간 카드, 포인트 카드)
│   │   ├── DurationCards.tsx      # 기간 항목 시작/종료 카드
│   │   ├── PointCard.tsx          # 일회성 항목 카드
│   │   ├── DashboardCard.tsx      # 이번 주 영양제·루틴 요약
│   │   ├── MobileSummarySheet.tsx # 모바일 플로팅 버튼 + 바텀시트
│   │   └── ProductLink.tsx        # 쇼핑 링크 + 툴팁
│   ├── data/
│   │   ├── actionItems.json   # 주차별 Action Item 데이터
│   │   └── actionItems.ts     # JSON을 ActionItems 타입으로 노출
│   ├── hooks/
│   │   └── useCurrentWeek.ts  # 날짜 파라미터 → 오늘, 주수, 타임라인 주차
│   ├── utils/                 # 순수 로직 (모두 *.test.ts 동반)
│   │   ├── calendarDate.ts    # 시간대 없는 날짜 VO, KST 오늘 날짜
│   │   ├── currentDate.ts     # ?current_date 파싱 및 폴백
│   │   ├── pregnancyPeriod.ts # 주수/D-Day/삼분기 VO
│   │   └── timeline.ts        # milestone 상태, 기간 항목 필터링
│   ├── constants.ts        # 예정일, 카테고리 필터, 카테고리 테마 색상
│   ├── types.ts            # 데이터 타입
│   ├── App.tsx             # 레이아웃 조립
│   └── main.tsx
├── CLAUDE.md               # 프로젝트 규칙
└── vite.config.ts          # base: './' (GitHub Pages 서브경로 대응)
```

## 3. 데이터 구조 (JSON)

데이터는 정적 JSON 파일(`src/data/actionItems.json`)로 관리하며 세 종류의 컬렉션으로 구성됩니다.

- `milestones`: 타임라인 구간. `id`, `startWeek`, `endWeek`
- `pointItems`: 특정 구간에 한 번 챙길 항목. `weekGroup`(milestone id), `category`, `title`, `description`
- `durationItems`: 여러 주에 걸쳐 지속되는 항목(영양제 복용, 태교 루틴 등). `id`, `startWeek`, `endWeek`, `category`, `title`, `description`, 선택 `productName`, `productLink`

`category` 값은 `검사`, `영양제`, `복지`, `준비물`, `태교` 중 하나입니다.

```json
{
  "milestones": [{ "id": "m1", "startWeek": 4, "endWeek": 5 }],
  "pointItems": [
    {
      "weekGroup": "m1",
      "category": "복지",
      "title": "임산부 등록 및 엽산 수령 (광주시 보건소)",
      "description": "..."
    }
  ],
  "durationItems": [
    {
      "id": "d2",
      "startWeek": 4,
      "endWeek": 40,
      "category": "영양제",
      "title": "엽산",
      "description": "...",
      "productName": "...",
      "productLink": "https://search.shopping.naver.com/search/all?query=..."
    }
  ]
}
```

### 3.1. 핵심 로직 (날짜 및 포커싱)
1. **날짜 결정** (`resolveCurrentDate`):
   - `?current_date=YYYY-MM-DD`를 `CalendarDate.parse`로 검증 (존재하지 않는 날짜도 거부).
   - 없거나 잘못되면 `CalendarDate.todayInKST()`로 폴백. 브라우저 시간대와 무관하게 Asia/Seoul 달력 날짜를 사용.
2. **주수 계산** (`PregnancyPeriod.fromDueDate`):
   - 예정일을 **40주 0일**로 보고 `경과일 = 280 - (오늘 → 예정일 일수)`. 임신 시작 전은 0일로 고정.
   - 표기는 "N주 M일" (N = `floor(경과일/7)`, M = 나머지). D-Day는 `D-n` / `D-Day` / `D+n`.
   - 날짜 차이는 UTC 자정 기준으로 계산해 시간대·서머타임 영향이 없음.
3. **타임라인 주차** (`clampToTimeline`): N이 마지막 milestone(44주)을 넘으면 44로 고정해 마지막 구간을 "이번 주"로 유지.
4. **UI 포커싱**: 현재 구간 `<section>`에 `ref`를 걸고, 주차·카테고리 변경 300ms 후 `scrollIntoView({ behavior: 'smooth', block: 'center' })`. 언마운트·재실행 시 타이머 정리.
