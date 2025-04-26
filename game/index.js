
import { Game } from "./game.js"

export let canvas = document.getElementById("canvas");
export let DEFAULT_CANVAS_WIDTH = 1000;
export let DEFAULT_CANVAS_HEIGHT = 850;

export let game;


// addEventListener

document.querySelector('#startGameBtn').onclick = () => countDown(3)

let lastTime = 0;
function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  let gameScaleFactor = calculateScale()
  canvas.style.width = DEFAULT_CANVAS_WIDTH * gameScaleFactor + 'px'
  canvas.style.height = DEFAULT_CANVAS_HEIGHT * gameScaleFactor + 'px'
  game.update(deltaTime, gameScaleFactor);
  requestAnimationFrame(gameLoop);
}

export function calculateScale() {
  let width = document.documentElement.clientWidth
  let height = document.documentElement.clientHeight

  if (width >= 1000 && height >= 850) {
    return 1;
  }
  const scaleX = width / 1000;  // Original width = 1000px
  const scaleY = height / 850;  // Original height = 850px
  let scale = Math.min(scaleX, scaleY)
  return scale
}

function countDown(time) {
  document.querySelector(".gameStartMenu").classList.add('hide')
  if (time >= 0) {
    document.querySelector('.counterDown').innerHTML = time === 0 ? "Go!!" : time
    setTimeout(function () { countDown(time - 1) }, 1000);
  } else {
    document.querySelector(".overLay").classList.add('hide')
    document.querySelector(".counterDown").classList.add('hide')
    game = new Game(calculateScale())
    gameLoop(0);
  };
}
