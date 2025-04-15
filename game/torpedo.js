import { Enemy } from "./enemy.js";
const TORPEDO_SPRITE =
  "game/assets/Enemy/Weapons/PNGs/Nairan - Torpedo Ship - Weapons.png";
  const ALIEN_SHIP_SPRITE =
  "game/assets/Enemy/chips/Frigate.png";

export class Torpedo extends Enemy {
  constructor(x,y,moveArea) {
    const frames = {
      
      totalFrames: 12,
      frameSize: 64,
      // onLastFrame: () => {
      //   this.hide();
      //   this.freeze();
      // },
    };
    const size = { width: 58.5, height: 47 };
    super(TORPEDO_SPRITE, frames, size, moveArea);
    this.x = x;
    this.y = y;  
    this.element.style.top = `${y}px`
    this.element.style.left = `${x}px`
  }
}

export class AlienShip extends Enemy {
  constructor(row,col,moveArea) {
    const frames = {
      totalFrames: 1,
      frameSize: 64,
      // onLastFrame: () => {
      //   this.hide();
      //   this.freeze();
      // },
    };
    const size = { width: 42, height: 42 };
    super(ALIEN_SHIP_SPRITE, frames, size, moveArea);
    this.x = (size.width) * col
    this.y = (size.height) * row
    // this.element.style.top = `${this.y}px`
    // this.element.style.left = `${this.x}px`
    this.element.style.transform = `translate(${this.x},${-100}px)`
    this.element.style.border = "solid 2px yellow"
    this.speed = 0.5

  }
  onEdge(step) {
    this.direction *= -1;
    this.x -= step;
    if (this.x != 0) {
      this.y += this.size.width /2
      // this.speed = 0
    }
  }
}
