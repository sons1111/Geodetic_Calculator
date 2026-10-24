import Decimal from 'decimal.js';

export interface Point2D {
  x: number;
  y: number;
}

export interface InverseResult {
  distance: number;
  azimuthDegrees: number;
}

export interface ForwardResult {
  x: number;
  y: number;
}

export const calculateInverse = (
  p1: Point2D,
  p2: Point2D,
): InverseResult => {
  const dx = new Decimal(p2.x).minus(p1.x);
  const dy = new Decimal(p2.y).minus(p1.y);
  const distance = dx.pow(2).plus(dy.pow(2)).sqrt().toDecimalPlaces(4).toNumber();

  let azimuthDegrees = new Decimal(Math.atan2(dy.toNumber(), dx.toNumber()))
    .times(180)
    .div(Math.PI);

  if (azimuthDegrees.isNegative()) {
    azimuthDegrees = azimuthDegrees.plus(360);
  }

  return {
    distance,
    azimuthDegrees: azimuthDegrees.toDecimalPlaces(4).toNumber(),
  };
};

export const calculateForward = (
  p1: Point2D,
  distance: number,
  azimuthDegrees: number,
): ForwardResult => {
  const radians = new Decimal(azimuthDegrees).times(Math.PI).div(180).toNumber();
  const distanceValue = new Decimal(distance);
  const dx = distanceValue.times(Math.cos(radians));
  const dy = distanceValue.times(Math.sin(radians));

  return {
    x: new Decimal(p1.x).plus(dx).toDecimalPlaces(4).toNumber(),
    y: new Decimal(p1.y).plus(dy).toDecimalPlaces(4).toNumber(),
  };
};
