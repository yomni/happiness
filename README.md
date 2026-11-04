# 행복이를 기다리며 🌱

출산 예정일(2027-04-18) 기준으로 임신 주수를 계산하고, 주차별로 챙길 일(검사·영양제·복지·준비물·태교)을 타임라인으로 보여주는 정적 웹페이지입니다. GitHub Pages로 배포됩니다.

## 개발

```bash
npm install
npm run dev      # 개발 서버
npm test         # 단위 테스트 (Vitest)
npm run build    # 타입체크 + 프로덕션 빌드
npm run lint     # oxlint
```

특정 날짜의 화면을 보려면 `?current_date=YYYY-MM-DD` 쿼리 파라미터를 붙입니다. 값이 없거나 잘못되면 오늘(KST)로 대체됩니다.

## 데이터

주차별 항목은 [`src/data/actionItems.json`](src/data/actionItems.json)에서 관리합니다. 구조와 설계는 [`.claude/docs/architecture.md`](.claude/docs/architecture.md)를 참고하세요.
