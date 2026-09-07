# 시스템 아키텍처 및 기술 스택 설계서

## 1. 기술 스택 선정

이 프로젝트는 **GitHub Pages를 통해 배포되는 정적 페이지**라는 요구사항을 충족하기 위해 서버리스(Serverless) 프론트엔드 환경으로 구성됩니다.

- **프레임워크 (Framework)**: Vite + React + TypeScript
  - **이유**: 빠르고 가벼운 번들러인 Vite와 생태계가 풍부한 React를 사용하여 SPA(Single Page Application)로 구축합니다. GitHub Pages와 완벽하게 호환되며 정적 렌더링에 적합합니다. TypeScript를 적용해 주차별 데이터 구조의 타입 안정성을 확보합니다.
- **스타일링 (Styling)**: Tailwind CSS
  - **이유**: 모바일 친화적(Mobile-first)인 세로형 UI를 빠르게 구축할 수 있습니다. 유틸리티 클래스 기반이라 카테고리별(검사, 영양제 등) 시각적 색상/디자인 구분을 직관적으로 적용하기 좋습니다.
- **상태 관리 및 라우팅**: React Context API & 브라우저 `URLSearchParams` API
  - **이유**: 복잡한 라우팅보다 `?current_date=yyyy-mm-dd` 단일 파라미터만 처리하면 되므로, 무거운 Router 라이브러리(React Router 등) 없이 `URLSearchParams` 만으로 파라미터를 읽어 처리하여 번들 사이즈를 줄입니다.
- **배포 (Deployment)**: GitHub Actions + GitHub Pages (`gh-pages`)

## 2. 디렉토리 구조 설계

```text
/Users/yomni/dev/happiness
├── public/                 # 파비콘, 공유용 썸네일 등 정적 에셋
├── src/
│   ├── assets/             # 프로젝트 내부 이미지, 아이콘
│   ├── components/         # React UI 컴포넌트
│   │   ├── SummaryBoard.tsx   # 최상단 현재 주차 Action Item 요약
│   │   ├── TimelineList.tsx   # 세로 스크롤 주차별 타임라인 래퍼
│   │   └── ActionCard.tsx     # 개별 주차/카테고리별 아이템 카드
│   ├── data/
│   │   └── actionItems.json   # 주차별 Action Item 데이터
│   ├── hooks/
│   │   └── useCurrentWeek.ts  # 날짜 파라미터 파싱, KST 변환 및 주차 계산 로직
│   ├── utils/
│   │   └── dateUtils.ts       # 출산예정일 기준 D-day, 주차 계산 유틸 함수
│   ├── App.tsx             # 메인 앱 진입점
│   └── main.tsx
├── .gemini/
│   ├── docs/architecture.md
│   └── rules/project_rules.md
├── README.md
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts          # base URL 설정 (GitHub Pages 레포지토리명 매핑)
```

## 3. 데이터 구조 설계 (JSON)

데이터는 정적 JSON 파일(`src/data/actionItems.json`)로 관리합니다.

```json
{
  "dueDate": "2027-04-18",
  "timeline": [
    {
      "week": 4,
      "title": "임신 4주차: 임신 확인",
      "items": [
        {
          "id": "item-4-1",
          "category": "checkup",
          "content": "산부인과 방문하여 피검사 및 초음파 예약"
        },
        {
          "id": "item-4-2",
          "category": "supplement",
          "content": "엽산(Folic Acid) 복용 시작 (하루 400~800mcg)"
        },
        {
          "id": "item-4-3",
          "category": "prenatal",
          "content": "편안한 마음가짐 유지하기, 과도한 스트레스 피하기"
        }
      ]
    },
    {
      "week": 5,
      "title": "임신 5주차: 심장소리 확인 대기",
      "items": [
        {
          "id": "item-5-1",
          "category": "welfare",
          "content": "임신확인서 발급 시 국민행복카드(바우처) 신청 준비"
        },
        {
          "id": "item-5-2",
          "category": "preparation",
          "content": "임산부용 편안한 속옷 알아보기"
        }
      ]
    }
  ],
  "categories_meta": {
    "checkup": { "label": "검사/진료", "color": "bg-blue-100 text-blue-800" },
    "supplement": { "label": "영양제", "color": "bg-green-100 text-green-800" },
    "welfare": { "label": "복지/행정", "color": "bg-purple-100 text-purple-800" },
    "prenatal": { "label": "태교/건강", "color": "bg-pink-100 text-pink-800" },
    "preparation": { "label": "준비물", "color": "bg-orange-100 text-orange-800" }
  }
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
