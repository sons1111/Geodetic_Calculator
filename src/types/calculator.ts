import Decimal from 'decimal.js';

/** 각도 단위 설정 */
export type AngleUnit = 'DEG' | 'RAD' | 'GRAD';

/** 소수점 및 디스플레이 표기 모드 */
export type DisplayMode = 'NORM' | 'FIX' | 'SCI';

/** 변수 저장 구조 (이름 -> Decimal 값 및 원본 문자열) */
export interface VariableMap {
  [key: string]: {
    value: Decimal;
    rawString: string;
  };
}

/** 연산 히스토리 항목 */
export interface CalculationHistory {
  id: string;
  formula: string;
  result: string;
  timestamp: number;
}

/** 계산기 전체 상태 모델 */
export interface CalculatorState {
  currentInput: string;
  lastResult: string;
  angleUnit: AngleUnit;
  displayMode: DisplayMode;
  decimalPlaces: number;
  variables: VariableMap;
  history: CalculationHistory[];
  isShiftActive: boolean;
  isAlphaActive: boolean;
}

/** 키패드 버튼 타입 정의 */
export type ButtonType =
  | 'NUMBER'
  | 'OPERATOR'
  | 'FUNCTION'
  | 'VARIABLE'
  | 'CONTROL'
  | 'MODE';

export interface CalculatorButton {
  id: string;
  label: string;
  subLabel?: string;
  type: ButtonType;
  actionValue: string;
  className?: string;
}
