import { game } from "./index.js";

export class Enemy {
    constructor(spriteUrl, {totalFrames, frameSize}) {
        const div = document.createElement("div")
        this.element = div;
        div.style.transform = "rotate(180deg)" 
        div.style.backgroundImage = `url('${spriteUrl}')`
        div.style.width = "58.5px"
        div.style.height = "47px"
        div.classList.add("enemy")

        this.frame = 0
        this.totalFrames = totalFrames
        this.speed = 1
        this.stepDelay = 300
        this.lastAnimated = 0
        this.x = 0
        this.pxPerStep = 40
        this.direction = 1
    }
    shoot(){
        
    }
    animate(time){
        const style = this.element.style
        const elapsed = time-this.lastAnimated
        const step = this.speed*this.direction*((elapsed/this.stepDelay)*this.pxPerStep)

        this.x += step 
        if (this.x+parseInt(style.width)> game.width || this.x < 0) {
            this.direction *=-1
            this.x -= step
        }
        this.lastAnimated = time
        style.transform = `rotate(180deg) translate(${-this.x}px)`
    }
}
