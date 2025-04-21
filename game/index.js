
import {Game}  from "./game.js"

export let canvas = document.getElementById("canvas");
export let canvasWidth = window.innerWidth - window.innerWidth / 5;
export let canvasHeight = 580;



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

    document.addEventListener("visibilitychange", () => {
      this.game.pausedGame = true;
    });
  }
}


export let game = new Game(canvasWidth, canvasHeight);
window.onresize = () => {
  game.reset()
}
let lastTime = 0;
function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  game.update(deltaTime, timeStamp);
  requestAnimationFrame(gameLoop);
}



gameLoop(0);
