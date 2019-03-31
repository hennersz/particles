const G = 8;

const pointDistance = (x1, y1, x2, y2) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

const calculateForce = (w1, w2, dist) => {
  return G*((w1 * w2)/Math.pow(dist,2));
}

export { pointDistance, calculateForce };