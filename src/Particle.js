import { pointDistance, calculateForce } from './helpers';


const mouseWeight = 40;
const terminalVelocity = 50;

export default class Particle {
  constructor(){
    this.x = 500;
    this.y = 500;
    this.velX = 0;
    this.velY = 0;
    this.weight = 10;
  }

  render(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.weight, 0, Math.PI * 2, true);
    ctx.fill();
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

  updateVelocity(mouseX, mouseY) {
    const angle = Math.atan2(mouseY - this.y, mouseX - this.x);
    const distance = pointDistance(this.x, this.y, mouseX, mouseY);
    const force = calculateForce(this.weight, mouseWeight, distance);

    this.velX = this.velX + force * Math.cos(angle);
    this.velY = this.velY + force * Math.sin(angle);
    this.limit();
  }

  updatePosition(){
    this.x = this.x + this.velX;
    this.y = this.y + this.velY;
  }

  update(mouseX, mouseY){
    this.updateVelocity(mouseX, mouseY);
    this.updatePosition();
  }
}