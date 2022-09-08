export const distanceFormula = (point1, point2) => {
  let [x1, x2] = point1;
  let [y1, y2] = point2;
  return Math.sqrt(Math.pow(x2 - y2, 2) + Math.pow(x1 - y1, 2));
};
