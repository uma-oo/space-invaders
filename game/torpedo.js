// imports 

import { Enemy } from "./enemy.js";
import { canvas } from "./index.js";
import { Projectile } from "./alien.js";


// setting the state of the torpedo

const TORPEDO_SPRITE = "game/assets/Enemy/chips/newTorpedo.png";
const TORPEDO_PROJECTILE = "game/assets/bullets/Torpedo.png";



export class Torpedo extends Enemy {
  constructor(game, x, y) {
    const size = { width: 64, height: 52 };
    super(TORPEDO_SPRITE,size);
    this.game = game;
    this.x = x;
    this.y = y + 50*this.game.scaleFactor;
    this.frameWidth = size.width * this.game.scaleFactor;
    this.frameHeight = size.height * this.game.scaleFactor;
    this.score = 500;
    this.speed = 4 * this.game.scaleFactor
    this.element.style.width = `${this.frameWidth}px` 
    this.element.style.height = `${this.frameHeight}px` 
    this.element.style.position = 'absolute'
  }

  slide() {
    const style = this.element.style;
    const step = this.speed * this.direction;
    this.x += step;

    if (this.x < 0 || this.x + this.frameWidth > this.game.width) {
      this.direction *= -1
      this.x -= step
    }
    style.transform = `translate(${this.x}px,${this.y}px`;
  }

  destroy() {
    if (this.game.enemies.indexOf(this) !== -1) {
      this.game.enemies.splice(this.game.enemies.indexOf(this), 1);
    }
    this.element.remove();
    this.slide = () => { };
    this.element = null;
  }

  shoot() {
    let shoot1 = new TorpedoProjectile(
      TORPEDO_PROJECTILE,
      this.game,
      this.x + (this.frameWidth / 2 - 23*this.game.scaleFactor),
      this.y+10,
      1,
      3
    );
    let shoot2 = new TorpedoProjectile(
      TORPEDO_PROJECTILE,
      this.game,
      this.x + (this.frameWidth / 2 + 17*this.game.scaleFactor),
      this.y+10*this.game.scaleFactor,
      1,
      3
    );
    return [shoot1, shoot2];
  }

}


export class TorpedoProjectile extends Projectile {
  constructor(image, game, x, y, direction, speed) {
    super(image, game, x, y, direction, speed);
    this.spriteWidth = 33
    this.spriteHeight = 32
    this.frameWidth = 11 * this.game.scaleFactor;
    this.frameHeight = 32 * this.game.scaleFactor;
    this.totalFrames = 3;
    this.animationDelay = 100;
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
    super.update(deltaTime);
    this.imgHolder.style.transform = `rotate(180deg) translate(${-this
      .x}px,${-this.y}px`;
  }
}




