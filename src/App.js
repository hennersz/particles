import React, { Component } from 'react';
import Particle from './Particle';
import ForceLine from './ForceLine';
import './App.css';

class App extends Component {
  constructor() {
    super();
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

  componentDidMount() {
    window.addEventListener('resize', ()=>this.windowUpdate());
    const p = new Particle();
    const l = new ForceLine(this.mouseX, p.x, this.mouseY, p.y);
    this.particles.push({p, l});
    requestAnimationFrame(() => this.update());
  }
  update() {
    const {width, height, ratio} = this.state;
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(0, 0, width*ratio, height*ratio);
    this.particles = this.particles.map((item)=>{
      const {p, l} = item;
      p.update(this.mouseX, this.mouseY);
      if(p.x > width*ratio || p.x < 0 || p.y > height* ratio || p.y < 0){
        const np = new Particle();
        const nl = new ForceLine(this.mouseX, p.x, this.mouseY, p.y);
        return {
          p: np,
          l: nl
        }
      }
      l.update({x1:this.mouseX,x2:p.x, y1: this.mouseY, y2: p.y});
      return item;
    })
    this.particles.forEach(item=>{
      const {p, l} = item;
      p.render(ctx)
      l.render(ctx);
    });
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
