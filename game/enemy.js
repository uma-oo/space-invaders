import { canvas } from "./index.js";

export class Enemy {
  constructor(spriteUrl, defaultSize) {
    this.defaultSize = defaultSize
    this.element = document.createElement("div")
    this.element.style.background = `url('${spriteUrl}') center no-repeat`
    this.element.style.backgroundSize = 'contain'
    this.element.classList.add("enemy")
    this.direction = 1
    canvas.append(this.element)
  }

  destroy() {
    this.element.remove();
    this.element = null;
  }
}




