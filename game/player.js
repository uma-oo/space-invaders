
import { canvas } from "./index.js";
import { Projectile } from "./alien.js";

const PLAYER_SHIP_IMAGE = "game/assets/ShipsPNG/ship6.png";
const layzerBulletSound = document.getElementById("lazerBullet");
const BULLET ="game/assets/bullets/Wave_1.png"

export class Player {
  constructor(game) {
    this.game = game
    this.canShoot = true
    this.defaultWidth = 64
    this.defaultheight = 52
    this.width = this.defaultWidth  * this.game.scaleFactor
    this.height = this.defaultheight * this.game.scaleFactor
    this.x = this.game.width / 2 - this.width / 2
    this.y = this.game.height - this.height - 10
    this.speed = 7 * this.game.scaleFactor
    this.projectiles = []
    this.element = document.createElement("div")
    this.element.style.position = "absolute"
    this.element.style.zIndex = "1"
    this.element.style.background = `url(${PLAYER_SHIP_IMAGE}) center no-repeat`
    this.element.style.backgroundSize = "contain"
    this.element.style.backgroundPosition = "center"
    this.element.style.width = `${this.width}px`
    this.element.style.height = `${this.height}px`
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
    // this.element.style.border = "solid 2px red"
    canvas.append(this.element);
  }
  
  
  update(deltaTime) {
    //  this.y -= 5
    if (this.game.keys.includes("ArrowRight")) this.x += this.speed;
    if (this.game.keys.includes("ArrowLeft") && this.x > 0)
      this.x -= this.speed;
    if (this.game.keys.includes(" ")) this.shoot();
    if (this.x + this.width >= this.game.width)
      this.x = this.game.width - this.width;
    this.projectiles.forEach((projectile) => {
      projectile.update(deltaTime);
    });
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  shoot() {
    if (this.canShoot) {
      this.canShoot = false;
      setTimeout(() => (this.canShoot = true), 600);
      layzerBulletSound.play();
      this.projectiles.push(
        new Bullet(BULLET,this.game, this.x + this.width/2  , this.y, -1,12 )
      );
    }
  }

  reset() {
    this.element.remove();
    this.projectiles.forEach((projectile) => projectile.imgHolder.remove());
    this.projectiles = [];
  }
}

class Bullet extends Projectile {
  constructor(image, game, x, y, direction, speed) {
    super(image, game, x, y, direction, speed);
    this.spriteWidth = 384
    this.spriteHeight = 17
    this.frameWidth = 64*this.game.scaleFactor;
    this.frameHeight = 17*this.game.scaleFactor;
    this.animationDelay = 200;
    this.x -= this.frameWidth /2
    this.img = document.createElement("img")
    this.img.src = image
    this.img.style.width = this.spriteWidth * this.game.scaleFactor + 'px'
    this.img.style.height = this.spriteHeight * this.game.scaleFactor + 'px'
    this.imgHolder.style.width = `${this.frameWidth}px`;
    this.imgHolder.style.height = `${this.frameHeight}px`;
    this.totalFrames = 6;
    this.imgHolder.innerHTML = ''
    console.log(this.img)
    this.imgHolder.append(this.img)
    console.log(this.imgHolder)
    this.imgHolder.style.border = 'solid red 1px'
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.imgHolder.style.transform = `translate(${this.x}px,${this.y}px`;
    super.animate(deltaTime);
  }
}
