// imports 

import { Enemy } from "./enemy.js";
import { canvas } from "./index.js";
import { Projectile } from "./alien.js";


// setting the state of the torpedo

const TORPEDO_SPRITE = "game/assets/Enemy/Weapons/Nairan - Torpedo Ship - Weapons.png";
const TORPEDO_PROJECTILE = "game/assets/bullets/NairanTorpedo1.png";



export class Torpedo extends Enemy {
  constructor(game, x, y) {
    const frames = {
      totalFrames: 12,
      frameSize: 64,
      onLastFrame: () => {
        this.hide();
        this.freeze();
      },
    };

    const size = { width: 58.5, height: 47 };
    super(TORPEDO_SPRITE, frames, size);
    this.x = x;
    this.y = y + 50;
    this.game = game;
    this.offsetShoot = 1;
    this.frameWidth = size.width * this.game.scaleFactor;
    this.frameHeight = size.height * this.game.scaleFactor;
    this.score = 500;
    this.speed = 8 * this.game.scaleFactor
    this.element.style.width = `${this.frameWidth}px` 
    this.element.style.height = `${this.frameHeight}px` 
    this.element.style.border = 'solid 1px red '
    this.element.style.position = 'absolute'
  }


  onEdge(step) {
    this.direction *= -1
    this.x -= step
  }

  slide(deltaTime) {
    const style = this.element.style;
    const step = this.speed * this.direction;
    this.x += step;
    if (this.currentFrame === this.frames.totalFrames - 1) {
      this.destroy();
    }
    if (this.x < 0 || this.x + this.frameWidth > this.game.width) {
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
    this.slide = () => { };
    this.animate = () => { };
    this.element = null;
  }

  shoot() {
    let shoot1 = new TorpedoProjectile(
      TORPEDO_PROJECTILE,
      this.game,
      this.x + this.frameWidth / 2 - this.offsetShoot * 9,
      this.y,
      1,
      4
    );
    let shoot2 = new TorpedoProjectile(
      TORPEDO_PROJECTILE,
      this.game,
      this.x + this.frameWidth / 2 + this.offsetShoot * 9,
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
    this.spriteWidth = 27 
    this.spriteHeight = 18
    this.frameWidth = 9 * this.game.scaleFactor;
    this.frameHeight = 18 * this.game.scaleFactor;
    this.totalFrames = 4;
    this.animationDelay = 50;
    this.imgHolder.style.backgroundPositionX = `calc(${this.frameWidth} * ${this.currentFrame})`;
    this.imgHolder.style.width = `${this.frameWidth}px`;
    this.imgHolder.style.height = `${this.frameHeight}px`;
    this.img = document.createElement('img')
    this.img.src = TORPEDO_PROJECTILE
    this.img.style.width = this.spriteWidth * this.game.scaleFactor + 'px'
    this.img.style.height = this.spriteHeight * this.game.scaleFactor + 'px'
    this.imgHolder.innerHTML = ''
    this.imgHolder.append(this.img)
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




