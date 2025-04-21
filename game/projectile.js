import { canvas } from "./index.js"


export class Projectile {
  constructor(game, x, y, direction, speed) {
    this.game = game
    this.x = x
    this.y = y
    this.direction = direction
    this.height = 12
    this.width = 8
    this.speed = speed
    this.markedForDeletion = false
    this.imgHolder = document.createElement("div")
    this.imgHolder.style.backgroundColor = "red"
    this.imgHolder.style.position = "absolute"
    this.imgHolder.style.zIndex = "0"
    this.imgHolder.style.width = `${this.width}px`
    this.imgHolder.style.height = `${this.height}px`
    canvas.append(this.imgHolder);
  }

  update() {
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
    this.imgHolder.style.transform = `translate(${this.x - this.width / 2}px, ${this.y
      }px)`;

  }

 
}



export class  TorpedoProjectile {
  constructor(game, x, y, direction, speed){
    this.game = game,
    this.x = x
    this.y = y
    this.direction = direction
    this.speed = 6
    this.markedForDeletion = false
    this.imgHolder = document.createElement("div")
    this.currentFrame = 0
    this.height = 18,
    this.width = 9
    this.imgHolder.style.backgroundImage = `url(./game/assets/Enemy/WeaponEffectsProjectiles/NairanTorpedo_1.png)`
    this.imgHolder.style.backgroundPositionX = `calc( ${this.width} * ${this.currentFrame})`
    this.imgHolder.style.width= `${this.width}px`
    this.imgHolder.style.height = `${this.height}px`
    this.imgHolder.style.position = "absolute"
    this.lastTime=0
    this.lastAnimated =1
    this.animationDelay = 400;
    this.imgHolder.style.zIndex = "0"
    this.totalFrames = 3
    canvas.append(this.imgHolder)
  }
   





  animate(deltaTime){
    
    this.lastTime+=deltaTime
    if (this.lastTime - this.lastAnimated > this.animationDelay) {
      console.log("heeereeeee");
      this.lastAnimated = this.lastTime;
      const style = this.imgHolder.style
      const x = - this.currentFrame * this.width
      style.backgroundPositionX= `${x}px, ${this.y}px`
      this.currentFrame = (this.currentFrame + 1) % 3;
      console.log("frame: ",this.currentFrame);
    }

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
    this.imgHolder.style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px`;

    this.animate(deltaTime)
  }
  



}
