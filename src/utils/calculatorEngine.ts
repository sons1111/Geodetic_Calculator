import { all, create } from 'mathjs';
import Decimal from 'decimal.js';
import type { AngleUnit, VariableMap } from '../types/calculator';

const math = create(all);
const dmsLiteralPattern = /(-?(?:\d+(?:\.\d*)?|\.\d+))\s*°(?:\s*(\d+(?:\.\d*)?|\.\d+)\s*')?(?:\s*(\d+(?:\.\d*)?|\.\d+)\s*")?/g;

const convertDmsLiterals = (formula: string): string => formula.replace(
  dmsLiteralPattern,
  (_literal, degreeText: string, minuteText?: string, secondText?: string) => {
    const minutes = new Decimal(minuteText ?? 0);
    const seconds = new Decimal(secondText ?? 0);
    if (minutes.isNegative() || minutes.greaterThanOrEqualTo(60)
      || seconds.isNegative() || seconds.greaterThanOrEqualTo(60)) {
      throw new Error('도분초 입력에서 분과 초는 0 이상 60 미만이어야 합니다.');
    }

    const magnitude = new Decimal(degreeText)
      .abs()
      .plus(minutes.div(60))
      .plus(seconds.div(3600));
    return (degreeText.startsWith('-') ? magnitude.negated() : magnitude).toString();
  },
);

export class CalculatorEngine {
  private static convertAngle(value: number, unit: AngleUnit): number {
    if (unit === 'DEG') return value * (Math.PI / 180);
    if (unit === 'GRAD') return value * (Math.PI / 200);
    return value;
  }

  private static convertRadToUnit(radValue: number, unit: AngleUnit): number {
    if (unit === 'DEG') return radValue * (180 / Math.PI);
    if (unit === 'GRAD') return radValue * (200 / Math.PI);
    return radValue;
  }

  private static variableNamesIn(formula: string, variables: VariableMap): string[] {
    return Object.keys(variables).filter((name) => {
      const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      return new RegExp(
        `(?<![가-힣a-zA-Z0-9_])${escapedName}(?![가-힣a-zA-Z0-9_])`,
      ).test(formula);
    }).sort((a, b) => b.length - a.length);
  }

  public static detectCircularReference(
    targetVariable: string,
    formula: string,
    variables: VariableMap,
    path: string[] = [targetVariable],
  ): void {
    for (const dependency of CalculatorEngine.variableNamesIn(formula, variables)) {
      if (path.includes(dependency)) {
        const cycle = [...path, dependency].join(' -> ');
        throw new Error(`순환 참조 오류 감지: ${cycle}`);
      }

      const rawDependency = variables[dependency].rawString;
      if (rawDependency) {
        CalculatorEngine.detectCircularReference(
          dependency,
          rawDependency,
          variables,
          [...path, dependency],
        );
      }
    }
  }

  public static evaluate(
    formula: string,
    variables: VariableMap,
    angleUnit: AngleUnit,
  ): Decimal {
    const trimmedFormula = formula.trim();
    if (!trimmedFormula) return new Decimal(0);
    if (trimmedFormula.length > 200) {
      throw new Error('수식은 200자 이하로 입력해 주세요.');
    }
    if ((trimmedFormula.match(/\^/g)?.length ?? 0) > 12) {
      throw new Error('지수 연산이 너무 많습니다. 수식을 나눠서 계산해 주세요.');
    }

    try {
      const sortedVariableNames = Object.keys(variables).sort((a, b) => b.length - a.length);

      for (const name of sortedVariableNames) {
        const rawFormula = variables[name].rawString;
        if (rawFormula) {
          CalculatorEngine.detectCircularReference(name, rawFormula, variables);
        }
      }

      let processedFormula = formula;

      for (const name of sortedVariableNames) {
        const value = variables[name].value.toString();
        const escapedName = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
        const variablePattern = new RegExp(
          `(?<![가-힣a-zA-Z0-9_])${escapedName}(?![가-힣a-zA-Z0-9_])`,
          'g',
        );
        processedFormula = processedFormula.replace(variablePattern, `(${value})`);
      }
      processedFormula = convertDmsLiterals(processedFormula);

      const scope = {
        sin: (value: number) => Math.sin(CalculatorEngine.convertAngle(value, angleUnit)),
        cos: (value: number) => Math.cos(CalculatorEngine.convertAngle(value, angleUnit)),
        tan: (value: number) => Math.tan(CalculatorEngine.convertAngle(value, angleUnit)),
        asin: (value: number) => CalculatorEngine.convertRadToUnit(Math.asin(value), angleUnit),
        acos: (value: number) => CalculatorEngine.convertRadToUnit(Math.acos(value), angleUnit),
        atan: (value: number) => CalculatorEngine.convertRadToUnit(Math.atan(value), angleUnit),
        PI: Math.PI,
        e: Math.E,
      };

      const result = math.compile(processedFormula).evaluate(scope);

      let decimalResult: Decimal;
      if (typeof result === 'number') {
        if (!Number.isFinite(result)) throw new Error('계산 결과가 유한한 숫자가 아닙니다.');
        decimalResult = new Decimal(result.toPrecision(15));
      } else if (result && typeof result.toString === 'function') {
        decimalResult = new Decimal(result.toString());
      } else {
        throw new Error('유효하지 않은 연산 결과입니다.');
      }

      if (!decimalResult.isFinite()) {
        throw new Error('계산 결과가 유한한 숫자가 아닙니다.');
      }
      if (Math.abs(decimalResult.e) > 1000) {
        throw new Error('연산 결과 자릿수가 너무 큽니다. 결과 범위를 줄여 다시 시도해 주세요.');
      }
      return decimalResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      if (message.includes('순환 참조 오류')) throw new Error(message);
      if (message.includes('유한한 숫자가 아닙니다')
        || message.includes('도분초 입력')
        || message.includes('연산 결과 자릿수가 너무 큽니다')
        || message.includes('지수 연산이 너무 많습니다')
        || message.includes('수식은 200자')) throw new Error(message);
      throw new Error('수식을 계산할 수 없습니다. 연산자와 괄호를 확인해 주세요.');
    }
  }
}
