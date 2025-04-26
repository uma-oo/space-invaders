import { Enemy } from "./enemy.js";
import { canvas } from "./index.js";
// import { TorpedoProjectile } from "./torpedo.js";

const PROJECTILE = "game/assets/bullets/Ray.png" 
const ALIEN_SHIP_SPRITE = "game/assets/Enemy/chips/enemy2.png";



// aliens class 


export class AlienShip extends Enemy {
    constructor(row, col, moveArea, game) {
      const frames = {
        totalFrames: 1,
        // frameSize: 50,
      };
      const defaultSize = { width: 34, height: 50 };
      super(ALIEN_SHIP_SPRITE, frames, defaultSize, moveArea);
      this.game = game;
      this.frameWidth = defaultSize.width * this.game.scaleFactor
      this.frameHeight = defaultSize.height * this.game.scaleFactor
      this.x = (this.frameWidth + 30 * this.game.scaleFactor ) * col 
      this.y = (this.frameHeight + 10 * this.game.scaleFactor) * row 
      this.score = 150
      this.speed = 1
      this.element.style.width = this.frameWidth + 'px'
      this.element.style.background = `url(${ALIEN_SHIP_SPRITE}) center no-repeat`
      this.element.style.height = this.frameHeight + 'px'
      this.element.style.zIndex = '1'
      this.element.style.backgroundPosition = "center"
      this.element.style.backgroundSize = 'contain'
      this.element.style.transform = `rotate(180deg) translate(${this.x}px,${-this.y}px`;
      

    }
  
    slide() {
      const style = this.element.style;
      const step = this.speed * this.direction;
      this.x += step;
      style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px`;
    }
  
  
    shoot() {
      return new Projectile(PROJECTILE,this.game, this.x + this.frameWidth / 2, this.y, 1, 8);
    }
  }
  


  export class Projectile {
    constructor(image, game, x, y, direction, speed) {
      this.spriteWidth = 72 
      this.spriteHeight = 38
      this.image = image;
      this.game = game;
      this.x = x;
      this.y = y;
      this.direction = direction;
      this.speed = speed * this.game.scaleFactor ;
      this.totalFrames = 4;
      this.frameWidth = 18 * this.game.scaleFactor;
      this.frameHeight = 27 * this.game.scaleFactor;
      this.currentFrame = 0;
      this.markedForDeletion = false;
      this.imgHolder = document.createElement("div");
      this.imgHolder.classList.add('bullet')
      this.imgHolder.style.width = `${this.frameWidth}px`
      this.imgHolder.style.height = `${this.frameHeight}px`
      this.img = document.createElement("img")
      this.img.src = PROJECTILE
      this.img.style.width = this.spriteWidth * this.game.scaleFactor + 'px'
      this.img.style.height = this.spriteHeight * this.game.scaleFactor + 'px'
      this.lastTime = 0;
      this.lastAnimated = 1;
      this.animationDelay = 200;
      this.imgHolder.append(this.img)
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
      if (this.markedForDeletion) {
        let index = this.game.enemyProjectiles.indexOf(this)
        if (index !== -1 ) this.game.enemyProjectiles.splice(index, 1);
        this.imgHolder.remove();
      }

      this.y += this.speed * this.direction;
      this.imgHolder.style.transform = `translate(${this.x}px,${this.y}px`
      this.animate(deltaTime)

    }
  
    animate(deltaTime) {
      this.lastTime += deltaTime;
      if (this.lastTime - this.lastAnimated > this.animationDelay) {
        this.lastAnimated = this.lastTime;
        const x = -this.currentFrame * this.frameWidth;
        this.img.style.transform = `translateX(${x}px)`;
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
      }
    }
  }
  