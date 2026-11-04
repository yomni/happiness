# 시스템 아키텍처 및 기술 스택 설계서

## 1. 기술 스택 선정

이 프로젝트는 **GitHub Pages를 통해 배포되는 정적 페이지**라는 요구사항을 충족하기 위해 서버리스(Serverless) 프론트엔드 환경으로 구성됩니다.

- **프레임워크 (Framework)**: Vite + React + TypeScript
  - **이유**: 빠르고 가벼운 번들러인 Vite와 생태계가 풍부한 React를 사용하여 SPA(Single Page Application)로 구축합니다. GitHub Pages와 완벽하게 호환되며 정적 렌더링에 적합합니다. TypeScript를 적용해 주차별 데이터 구조의 타입 안정성을 확보합니다.
- **스타일링 (Styling)**: Tailwind CSS
  - **이유**: 모바일 친화적(Mobile-first)인 세로형 UI를 빠르게 구축할 수 있습니다. 유틸리티 클래스 기반이라 카테고리별(검사, 영양제 등) 시각적 색상/디자인 구분을 직관적으로 적용하기 좋습니다.
- **상태 관리 및 라우팅**: React `useState` & 브라우저 `URLSearchParams` API
  - **이유**: 복잡한 라우팅보다 `?current_date=yyyy-mm-dd` 단일 파라미터만 처리하면 되므로, 무거운 Router 라이브러리(React Router 등) 없이 `URLSearchParams` 만으로 파라미터를 읽어 처리하여 번들 사이즈를 줄입니다.
- **배포 (Deployment)**: GitHub Actions + GitHub Pages (`gh-pages`)

## 2. 디렉토리 구조

> 현재 구조 기준. `components/`, `hooks/` 분리는 #8에서 진행 예정이며, 그 전까지 UI와 계산 로직이 `App.tsx`에 함께 있습니다.

```text
happiness/
├── .claude/docs/           # 설계 문서 (본 문서)
├── .github/                # 이슈 템플릿, GitHub Pages 배포 워크플로우
├── public/                 # 파비콘 등 정적 에셋
├── src/
│   ├── data/
│   │   └── actionItems.json   # 주차별 Action Item 데이터
│   ├── utils/
│   │   ├── dateUtils.ts       # 주차 계산, KST 날짜 포맷
│   │   └── pregnancyPeriod.ts # 주차/D-Day 값 객체 (미연결, #8에서 통합 예정)
│   ├── App.tsx             # 타임라인·대시보드 UI 및 필터링 로직
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

### 3.1. 핵심 아키텍처 로직 (날짜 및 포커싱)
1. **날짜 결정**: 
   - `URLSearchParams`를 통해 `current_date`를 조회.
   - 없을 경우 `new Date().toLocaleString("en-US", {timeZone: "Asia/Seoul"})` 등을 이용해 KST 기준 오늘 날짜를 구함.
2. **주차 계산**:
   - `출산예정일(2027-04-18)`은 통상 **임신 40주 0일**로 계산됨.
   - 현재일과 출산예정일의 차이를 계산하여 현재 몇 주 몇 일 차인지 도출.
3. **UI 포커싱**:
   - 렌더링 후, 현재 주차에 해당하는 DOM 요소의 `id`를 찾아 `scrollIntoView({ behavior: 'smooth' })`를 호출하여 자동 포커싱.
