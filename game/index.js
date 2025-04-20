import { AlienShip, Torpedo } from "./torpedo.js";
let layzerBulletSound = document.getElementById("lazerBullet");
let vid = document.getElementById("gameMusic");
vid.volume = 0.3;
let canvas = document.getElementById("canvas");
let canvasWidth = window.innerWidth - window.innerWidth / 5;
let canvasHeight = 580;
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";
const PLAYER_SHIP_IMAGE = "./game/assets/Enemy/chips/Dreadnought.png";
let [canvasLeft, canvasRight] = [
  canvas.getBoundingClientRect().x,
  canvas.getBoundingClientRect().right,
];

class UserInput {
  constructor(game) {
    this.game = game
    this.continue = document.querySelector(".continue")
    this.restarts = document.querySelectorAll(".restart")
    this.Restart = document.querySelector(".Restart")
    this.continue.addEventListener("click", () => {
      this.game.overLayElement.classList.add('hide')
      this.game.pausedGame = false;
    }),
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
    this.imgHolder.style.transform = `translate(
        this.x - this.width / 2
      }px, ${this.y}px)`
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
    this.y += this.speed * this.direction;
    if (this.markedForDeletion) {
      this.imgHolder.remove();
    }
    this.imgHolder.style.transform = `translate(${this.x - this.width / 2}px, ${this.y
      }px)`;
  }
}

