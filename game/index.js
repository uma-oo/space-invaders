
import {Game}  from "./game.js"

export let canvas = document.getElementById("canvas");
export let canvasWidth = window.innerWidth - window.innerWidth / 5;
export let canvasHeight = 580;

export let defaultCanvasWidth = 1000;
export let defaultCanvasHeight = 850;

canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";



export class UserInput {
  constructor(game) {
    this.game = game
    this.continue = document.querySelector(".continue")
    this.restarts = document.querySelectorAll(".restart")

    // event listeners 
    // continue button 
    this.continue.addEventListener("click", () => {
      this.game.overLayElement.classList.add('hide')
      this.game.pausedGame = false;
    }),


    // restarts options
    
      this.restarts.forEach((restart) => {
        restart.addEventListener("click", () => {
          this.game.reset();
        });
      });

    addEventListener("keydown", (e) => {
      if (
        (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === " ") &&
        this.game.keys.indexOf(e.key) === -1
      ) {
        this.game.keys.push(e.key);
      }
      if (e.key === "Escape") {
        this.game.overLayElement.classList.remove('hide')
        this.game.pausedGame = true;
      }
    }),
      addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });

      addEventListener("visibilitychange", () => {
        this.game.pausedGame = true;
      });
      addEventListener("resize", () => {
        this.game.scaleFactor = calculateScale()
        this.game.scale()
        this.game.reset()
      })
  }
}

export function calculateScale() {
  if (window.innerWidth >= 1000 && window.innerHeight >= 850) {
    return 1;
  }
  const scaleX = window.innerWidth / 1000;  // Original width = 1000px
  const scaleY = window.innerHeight / 850;  // Original height = 850px
  let scale = Math.min(scaleX, scaleY)
  return scale
}

export let game = new Game(calculateScale());


let lastTime = 0;
function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  // console.log(innerWidth,innerHeight) 
  let gameScaleFactor = calculateScale()
  canvas.style.width = defaultCanvasWidth * gameScaleFactor + 'px'
  canvas.style.height = defaultCanvasHeight * gameScaleFactor + 'px'
  game.update(deltaTime, gameScaleFactor);
  requestAnimationFrame(gameLoop);
}

gameLoop(0);
