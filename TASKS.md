# TASKS.md (진행 체크리스트)

## Phase 1: 프로젝트 초기화 및 환경 설정
- [x] **Task 1**: 프로젝트 초기화 및 기본 패키지 설정 (Vite + React + TS + Tailwind + Math.js / Decimal.js)
- [x] **Task 2**: 프로젝트 디렉토리 트리 구조 및 기본 타입 정의 (`src/types/calculator.ts`)
- [x] **Task 3**: 로컬 스토리지 / IndexedDB 기본 래퍼 유틸 구축 (`src/utils/storage.ts`)
- [x] **Task 4**: 에러 처리 및 트러블슈팅 템플릿 준비 (`TROUBLESHOOTING.md` 작성)

## Phase 2: UI/UX 디자인 및 레이아웃 설계
- [x] **Task 5**: 메인 계산기 뷰포트 레이아웃 및 디스플레이 컴포넌트 구현 (`src/components/Display.tsx`)
- [x] **Task 6**: 반응형 키패드 그리드 컴포넌트 설계 (`src/components/Keypad.tsx`)
- [x] **Task 7**: 변수 관리 모달/패널 컴포넌트 구현 (`src/components/VariablePanel.tsx`)

## Phase 3: 핵심 연산 및 변수 엔진 개발
- [x] **Task 8**: 핵심 연산 엔진 및 수식 파서 기초 구축 (`src/utils/calculatorEngine.ts`)
- [x] **Task 8-EX**: 한글 및 영문 단어 변수명(예: `거리`, `위도`, `dist`) 지원 고도화 적용
- [x] **Task 9**: 순환 참조 방지 및 고급 변수 바인딩 로직 고도화

## Phase 4: 연산 히스토리 및 영구 저장 관리
- [x] **Task 10**: 연산 히스토리 관리 컴포넌트 및 로컬스토리지 연동 구현 (`src/components/HistoryPanel.tsx`)

## Phase 5: 측지/공학 특화 전용 기능 구현
- [x] **Task 11**: 각도 변환 및 도분초(DMS: Degree-Minute-Second) <=> 십진도 변환 유틸 구축 (`src/utils/dmsUtils.ts`)
- [x] **Task 12**: 측지 전용 계산 모드(방위각/거리 계산, 좌표 역산 등) 모듈 추가 (`src/utils/geodesyCalculations.ts`)
- [x] **Task 13**: 계산기 모드 설정 및 환경 설정 패널(정밀도 소수점 자릿수 조절 등) 구현 (`src/components/SettingsPanel.tsx`)

## Phase 6: Capacitor 모바일 패키징 및 최종 검증
- [x] **Task 14**: Capacitor 설정 및 안드로이드/iOS 네이티브 빌드 환경 구성 (`capacitor.config.ts`)
- [ ] **Task 15**: 오프라인 작동 테스트 및 최종 빌드 최적화 (`npm run build`)