class Player {
  constructor(game) {
    this.game = game
    this.canShoot = true
    this.width = 50
    this.height = 64
    this.x = this.game.width / 2 - this.width / 2
    this.y = this.game.height - this.height - 10
    this.speed = 10
    this.projectiles = []
    this.element = document.createElement("div")
    this.element.style.position = "absolute"
    this.element.style.zIndex = "1"
    this.element.style.background = `url(${PLAYER_SHIP_IMAGE}) center no-repeat`
    this.element.style.backgroundSize = "contain"
    this.element.style.backgroundPosition = "center"
    this.element.style.width = `${this.width}px`
    this.element.style.height = `${this.height}px`
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`
    canvas.append(this.element);
  }

  update() {
    if (this.game.keys.includes("ArrowRight")) this.x += this.speed;
    if (this.game.keys.includes("ArrowLeft") && this.x > 0)
      this.x -= this.speed;
    if (this.game.keys.includes(" ")) this.shoot();
    if (this.x + this.width >= this.game.width)
      this.x = this.game.width - this.width;
    this.projectiles.forEach((projectile) => {
      projectile.update();
    });
    this.projectiles = this.projectiles.filter(
      (projectile) => !projectile.markedForDeletion
    );
    this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
  }

  shoot() {
    if (this.canShoot) {
      this.canShoot = false;
      setTimeout(() => (this.canShoot = true), 600);
      layzerBulletSound.play();
      this.projectiles.push(
        new Projectile(this.game, this.x + this.width / 2, this.y, -1, 10)
      );
    }
  }

  reset() {
    this.element.remove();
    this.projectiles.forEach((projectile) => projectile.imgHolder.remove());
    this.projectiles = [];
  }
}

class Game {
  constructor(width, height) {
    this.width = width
    this.height = height
    this.input = new UserInput(this)
    this.player = new Player(this)
    this.pausedGame = false
    this.lives = 3
    this.score = 0
    this.timer = 0
    this.lastTime = 0
    this.shootInterval = 3000
    this.keys = []
    this.enemies = []
    this.enemyProjectiles = []
    this.isComplet = false
    this.generateEnemies(),
      this.menuElement = document.querySelector(".menu")
    this.overLayElement = document.querySelector(".overLay")
    console.log(this.overLayElement)
    this.dangerZoneElement = document.querySelector(".dangerZone")
    this.scoreElement = document.querySelector(".score>span")
    this.timerElement = document.querySelector(".timer>span")
    this.gameStateElement = document.querySelector(".gameState")
    this.livesElement = document.querySelector(".lives>span")
    this.initialWindowWidth = window.innerWidth
    this.initialWindowHeight = window.innerHeight

  }
  resize() {
    const widthDiff = this.initialWindowWidth - window.innerWidth
    const heightDiff = this.initialWindowHeight - window.innerHeight

    canvas.style.width = canvasWidth - widthDiff + "px";
    canvas.style.height = canvasHeight - heightDiff + "px";
    this.player.y = canvasHeight - heightDiff - this.player.height - 10;
    this.enemies.forEach((e) => {
      if (e instanceof AlienShip) {
        const enemySize = Math.min(((canvasWidth - widthDiff) / 100) * 4, 50)
        e.moveArea.end = canvasWidth - widthDiff
        e.size.width = enemySize;
        e.size.height = enemySize;
        e.x = (e.size.width + 20) * e.col
        e.y = (e.size.height + 10) * e.row
        if (e.element) {
          e.element.style.width = `${e.size.width}px`;
          e.element.style.height = `${e.size.height}px`;
        }
      }

    })
    this.width = canvasWidth - widthDiff
  }
  update(deltaTime, timeStamp) {
    if (this.gameComplete()) return;
    this.toggleMenu();
    if (this.pausedGame) return;
    this.handleTimer(deltaTime);
    // handle enemy wave movement and attack
    this.player.update();

    // Handle enemies (movement + attack)
    this.enemies.forEach((enemy) => enemy.slide(timeStamp));
    const ALIENS_SHIPS = this.enemies.filter(
      (enemy) => enemy instanceof AlienShip
    );
    this.generateEnemyBullets(ALIENS_SHIPS, deltaTime);
    this.enemyProjectiles.forEach((enemyShoot) => {
      enemyShoot.update();
    });
    // check for collision between the player and the corners of the canvas
    if (
      ALIENS_SHIPS.some(
        (ship) =>
          ship instanceof AlienShip &&
          (ship.x + ship.size.width >= this.width || ship.x <= 0)
      )
    ) {
      ALIENS_SHIPS.forEach((ship) => {
        ship.direction *= -1;
        ship.y += 20;
        ship.speed += 0.4;
      });
    }

    // check for collision between the player bullets and the enemies
    this.enemies.forEach((enemy, index) => {
      this.player.projectiles.forEach((projectile) => {
        if (this.checkCollision(enemy, projectile)) {
          this.enemies.splice(index, 1);
          this.score += enemy.score;
          this.scoreElement.innerHTML = `${this.score}`;
          projectile.markedForDeletion = true;
          enemy.destroy();
        }
      });
    });

    this.handleLives();
  }

  toggleMenu() {
    if (this.pausedGame) this.menuElement.classList.remove("hide");
    else this.menuElement.classList.add("hide");
  }

  handleLives() {
    this.enemyProjectiles.forEach((enemyProjectile, index) => {
      if (enemyProjectile.markedForDeletion) {
        this.enemyProjectiles.splice(index, 1);
      }
      if (this.checkCollision(enemyProjectile, this.player)) {
        // enemyProjectile.imgHolder.remove()
        enemyProjectile.imgHolder.remove();
        this.enemyProjectiles.splice(index, 1);
        this.lives -= 1;
        this.livesElement.innerText = `❤️`.repeat(this.lives);
      }
    });
  }

  handleTimer(deltaTime) {
    this.timer += deltaTime;
    let seconds = Math.floor(this.timer / 1000) % 60;
    let minutes = Math.floor(this.timer / 60000);
    this.timerElement.innerHTML = `${minutes < 10 ? "0" + minutes : minutes}:${seconds < 10 ? "0" + seconds : seconds
      }`;
  }

  generateEnemyBullets(ALIENS_SHIPS, deltaTime) {
    this.lastTime += deltaTime;
    if (this.lastTime >= this.shootInterval) {
      let shoots = new Set(
        Array.from(
          { length: ALIENS_SHIPS.length > 4 ? 4 : ALIENS_SHIPS.length },
          () => Math.floor(Math.random() * ALIENS_SHIPS.length)
        )
      );
      shoots.forEach((shoot) => {
        this.enemyProjectiles.push(ALIENS_SHIPS[shoot].shoot());
      });
      this.lastTime = 0;
    }
  }

  generateEnemies() {
    const torpedo = new Torpedo(50, 0, { start: -50, end: this.width - 50 });
    this.enemies.push(torpedo);
    for (let row = 1; row < 5; row++) {
      for (let col = 1; col < 9; col++) {
        this.enemies.push(
          new AlienShip(row, col, { start: 0, end: this.width }, this)
        );
      }
    }
    this.enemies.forEach((enemy) => canvas.append(enemy.element));
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }

  // reset the game to the default state !!
  // there is a problem with the torpedo

  reset() {
    this.player.reset();
    this.player = new Player(this);
    this.startMin = 0;
    this.startSec = 0;
    this.enemies.forEach((enemy) => {
      enemy?.element?.remove(); // just in case if the torpedo is gone
    });
    this.enemies = [];
    this.keys = [];
    this.enemyProjectiles.forEach((enemyProjectile) => {
      enemyProjectile.imgHolder.remove();
    });
    this.enemyProjectiles = [];
    this.lives = 3;
    this.score = 0;
    this.timer = 0;
    this.pausedGame = false;
    this.scoreElement.innerHTML = 0;
    this.enemies.forEach((enemy) => {
      enemy.element?.remove();
    });
    this.gameStateElement.classList.add("hide");
    this.overLayElement.classList.add('hide')


    this.generateEnemies();
    this.resize()
  }

  gameComplete() {
    const enemies = this.enemies.filter((enemy) => enemy instanceof AlienShip);
    let overlay = document.getElementById(".overLay")
    let time = this.timerElement.innerHTML
    let score = this.scoreElement.innerHTML
    let isWon = enemies.length === 0 && this.lives > 0;
    let isLost = this.lives === 0;
    if (!isWon && !isLost) return;
    this.isComplet = true;
    console.log("game is lost. ", isWon, isLost);
    this.gameStateElement.querySelector('.gameStats .time>span').innerHTML = time
    this.gameStateElement.querySelector('.gameStats .score>span').innerHTML = score
    if (isWon)
      this.gameStateElement.querySelector("p").innerHTML = "You Win !!";
    if (isLost)
      this.gameStateElement.querySelector("p").innerHTML = "You Lost !!";
    this.gameStateElement.classList.remove("hide");
    this.overLayElement.classList.remove('hide')

    return true;
  }

}

export let game = new Game(canvasWidth, canvasHeight);
window.onresize = () => {
  game.reset()
}
let lastTime = 0;
let frameCounter = 0

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  game.update(deltaTime, timeStamp);
  requestAnimationFrame(gameLoop);
}




gameLoop(0);
