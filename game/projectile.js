import { canvas } from "./index.js";

// Projectile is the main class of all the projectile enemies
// let's make the animation for the projectile

export class Projectile {
  constructor(image, game, x, y, direction, speed) {
    this.image = image;
    this.game = game;
    this.x = x;
    this.y = y;
    this.direction = direction;
    this.speed = speed;
    this.height = 18;
    this.width = 18;
    this.currentFrame = 0;
    this.totalFrames = 5;
    this.markedForDeletion = false;
    this.imgHolder = document.createElement("div");
    this.imgHolder.style.backgroundImage = `url(${this.image})`;
    this.imgHolder.style.backgroundPositionX = `calc( ${this.width} * ${this.currentFrame})`;
    this.imgHolder.style.width = `${this.width}px`;
    this.imgHolder.style.height = `${this.height}px`;
    this.imgHolder.style.position = "absolute";
    // this.imgHolder.style.zIndex = "0"
    this.lastTime = 0;
    this.lastAnimated = 1;
    this.animationDelay = 50;
    // console.log("inside parent: ",this.imgHolder.style.backgroundImage);
    canvas.append(this.imgHolder);
  }

  update(deltaTime) {
    if (this.direction === -1) {
      if (this.y < 0) {
        this.markedForDeletion = true;
      }
    } else {
      if (this.y >= this.game?.height) {
        this.markedForDeletion = true;
      }
    }
    this.y += this.speed * this.direction;
    if (this.markedForDeletion) {
      this.imgHolder.remove();
    }
    this.imgHolder.style.transform = `rotate(180deg) translate(${-this
      .x}px,${-this.y}px`;
    this.animate(deltaTime);
  }

  animate(deltaTime) {
    this.lastTime += deltaTime;
    if (this.lastTime - this.lastAnimated > this.animationDelay) {
      this.lastAnimated = this.lastTime;
      const style = this.imgHolder.style;
      const x = -this.currentFrame * this.direction * this.width;
      style.backgroundPositionX = `${x}px, ${this.y}px`;
      this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
    }
  }
}

export class TorpedoProjectile extends Projectile {
  constructor(image, game, x, y, direction, speed) {
    super(image, game, x, y, direction, speed);
    (this.height = 18), (this.width = 9);
    this.animationDelay = 100;
    this.imgHolder.style.backgroundPositionX = `calc(${this.width} * ${this.currentFrame})`;
    this.imgHolder.style.width = `${this.width}px`;
    this.imgHolder.style.height = `${this.height}px`;
    this.totalFrames = 3;
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

export class Bullet extends Projectile {
  constructor(image, game, x, y, direction, speed) {
    super(image, game, x, y, direction, speed);
    this.width = 19.5;
    this.height = 38;
    this.animationDelay = 100;
    this.imgHolder.style.width = `${this.width}px`;
    this.imgHolder.style.height = `${this.height}px`;
    this.imgHolder.style.backgroundPositionX = `calc(${this.width} * ${this.currentFrame})`;
    this.totalFrames = 4;
    canvas.append(this.imgHolder);
  }

  update(deltaTime) {
    super.update(deltaTime);
    this.imgHolder.style.transform = `translate(${this.x}px,${this.y}px`;
    super.animate(deltaTime);
  }
}
