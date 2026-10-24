import Decimal from 'decimal.js';

export interface DMS {
  degrees: number;
  minutes: number;
  seconds: number;
}

export const ddToDms = (decimalDegrees: number): DMS => {
  const value = new Decimal(decimalDegrees);
  const degrees = value.trunc().toNumber();
  const remainingMinutes = value.abs().minus(Math.abs(degrees)).times(60);
  const minutes = remainingMinutes.trunc().toNumber();
  const seconds = remainingMinutes.minus(minutes).times(60).toDecimalPlaces(4).toNumber();

  return { degrees, minutes, seconds };
};

export const dmsToDd = (
  degrees: number,
  minutes: number,
  seconds: number,
): number => {
  const degreeValue = new Decimal(degrees);
  const minuteValue = new Decimal(minutes).div(60);
  const secondValue = new Decimal(seconds).div(3600);

  if (degreeValue.isNegative()) {
    return degreeValue.minus(minuteValue).minus(secondValue).toNumber();
  }
  return degreeValue.plus(minuteValue).plus(secondValue).toNumber();
};

export const formatDms = (
  degrees: number,
  minutes: number,
  seconds: number,
): string => {
  return `${degrees}° ${minutes}' ${seconds}"`;
};
