import { Bullet } from "./projectile.js";


const PLAYER_SHIP_IMAGE = "game/assets/Enemy/chips/Dreadnought.png";
const layzerBulletSound = document.getElementById("lazerBullet");
const BULLET ="game/assets/Player/Weapon EffectsProjectiles/Nautolan - Bullet.png"


export class Player {
  constructor(game) {
    this.game = game
    this.canShoot = true
    this.width = 50
    this.height = 64
    this.x = this.game.width / 2 - this.width / 2
    this.y = this.game.height - this.height - 10
    this.speed = 10
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
    canvas.append(this.element);
  }
  
  
  update(deltaTime) {
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
        new Bullet(BULLET,this.game, this.x + this.width / 2, this.y, -1, 3)
      );
    }
  }

  reset() {
    this.element.remove();
    this.projectiles.forEach((projectile) => projectile.imgHolder.remove());
    this.projectiles = [];
  }
}