import React, { Component } from 'react';
import Particle from './Particle';
import ForceLine from './ForceLine';
import { pointDistance, getRandomFloat,getRandomInt, lineId } from './helpers';
import './App.css';


class App extends Component {
  constructor() {
    super();
    this.currentId = 0;
    this.particles = [];
    this.lines = {};
    this.mouseX = 100;
    this.mouseY = 100;
    this.state = {
      width: window.innerWidth,
      height: window.innerHeight,
      ratio: window.devicePixelRatio || 1,
    }
  }

  windowUpdate(){
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  mouseMove(e){
    const {ratio} = this.state;
    this.mouseX = e.clientX * ratio;
    this.mouseY = e.clientY * ratio;
  }

  createRandomParticle(id){
    const { width, height, ratio } = this.state;
    const x = getRandomInt(width * ratio);
    const y = getRandomInt(height * ratio);
    const velX = getRandomFloat(1) - 0.5;
    const velY = getRandomFloat(1) - 0.5;
    const weight = getRandomInt(9) + 2;

    return new Particle(x, y, velX, velY, weight, id!==undefined?id:this.currentId++);
  }

  componentDidMount() {
    window.addEventListener('resize', ()=>this.windowUpdate());
    for(let i = 0; i < 50; i++){
      const p = this.createRandomParticle();
      const l = new ForceLine(this.mouseX, p.x, this.mouseY, p.y);
      this.particles.push(p);
      this.lines[`${p.id}m`] = l;
    }
    for(let i = 0; i < this.particles.length; i++){
      const p1 = this.particles[i];
      for(let j = i; j < this.particles.length; j++){
        if(i === j) continue;
        const p2 = this.particles[j];
        const l = new ForceLine(p1.x, p2.x, p1.y, p2.y);
        const lid = lineId(p1.id, p2.id);
        this.lines[lid] = l;
      }
    }
    requestAnimationFrame(() => this.update());
  }

  update() {
    const {width, height, ratio} = this.state;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, width*ratio, height*ratio);

    for(let i = 0; i < this.particles.length; i++){
      let p1 = this.particles[i];
      p1.updateVelocity(this.mouseX, this.mouseY);
      for(let j = 0; j < this.particles.length; j++){
        if(i === j) continue;
        let p2 = this.particles[j];
        p1.updateVelocityPoint(p2);
        if(pointDistance(p1.x, p1.y, p2.x, p2.y)<p1.radius + p2.radius){
          if(p1.weight > p2.weight){
            p1.eat(p2);
          } else {
            p2.eat(p1);
          }
        }
      }
    }

    for(let i = 0; i < this.particles.length; i++){
      const p1 = this.particles[i];
      if(p1.weight === 0){
        delete this.lines[`${p1.id}m`];
        for(let j = 0; j < this.particles.length; j++){
          if(i === j) continue;
          const p2 = this.particles[j];
          delete this.lines[lineId(p1.id, p2.id)]
        }
      }
    }

    this.particles = this.particles.filter(p=>p.weight>0);

    this.particles = this.particles.map((p)=>{
      p.updatePosition();
      if(p.x > width*ratio || p.x < 0 || p.y > height* ratio || p.y < 0){
        return this.createRandomParticle(p.id);
      }
      return p;
    })

    const newParticles = [];
    this.particles.forEach((p)=>{
      if(p.weight > 50){
        const fragments = p.explode();
        newParticles.push(...fragments);
      }
    });

    for(let newParticle of newParticles){
      newParticle.id = this.currentId++;
      const l = new ForceLine(this.mouseX, newParticle.x, this.mouseY, newParticle.y);
      this.lines[`${newParticle.id}m`] = l;
      for(let particle of this.particles){
        const l = new ForceLine(newParticle.x, particle.x, newParticle.y, particle.y);
        const lid = lineId(newParticle.id, particle.id);
        this.lines[lid] = l;
      }
      this.particles.push(newParticle);
    }

    for(let i = 0; i < this.particles.length; i++){
      let p1 = this.particles[i];
      this.lines[`${p1.id}m`].update({x1: this.mouseX, x2: p1.x, y1: this.mouseY, y2: p1.y});
      for(let j = i; j < this.particles.length; j++){
        if(i === j) continue;
        let p2 = this.particles[j];
        const lid = lineId(p1.id, p2.id);
        try{
          this.lines[lid].update({x1: p1.x, x2: p2.x, y1: p1.y, y2: p2.y});
        } catch (err) {
          console.log(lid);
          console.log(p1);
          console.log(p2);
          console.log(this.lines);
          throw err;
        }
      }
    }

    this.particles.forEach(p=>p.render(ctx));
    for(const key in this.lines){
      this.lines[key].render(ctx, key);
    }
    requestAnimationFrame(() => this.update());
  }

  render() {
    const {
      width,
      height,
      ratio
    } = this.state;
    return (
      <div  className="App">
        <canvas
          onMouseMove={(e) => this.mouseMove(e)}
          ref="canvas"
          style={{height: `${height}px`, width: `${width}px`}}
          width={width*ratio}
          height={height*ratio}
          />
      </div>
    );
  }
}

export default App;
