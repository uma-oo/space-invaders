import { Enemy } from "./enemy.js";
import {Projectile} from './index.js'
const TORPEDO_SPRITE =
  "game/assets/Enemy/Weapons/PNGs/Nairan - Torpedo Ship - Weapons.png";
const ALIEN_SHIP_SPRITE =
  "game/assets/Enemy/chips/Frigate.png";

export class Torpedo extends Enemy {
  constructor(x, y, moveArea, game) {
    const frames = {

      totalFrames: 12,
      frameSize: 64,
      onLastFrame: () => {
        this.hide();
        this.freeze();
      },
    };
    const size = { width: 58.5, height: 47 };
    super(TORPEDO_SPRITE, frames, size, moveArea);
    this.x = x;
    this.y = y;
    this.element.style.top = `${y}px`
    this.element.style.left = `${x}px`
  }

  shoot(){
    return new Projectile(this.game, this.x + this.width / 2, this.y , 1)
  }


}

export class AlienShip extends Enemy {
  constructor(row, col, moveArea , game ) {
    const frames = {
      totalFrames: 1,
      frameSize: 42,
      // onLastFrame: () => {
      //   this.hide();
      //   this.freeze();
      // },
    };
    const size = { width: 42, height: 42 };
   
    super(ALIEN_SHIP_SPRITE, frames, size, moveArea);
    this.game = game
    this.x = (size.width + 20) * col
    this.y = (size.height + 10) * row
    this.speed = 0.5,
    this.element.style.zIndex = '2'
    this.element.style.transform = `tramslate(${this.x}, ${this.y})`
    // this.element.style.border = `solid red 1px`
    this.width = size.width,
    this.height = size.height
  }



  slide(time) {
    const { start, end } = this.moveArea;
    const style = this.element.style;
    const step =this.speed * this.direction

    if (this.x < start || this.x + parseInt(style.width) > end) {
      this.onEdge(step);
    }
    this.x += step;
    style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px`;
  }

  shoot(){
    return new Projectile(this.game, this.x, this.y , 1)
  }
}