import { Enemy } from "./enemy.js";
import { Projectile, TorpedoProjectile } from "./projectile.js";
const TORPEDO_SPRITE =
  "game/assets/Enemy/Weapons/PNGs/Nairan - Torpedo Ship - Weapons.png";
const ALIEN_SHIP_SPRITE = "game/assets/Enemy/chips/Frigate.png";
const TORPEDO_PROJECTILE = "game/assets/Enemy/WeaponEffectsProjectiles/NairanTorpedo_1.png"
const PROJECTILE ="game/assets/Enemy/WeaponEffectsProjectiles/18px.png" 


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
    this.y = y;
    this.game = game;
    this.offsetShoot = 1;
    this.width = size.width;
    this.height = size.height;
    this.score = 500;
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




// aliens class 


export class AlienShip extends Enemy {
  constructor(row, col, moveArea, game) {
    const frames = {
      totalFrames: 1,
      frameSize: 42,
    };
    const size = { width: 42, height: 42 };
    super(ALIEN_SHIP_SPRITE, frames, size, moveArea);
    this.row = row;
    this.col = col;
    this.game = game;
    this.x = (size.width + 20) * col;
    this.y = (size.height + 10) * row;
    this.element.style.zIndex = "1";
    this.element.style.boxShadow = "-1px 1px 3px 2px black";
    this.width = size.width;
    this.height = size.height;
    this.score = 150;
    this.speed = 1;
    this.element.style.backgroundSize = "cover";

  }

  slide() {
    const style = this.element.style;
    const step = this.speed * this.direction;
    this.x += step;
    style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px`;
  }


  shoot() {
    return new Projectile(PROJECTILE,this.game, this.x + this.width / 2, this.y, 1, 5);
  }
}
