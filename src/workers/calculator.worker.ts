import Decimal from 'decimal.js';
import { CalculatorEngine } from '../utils/calculatorEngine';
import type { AngleUnit, VariableMap } from '../types/calculator';

interface EvaluateRequest {
  formula: string;
  variables: Record<string, string>;
  angleUnit: AngleUnit;
}

self.onmessage = (event: MessageEvent<EvaluateRequest>) => {
  try {
    const { formula, variables: serializedVariables, angleUnit } = event.data;
    const variables = Object.entries(serializedVariables).reduce<VariableMap>((result, [name, value]) => {
      result[name] = { value: new Decimal(value), rawString: value };
      return result;
    }, {});
    const result = CalculatorEngine.evaluate(formula, variables, angleUnit);
    self.postMessage({ ok: true, result: result.toString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : '계산 중 오류가 발생했습니다.';
    self.postMessage({ ok: false, message });
  }
};
