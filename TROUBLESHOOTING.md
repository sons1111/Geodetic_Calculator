# TROUBLESHOOTING.md (오류 분석 및 해결 기록)

본 문서는 하이브리드 변수 연동 측지/공학용 계산기 개발 중 발생하는 빌드 오류, 수식 파서 예외, UI 렌더링 이슈 등을 체계적으로 기록하고 해결하기 위한 가이드입니다.

---

## 에러 기록 양식 (Template)

```markdown
### [ERR-00X] 에러 제목 요약
- **발생 일시**: YYYY-MM-DD
- **발생 위치**: (예: `src/utils/calculatorEngine.ts`)
- **증상 (Symptoms)**: 에러 메시지 또는 비정상 동작 내용
- **원인 분석 (Root Cause)**: 왜 이 문제가 발생했는지 기술
- **해결 방안 (Solution)**: 적용한 코드 수정 내용 및 결과
```

## 에러 로그 목록

### [ERR-001] JavaScript 부동소수점 연산 오차 (`0.1 + 0.2 !== 0.3`)

- **발생 일시**: 2026-03-29 (예시)
- **발생 위치**: `src/utils/calculatorEngine.ts`
- **증상 (Symptoms)**: 소수점 포함 측지 좌표 연산 시 미세한 오차 발생 (예: `12.345000000000002`)
- **원인 분석 (Root Cause)**: JavaScript 기본 `Number` 타입은 IEEE 754 표준을 따르므로 고정밀 소수점 연산에서 오차가 누적됨.
- **해결 방안 (Solution)**: `decimal.js` 라이브러리를 도입하여 모든 계산 및 변수 값을 `Decimal` 객체로 처리하도록 설계 반영.

### [ERR-002] 변수 순환 참조 (Circular Reference) 예외

- **발생 일시**: 2026-03-29 (예시)
- **발생 위치**: `src/utils/calculatorEngine.ts`
- **증상 (Symptoms)**: 사용자가 `A = B + 1`, `B = A + 1`과 같이 서로를 참조하는 수식을 입력했을 때 무한 루프 또는 Stack Overflow 발생.
- **원인 분석 (Root Cause)**: 수식 내 변수 치환 시 의존성 그래프를 검증하지 않아 발생하는 무한 재귀 호출.
- **해결 방안 (Solution)**: 변수 파싱 및 AST 치환 단계에서 방문한 변수 목록을 추적하여 순환 참조 감지 시 즉시 에러(`Circular Reference Error`)를 반환하도록 예외 처리 로직 추가 예정.
