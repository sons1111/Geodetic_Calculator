import Decimal from 'decimal.js';

export const formatFixedResult = (value: string, decimalPlaces: number): string => {
  const result = new Decimal(value);
  if (!result.isFinite()) return value;
  return result.toDecimalPlaces(decimalPlaces).toFixed(decimalPlaces);
};
