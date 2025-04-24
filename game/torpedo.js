// imports 

import { Enemy } from "./enemy.js";
import { canvas } from "./index.js";
import { Projectile } from "./alien.js";


// setting the state of the torpedo

const TORPEDO_SPRITE ="game/assets/Enemy/Weapons/PNGs/Nairan - Torpedo Ship - Weapons.png";
const TORPEDO_PROJECTILE = "game/assets/Enemy/WeaponEffectsProjectiles/NairanTorpedo.png";



export class Torpedo extends Enemy {
  constructor(game, x, y, moveArea) {
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
    this.y = y + 50;
    this.game = game;
    this.offsetShoot = 1;
    this.width = size.width * this.game.scaleFactor;
    this.height = size.height * this.game.scaleFactor;
    this.score = 500;
    // this.element.style.border = 'solid 1px red'
    this.element.style.width = `${this.width}px` 
    this.element.style.height = `${this.height}px` 
    // this.ele
  }



  slide(deltaTime) {
    const { start, end } = this.moveArea;
    const style = this.element.style;

    const step = this.currentFrame * this.direction;
    this.x += step;
    if (this.currentFrame === this.frames.totalFrames - 1) {
      this.destroy();
    }
    if (this.x < start || this.x + parseInt(style.width) > end) {
      this.onEdge(step);
    }

    style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px`;
    this.animate(deltaTime);
  }

  destroy() {
    if (this.game.enemies.indexOf(this) !== -1) {
      this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
    }
    this.element.remove();
    this.freeze();
    this.slide = () => {};
    this.animate = () => {};
    this.element = null;
  }


  shoot() {
      let shoot1 = new TorpedoProjectile(
        TORPEDO_PROJECTILE,
        this.game,
        this.x + this.width / 2 - this.offsetShoot * 9,
        this.y,
        1,
        4
      );
      let shoot2 = new TorpedoProjectile(
        TORPEDO_PROJECTILE,
        this.game,
        this.x + this.width / 2 + this.offsetShoot * 9,
        this.y,
        1,
        4
      );
      this.offsetShoot += 1;
      return [shoot1, shoot2];
  }

}




export class TorpedoProjectile extends Projectile {
  constructor(image, game, x, y, direction, speed) {
    super(image, game, x, y, direction, speed);
    this.height = 24*this.game.scaleFactor; 
    this.width = 9*this.game.scaleFactor;
    this.animationDelay = 100;
    this.imgHolder.style.backgroundPositionX = `calc(${this.width} * ${this.currentFrame})`;
    this.img = document.createElement('img');
    this.imgHolder.style.width = `${this.width}px`;
    this.imgHolder.style.height = `${this.height}px`;
    this.totalFrames = 4;
    canvas.append(this.imgHolder);
  }

  update(deltaTime) {
    // wow js zwiiin
    super.update(deltaTime);
    this.imgHolder.style.transform = `rotate(180deg) translate(${-this
      .x}px,${-this.y}px`;
    super.animate(deltaTime);
  }
}




