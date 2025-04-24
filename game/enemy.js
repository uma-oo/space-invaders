import { canvas } from "./index.js";

export class Enemy {
  /**
   * @param {string} spriteUrl
   * @param {{totalFrames:number, frameSize:number, onLastFrame(): void }} frames
   * @param {{width:number, height:number}} size
   * @param {{start:number, end:number}} moveArea
   */

  #destroyed = false;
  constructor(spriteUrl, frames, defaultSize) {
    this.defaultSize = defaultSize
    this.frames = frames
    this.element = document.createElement("div")
    this.element.style.transform = "rotate(180deg)"
    this.element.style.backgroundImage = `url('${spriteUrl}')`
    this.element.classList.add("enemy")
    this.speed = 1
    this.stepDelay = 300
    this.animationDelay = 400
    this.lastSlide = 0
    this.pxPerStep = 40
    this.direction = 1
    this.currentFrame = 0
    this.lastAnimated = 1
    this.canShoot = false
    this.time = 0
    canvas.append(this.element)
  }

  


  animate(deltaTime) {
    this.time += deltaTime
    if (this.time - this.lastAnimated > this.animationDelay) {
      this.lastAnimated = this.time;
      const style = this.element.style;
      const x = -this.frames.frameSize * this.currentFrame;
      style.backgroundPositionX = `${x}px, ${this.y}px`;
      if (this.currentFrame === 4 || this.currentFrame === 7 || this.currentFrame === 10) {
        this.canShoot = true
      }
      if (this.currentFrame === this.frames.totalFrames - 1) {
        this.frames.onLastFrame?.();
      }
      this.currentFrame = (this.currentFrame + 1) % this.frames.totalFrames;
    }
  }

  hide() {
    this.moveArea.end += this.size.width;
    this.moveArea.start -= this.size.width;
    this.onEdge = () => {
      this.destroy();
    };
  }

  freeze() {
    this.frames.totalFrames = 0;
  }

  get destroyed() {
    return this.#destroyed
  }

  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true;
    this.element.remove();
    this.freeze();
    this.slide = () => { };
    this.animate = () => { };
    this.element = null;
  }
}




