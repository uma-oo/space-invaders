export class Enemy {
  /**
   *
   * @param {string} spriteUrl
   * @param {{totalFrames:number, frameSize:number, onLastFrame(): void }} frames
   * @param {{width:number, height:number}} size
   * @param {{start:number, end:number}} moveArea
   */

  #destroyed = false;
  constructor(spriteUrl, frames, size, moveArea) {
    this.size = size;
    this.frames = frames;
    this.moveArea = moveArea;

    const div = document.createElement("div");
    this.element = div;
    div.style.transform = "rotate(180deg)";
    div.style.backgroundImage = `url('${spriteUrl}')`;
    div.style.width = `${this.size.width}px`;
    div.style.height = `${this.size.height}px`;
    div.classList.add("enemy");

    this.speed = 1;
    this.stepDelay = 300;
    this.animationDelay = 400;
    this.lastSlide = 0;
    this.pxPerStep = 40;
    this.direction = 1;
    this.currentFrame = 0;
    this.lastAnimated = 1;
  }
  onEdge(step) {
    this.direction *= -1;
    this.x -= step;
  }
  slide(time) {
    const { start, end } = this.moveArea;

    const style = this.element.style;
    const elapsed = time - this.lastSlide;
    const step =
      this.speed *
      this.direction *
      ((elapsed / this.stepDelay) * this.pxPerStep);

    this.x += step;
    if (this.x < start || this.x + parseInt(style.width) > end) {
      this.onEdge(step);
    }
    this.lastSlide = time;
    style.transform = `rotate(180deg) translate(${-this.x}px,${-this.y}px)`;
    this.animate(time);
  }
  animate(time) {
    if (time - this.lastAnimated > this.animationDelay) {
      this.lastAnimated = time;
      const style = this.element.style;
      const x = -this.frames.frameSize * this.currentFrame;

      style.backgroundPositionX = `${x}px, ${this.y}px`;

      if (this.currentFrame === this.frames.totalFrames - 1)
        this.frames.onLastFrame?.();

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
  get destroyed(){
    return this.#destroyed
  }
  destroy() {
    if (this.#destroyed) return;
    this.#destroyed = true;
    this.element.remove();
    this.freeze(); 
    this.slide = () => {};
    this.animate = () => {}; 
    this.element = null;
  }
   
  
   
  
}




