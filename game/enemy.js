import { canvas } from "./index.js";

export class Enemy {
  /**
   * @param {string} spriteUrl
   * @param {{totalFrames:number, frameSize:number, onLastFrame(): void }} frames
   * @param {{width:number, height:number}} size
   * @param {{start:number, end:number}} moveArea
   */

  #destroyed = false;
  constructor(spriteUrl, defaultSize) {
    this.defaultSize = defaultSize
    this.element = document.createElement("div")
    this.element.style.transform = "rotate(180deg)"
    this.element.style.backgroundImage = `url('${spriteUrl}')`
    this.element.classList.add("enemy")
    this.speed = 1
    this.direction = 1
    canvas.append(this.element)
  }

  destroy() {
    this.element.remove();
    this.element = null;
  }
}




