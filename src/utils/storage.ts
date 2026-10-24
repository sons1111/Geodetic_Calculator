import Decimal from 'decimal.js';
import type {
  AngleUnit,
  CalculationHistory,
  DisplayMode,
  VariableMap,
} from '../types/calculator';

const STORAGE_KEYS = {
  VARIABLES: 'geodetic_calc_variables',
  HISTORY: 'geodetic_calc_history',
  SETTINGS: 'geodetic_calc_settings',
} as const;

const VARIABLE_NAME_PATTERN = /^[가-힣a-zA-Z_][가-힣a-zA-Z0-9_]*$/;
const RESERVED_VARIABLE_NAMES = new Set(['__proto__', 'prototype', 'constructor', 'sin', 'cos', 'tan', 'log', 'ln', 'sqrt', 'PI', 'e']);

const isVariableName = (name: string): boolean =>
  name.length <= 50 && VARIABLE_NAME_PATTERN.test(name) && !RESERVED_VARIABLE_NAMES.has(name);

const isAngleUnit = (value: unknown): value is AngleUnit =>
  value === 'DEG' || value === 'RAD' || value === 'GRAD';

const isDecimalPlaces = (value: unknown): value is number =>
  typeof value === 'number' && Number.isInteger(value) && value >= 0 && value <= 8;

const loadStorageData = <T>(key: string, fallbackValue: T): T => {
  let rawValue: string | null;
  try {
    rawValue = localStorage.getItem(key);
  } catch (error) {
    console.warn(`[Storage Warning] '${key}' 읽기 실패로 기본값을 사용합니다.`, error);
    return fallbackValue;
  }

  if (rawValue === null) return fallbackValue;
  try {
    return JSON.parse(rawValue) as T;
  } catch (error) {
    console.warn(`[Storage Warning] '${key}' 데이터가 손상되어 초기값으로 복구합니다.`, error);
    try {
      localStorage.removeItem(key);
    } catch (removeError) {
      console.warn(`[Storage Warning] '${key}' 손상 데이터를 정리하지 못했습니다.`, removeError);
    }
    return fallbackValue;
  }
};

const isHistoryItem = (value: unknown): value is CalculationHistory => {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.formula === 'string'
    && typeof item.result === 'string'
    && typeof item.timestamp === 'number'
    && Number.isFinite(item.timestamp);
};

export const saveVariables = (variables: VariableMap): boolean => {
  try {
    const serialized: Record<string, string> = {};
    for (const [key, item] of Object.entries(variables)) {
      serialized[key] = item.value.toString();
    }
    localStorage.setItem(STORAGE_KEYS.VARIABLES, JSON.stringify(serialized));
    return true;
  } catch (error) {
    console.error('Failed to save variables to localStorage:', error);
    return false;
  }
};

export const loadVariables = (): VariableMap => {
  try {
    const data = loadStorageData<string | null>(STORAGE_KEYS.VARIABLES, null);
    if (data === null) return {};

    const parsed: unknown = JSON.parse(data);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};
    const variables = Object.create(null) as VariableMap;

    for (const [key, value] of Object.entries(parsed)) {
      if (!isVariableName(key) || typeof value !== 'string') continue;
      const decimalValue = new Decimal(value);
      if (!decimalValue.isFinite()) continue;
      Object.defineProperty(variables, key, {
        configurable: true,
        enumerable: true,
        writable: true,
        value: { value: decimalValue, rawString: value },
      });
    }
    return variables;
  } catch (error) {
    console.error('Failed to load variables from localStorage:', error);
    return {};
  }
};

export const saveHistory = (history: CalculationHistory[]): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Failed to save history to localStorage:', error);
    return false;
  }
};

export const loadHistory = (): CalculationHistory[] => {
  try {
    const data = loadStorageData<string | null>(STORAGE_KEYS.HISTORY, null);
    if (data === null) return [];
    const parsed: unknown = JSON.parse(data);
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem).slice(-100) : [];
  } catch (error) {
    console.error('Failed to load history from localStorage:', error);
    return [];
  }
};

export interface CalculatorSettings {
  angleUnit: AngleUnit;
  displayMode: DisplayMode;
  decimalPlaces: number;
}

const DEFAULT_SETTINGS: CalculatorSettings = {
  angleUnit: 'DEG',
  displayMode: 'NORM',
  decimalPlaces: 4,
};

export const saveSettings = (settings: CalculatorSettings): boolean => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error('Failed to save settings:', error);
    return false;
  }
};

export const loadSettings = (): CalculatorSettings => {
  try {
    const data = loadStorageData<string | null>(STORAGE_KEYS.SETTINGS, null);
    if (data !== null) {
      const parsed: unknown = JSON.parse(data);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return DEFAULT_SETTINGS;
      const settings = parsed as Record<string, unknown>;
      return {
        angleUnit: isAngleUnit(settings.angleUnit) ? settings.angleUnit : DEFAULT_SETTINGS.angleUnit,
        displayMode: settings.displayMode === 'FIX' || settings.displayMode === 'NORM' || settings.displayMode === 'SCI'
          ? settings.displayMode
          : DEFAULT_SETTINGS.displayMode,
        decimalPlaces: isDecimalPlaces(settings.decimalPlaces)
          ? settings.decimalPlaces
          : DEFAULT_SETTINGS.decimalPlaces,
      };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return DEFAULT_SETTINGS;
};
