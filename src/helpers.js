const G = 1.5;

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
}

const getRandomFloat = (max) => {
  return Math.random() * max;
}

const pointDistance = (x1, y1, x2, y2) => {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
}

const calculateForce = (w1, w2, dist) => {
  return G*((w1 * w2)/Math.pow(dist,2));
}

const leftPad = (num, digits) => {
  const numStr = String(num);
  const zereosRequired = digits - numStr.length;
  return '0'.repeat(zereosRequired) + numStr;
}

const lineId = (id1, id2) => {
  return [id1, id2].sort((a,b)=>a-b).map(v=>leftPad(v, 5)).join('');
}

export { pointDistance, calculateForce, getRandomFloat, getRandomInt, lineId };