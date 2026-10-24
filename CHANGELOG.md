# Changelog

## [1.0.0] - 2026-03-29
- [Task 1] Vite + React + TypeScript 환경 구성 및 필수 의존성(`mathjs`, `decimal.js`, `lucide-react`, `Tailwind CSS`) 설정 완료.
- [Task 2] 계산기 상태, 변수맵, 각도 단위(`Deg/Rad/Grad`), 히스토리 관리를 위한 TypeScript 기본 타입 정의 완료 (`src/types/calculator.ts`).
- [Task 3] 오프라인 현장 환경 대비 변수, 히스토리, 설정 값을 영구 저장하는 LocalStorage 래퍼 유틸리티 구현 완료 (`src/utils/storage.ts`).
- [Task 4] 향후 발생할 수 있는 수식 에러, 부동소수점 오차, 순환 참조 이슈를 체계적으로 기록하기 위한 트러블슈팅 템플릿 작성 완료 (`TROUBLESHOOTING.md`).
- [Task 5] 멀티라인 LCD 스타일 디스플레이 컴포넌트 및 SHIFT/ALPHA/각도 상태 인디케이터 구현 완료 (`src/components/Display.tsx`).
- [Task 6] 실물 공학용 계산기 레이아웃 기반 반응형 키패드 그리드 컴포넌트 구현 완료 (`src/components/Keypad.tsx`).
- [Task 7] 사용자 정의 변수(A~Z) 등록, 수정, 삭제 및 메모리 관리를 위한 모달 패널 컴포넌트 구현 완료 (`src/components/VariablePanel.tsx`).
- [Task 8] `mathjs` 및 `decimal.js` 기반 수식 파서, 변수 자동 치환, 각도 단위(DEG/RAD/GRAD) 삼각함수 보정 연산 엔진 구축 완료 (`src/utils/calculatorEngine.ts`).
- [Task 8-EX] 수식 엔진 및 변수 관리 패널에 한글 및 영문 단어 변수명(예: `거리`, `위도`, `angle`) 사용 기능 고도화 완료.
- [Task 9] 변수 간 무한 루프 및 순환 참조(Circular Reference) 방지를 위한 의존성 검증 로직 구현 완료.
- [Task 10] 연산 히스토리 목록 조회, 수식 불러오기 및 전체 삭제 기능을 제공하는 히스토리 패널 컴포넌트 구현 완료 (`src/components/HistoryPanel.tsx`).
- [Task 11] 고정밀 `decimal.js` 기반의 도분초(DMS)와 십진도(DD) 간 상호 변환 및 포맷팅 유틸리티 구현 완료 (`src/utils/dmsUtils.ts`).
- [Task 12] 측지 평면 좌표계 기반의 좌표 역산(거리 및 방위각 산출) 및 좌표 전산(종점 좌표 산출) 모듈 구현 완료 (`src/utils/geodesyCalculations.ts`).
- [Task 13] 각도 단위(DEG/RAD/GRAD) 및 출력 결과 소수점 정밀도 자릿수를 동적으로 제어하는 환경 설정 패널 컴포넌트 구현 완료 (`src/components/SettingsPanel.tsx`).
- [Task 14] 모바일 네이티브(Android/iOS) 패키징을 위한 Capacitor 설정 파일(`capacitor.config.ts`) 구성 완료.
