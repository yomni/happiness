# Project Rules: 행복이의 탄생

이 파일은 향후 AI(또는 개발자)가 본 프로젝트의 코드를 작성하거나 수정할 때 준수해야 할 규칙을 정의합니다.

## 1. 환경 및 배포 제약사항 (Strict Static Site)
- 본 프로젝트는 **GitHub Pages** 전용 정적 웹사이트입니다.
- Node.js 백엔드, DB 연결, API 통신 등 서버 측 로직은 포함하지 않습니다. 모든 데이터 처리는 클라이언트 사이드에서 정적 데이터(JSON)를 바탕으로 이루어집니다.
- `vite.config.ts` 설정 시 GitHub Pages 서브디렉토리 경로를 고려하여 `base` 옵션 설정을 주의해야 합니다.

## 2. 시간대(Timezone) 원칙
- 프로젝트의 모든 날짜 기준은 **KST (UTC+9)**를 따릅니다.
- 브라우저 환경이 어디든 KST 날짜 기준으로 Action Item이 갱신되어야 합니다. 날짜 비교/파싱을 할 때 반드시 로컬(Client) 타임존이 아닌 `Asia/Seoul` 타임존을 기준으로 변환하여 `yyyy-mm-dd`를 도출하세요. (date-fns-tz 등의 경량 라이브러리를 쓰거나 Intl API를 사용)

## 3. UI/UX 개발 원칙
- **Mobile First**: 스마트폰 뷰포트를 최우선으로 설계합니다. 모든 Tailwind CSS 클래스는 모바일에 먼저 맞춰 작성하고, 태블릿이나 데스크탑은 화면이 너무 넓어 보이지 않도록 `max-w-md` 또는 `max-w-lg`로 래핑하여 중앙 정렬합니다.
- **시각적 구분**: 카테고리(`checkup`, `supplement`, `welfare`, `prenatal`, `preparation`)별로 명확하고 일관된 테마 색상(Tailwind 컬러 팔레트)을 적용하여 구분감을 줍니다.
- **접근성(Accessibility)**: 색상뿐만 아니라 텍스트 라벨과 아이콘을 활용하여 정보를 직관적으로 전달합니다.

## 4. 코드 스타일 및 아키텍처
- **TypeScript 필수**: 모든 컴포넌트 Props와 주차별 데이터는 명확한 인터페이스(Interface/Type)를 가져야 합니다.
- **날짜 모의(Mocking) 테스트 가능성**: `current_date` 파라미터를 통해 미래나 과거의 임신 주차별 화면을 디버깅할 수 있어야 합니다. 파라미터가 유효한 날짜 포맷(`YYYY-MM-DD`)이 아니면 오늘 날짜(KST)로 폴백해야 합니다.
- 데이터와 뷰의 분리: 주차별 계산 로직이나 데이터를 가공하는 로직은 View 컴포넌트 내부에 두지 않고 `utils`나 custom `hooks`로 분리합니다.
