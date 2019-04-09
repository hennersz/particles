import { pointDistance, calculateForce, getRandomInt } from './helpers';


const mouseWeight = 0;
const terminalVelocity = 5;

export default class Particle {
  constructor(x, y, velx, vely, weight, id){
    this.x = x;
    this.y = y;
    this.velX = velx;
    this.velY = vely;
    this.weight = weight;
    this.num = 1;
    this.id = id;
    this.radius = Math.ceil(Math.sqrt(this.weight/Math.PI))*2;
  }

  render(ctx){
    ctx.save()
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }

  limit(){
    if(this.velX > terminalVelocity){
      this.velX = terminalVelocity;
    }
    if(this.velX < -terminalVelocity){
      this.velX = -terminalVelocity;
    }
    if(this.velY > terminalVelocity){
      this.velY = terminalVelocity;
    }
    if(this.velY < -terminalVelocity){
      this.velY = -terminalVelocity;
    }
  }

  eat(particle) {
    console.log(`Eating: ${particle.id}`);
    this.weight += particle.weight;
    this.radius = Math.ceil(Math.sqrt(this.weight/Math.PI))*2;
    this.num += particle.num;
    particle.weight = 0;
    particle.num = 0;
    particle.radius = 0;
  }

  explode(){
    const ret = [];
    let angle = 0;
    const ad = Math.PI*2/this.num;
    const radius = this.radius;
    for(let i = this.num; i > 1; i--){
      const val = getRandomInt((this.weight/i)-2) + 2;
      this.weight -= val;
      const x = this.x + radius * Math.cos(angle);
      const velx = terminalVelocity * Math.cos(angle);
      const y = this.y + radius * Math.sin(angle);
      const velY = terminalVelocity * Math.sin(angle);
      angle += ad;
      const p = new Particle(x, y, velx, velY, val);
      ret.push(p);
    }
    this.num = 1;
    this.x = this.x + radius * Math.cos(angle);
    this.velX = terminalVelocity * Math.cos(angle);
    this.y = this.y + radius * Math.sin(angle);
    this.velY = terminalVelocity * Math.sin(angle);
    this.radius = Math.ceil(Math.sqrt(this.weight/Math.PI))*2;
    return ret;
  }

  updateVelocity(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    const distance = pointDistance(this.x, this.y, mouseX, mouseY);
    const force = calculateForce(this.weight, mouseWeight, distance);

    this.velX = this.velX + force * Math.cos(angle);
    this.velY = this.velY + force * Math.sin(angle);
    this.limit();
  }

  updateVelocityPoint(point){
    const angle = Math.atan2(point.y - this.y, point.x - this.x);
    const distance = pointDistance(this.x, this.y, point.x, point.y);
    const force = calculateForce(this.weight, point.weight, distance);

    this.velX = this.velX + force * Math.cos(angle)/this.weight;
    this.velY = this.velY + force * Math.sin(angle)/this.weight;
    this.limit();
  }

  updatePosition(){
    const slowdown = 0.5
    this.x = this.x + this.velX * slowdown;
    this.y = this.y + this.velY * slowdown;
  }

  update(mouseX, mouseY){
    this.updateVelocity(mouseX, mouseY);
    this.updatePosition();
  }
}