import { AlienShip, Torpedo } from "./torpedo.js";
let layzerBulletSound = document.getElementById("lazerBullet");

let canvas = document.getElementById("canvas");
let canvasWidth = 1000;
let canvasHeight = 700;
canvas.style.width = canvasWidth + "px";
canvas.style.height = canvasHeight + "px";
const PLAYER_SHIP_IMAGE = "./game/assets/Enemy/chips/Dreadnought.png";
let [canvasLeft, canvasRight] = [
  canvas.getBoundingClientRect().x,
  canvas.getBoundingClientRect().right,
];
console.log(canvasLeft, canvasRight);

class UserInput {
  constructor(game) {
    (this.game = game),
      (this.continue = document.querySelector(".continue")),
      (this.restart = document.querySelector(".restart")),
      this.continue.addEventListener("click", () => {
        this.game.pausedGame = false;
      }),
      this.restart.addEventListener("click", () => {
        this.game.pausedGame = false;
        this.game.reset();
      }),
      window.addEventListener("keydown", (e) => {
        if (
          (e.key === "ArrowRight" || e.key === "ArrowLeft" || e.key === " ") &&
          this.game.keys.indexOf(e.key) === -1
        ) {
          this.game.keys.push(e.key);
        }
        if (e.key === "Escape") {
          this.game.pausedGame = !this.game.pausedGame;
        }
      }),
      window.addEventListener("keyup", (e) => {
        if (this.game.keys.indexOf(e.key) > -1) {
          this.game.keys.splice(this.game.keys.indexOf(e.key), 1);
        }
      });
  }
}

export class Projectile {
  constructor(game, x, y, direction, speed) {
    (this.game = game),
      (this.x = x),
      (this.y = y),
      (this.direction = direction),
      (this.height = 10),
      (this.width = 5),
      (this.speed= speed),
      (this.markedForDeletion = false),
      (this.imgHolder = document.createElement("div")),
      (this.imgHolder.style.backgroundColor = "red"),
      (this.imgHolder.style.position = "absolute"),
      (this.imgHolder.style.zIndex = "0"),
      (this.imgHolder.style.width = `${this.width}px`),
      (this.imgHolder.style.height = `${this.height}px`),
      (this.imgHolder.style.transform = `translate(${
        this.x - this.width / 2
      }px, ${this.y}px)`),
      canvas.append(this.imgHolder);
  }

  update() {
    this.y += this.speed * this.direction ;
    if (this.y < 0) {
      this.markedForDeletion = true;
    }
    if (this.markedForDeletion) {
      this.imgHolder.remove();
    }
    this.imgHolder.style.transform = `translate(${this.x - this.width / 2}px, ${
      this.y
    }px)`;
  }
}

class Player {
  constructor(game) {
    (this.game = game),
      (this.canShoot = true),
      (this.width = 64),
      (this.height = 64),
      (this.x = this.game.width / 2 - this.width / 2),
      (this.y = this.game.height - this.height - 5),
      // this.imgHolder.style.opacity = 0
      (this.speed = 5),
      (this.projectiles = []),
      (this.element = document.createElement("div")),
      (this.element.style.position = "absolute"),
      (this.element.style.zIndex = "2"),
      (this.element.style.background = `url(${PLAYER_SHIP_IMAGE}) center no-repeat`),
      (this.element.style.backgroundSize = "contain"),
      (this.element.style.backgroundPosition = "center"),
      (this.element.style.width = `${this.width}px`),
      (this.element.style.height = `${this.height}px`),
      // this.element.style.border = 'solid red 1px',
      (this.element.style.transform = `translate(${this.x}px, ${this.y}px)`),
      canvas.append(this.element);
  }

  update() {
    if (this.game.keys.includes("ArrowRight")) this.x += this.speed;
    else if (this.game.keys.includes("ArrowLeft") && this.x > 0)
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
    layzerBulletSound.play();
    if (this.canShoot) {
      this.canShoot = false;
      setTimeout(() => (this.canShoot = true), 600);
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
    (this.width = width),
      (this.height = height),
      (this.input = new UserInput(this)),
      (this.player = new Player(this)),
      (this.pausedGame = false),
      (this.startMin = 0),
      (this.startSec = 0),
      (this.lastTime = 0);
    (this.shootInterval = 3000),
      (this.menu = document.querySelector(".menu")),
      (this.keys = []),
      (this.enemies = []),
      (this.enemyProjectiles = []);
    this.generateEnemies(), this.generateBullets();
  }

  generateBullets() {
    if (this.lastTime >= this.shootInterval) {
      let shoots = Array.from({ length: 3 }, () =>
        Math.floor(Math.random() * this.enemies.length)
      );
      shoots.forEach((shoot) => {
        this.enemyProjectiles.push(this.enemies[shoot].shoot());
      });
      this.lastTime = 0;
    }
  }

  generateEnemies() {
    const torpedo = new Torpedo(50, 0, { start: -50, end: this.width - 50 });
    this.enemies.push(torpedo);
    for (let row = 1; row < 5; row++) {
      for (let col = 1; col < 10; col++) {
        this.enemies.push(
          new AlienShip(row, col, { start: 0, end: this.width })
        );
      }
    }
    this.enemies.forEach((enemy) => canvas.append(enemy.element));
  }

  reset() {
    this.player.reset();
    this.player = new Player(this);
    this.startMin = 0;
    this.startSec = 0;
    this.enemies.forEach((enemy) => {
      enemy.element?.remove(); // just in case if the torpedo is gone
    });
    this.enemies = [];
    this.generateEnemies();
    this.keys = [];
  }

  hideMenu() {
    this.menu.style.display = "none";
  }

  showMenu() {
    this.menu.style.display = "block";
  }

  update(deltaTime, timeStamp) {
    if (this.pausedGame) {
      this.showMenu();
      return;
    }
    this.lastTime += deltaTime;
    console.log("last time after update", this.lastTime);
    this.hideMenu();
    this.player.update();
    this.enemies.forEach((enemy) => enemy.slide(timeStamp));
    const ALIENS_SHIPS = this.enemies.filter(
      (enemy) => enemy instanceof AlienShip
    );

    if (
      ALIENS_SHIPS.some(
        (ship) =>
          ship instanceof AlienShip &&
          (ship.x + ship.size.width == this.width || ship.x == 0)
      )
    ) {
      ALIENS_SHIPS.forEach((ship) => {
        ship.y += 20;
        ship.direction *= -1;
      });
    }

    this.generateBullets();
    //check for collesion
    this.enemies.forEach((enemy, index) => {
      this.player.projectiles.forEach((projectile) => {
        if (this.checkCollision(enemy, projectile)) {
          projectile.markedForDeletion = true;
          enemy.destroy();
          this.enemies.splice(index, 1);
        }
      });
    });
   
    this.enemyProjectiles.forEach((enemyShoot) => {
        console.log("hunaaaaa");
      enemyShoot.update(deltaTime);
    });
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.width &&
      rect1.x + rect1.width > rect2.x &&
      rect1.y < rect2.y + rect2.height &&
      rect1.height + rect1.y > rect2.y
    );
  }
}

export let game = new Game(canvasWidth, canvasHeight);
let lastTime = 0;

function gameLoop(timeStamp) {
  let deltaTime = timeStamp - lastTime;
  lastTime = timeStamp;
  game.update(deltaTime, timeStamp);
  requestAnimationFrame(gameLoop);
}

gameLoop(0);
