import { pointDistance } from './helpers';

const maxDist = 500;

const calculateAlpha = (dist) => {
  if (dist > maxDist){
    return 0;
  }
  return 1 - (dist/maxDist);
}
export default class ForceLine{
  constructor(x1, x2, y1, y2){
    this.points = {
      x1,x2,y1,y2
    };
    this.dist = pointDistance(x1, y1, x2, y2);
    this.alpha = calculateAlpha(this.dist)
  }

  update(points){
    this.points = {
      ...this.points,
      ...points
    };
    const {x1, x2, y1, y2} = this.points;
    this.dist = pointDistance(x1, y1, x2, y2);
    this.alpha = calculateAlpha(this.dist);
  }

  render(ctx){
    const {x1, x2, y1, y2} = this.points;
    ctx.moveTo(x1, y1);
    ctx.strokeStyle=`rgba(0,0,0,${this.alpha})`
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}