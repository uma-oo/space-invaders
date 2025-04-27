import {
  canvas,
  DEFAULT_CANVAS_HEIGHT,
  DEFAULT_CANVAS_WIDTH,
} from "./index.js";
import { UserInput } from "./playerInput.js";
import { Player } from "./player.js";
import { Torpedo } from "./torpedo.js";
import { AlienShip } from "./alien.js";

export class Game {
  constructor(scale) {
    this.scaleFactor = scale;
    this.width = DEFAULT_CANVAS_WIDTH * scale;
    this.height = DEFAULT_CANVAS_HEIGHT * scale;
    this.input = new UserInput(this);
    this.player = new Player(this);
    this.pausedGame = false;
    this.lives = 3;
    this.score = 0;
    this.timer = 0;
    this.lastTime = 0;
    this.shootInterval = 5000;
    this.keys = [];
    this.enemies = [];
    this.enemyProjectiles = [];
    this.dangerZoneHeight = 150 * scale;
    this.lastTorpedoShooted = 0;
    this.generateEnemies();
    this.lastTimeTorpedoGenerated = 0
    this.pauseMenuElement = document.querySelector(".pauseMenu");
    this.overLayElement = document.querySelector(".overLay");
    this.gameStatsElement = document.querySelector(".gameUi");
    this.dangerZoneElement = document.querySelector(".dangerZone");
    this.dangerZoneElement.style.height = this.dangerZoneHeight + "px";
    this.scoreElement = document.querySelector(".score>span");
    this.timerElement = document.querySelector(".timer>span");
    this.gameStateElement = document.querySelector(".gameState");
    this.livesElement = document.querySelector(".lives>span");
    this.scale();
  }

  update(deltaTime) {
    console.log('1233')
    if (this.gameComplete()) return;
    this.toggleMenu();
    if (this.pausedGame) return;
    this.handleTimer(deltaTime);
    this.player.update(deltaTime);
    this.generateTorpedo(deltaTime);

    this.enemies.forEach((enemy) => enemy.slide(deltaTime));
    const Torpedo_INSTANCE = this.enemies.filter(
      (enemy) => enemy instanceof Torpedo
    )[0];

    this.generateTorpedoBullets(Torpedo_INSTANCE, deltaTime);

    const ALIENS_SHIPS = this.enemies.filter(
      (enemy) => enemy instanceof AlienShip
    );
    this.generateEnemyBullets(ALIENS_SHIPS, deltaTime);
    this.enemyProjectiles.forEach((enemyShoot) => {
      enemyShoot.update(deltaTime);
    });

    if (
      ALIENS_SHIPS.some(
        (ship) =>
          ship instanceof AlienShip &&
          (ship.x + ship.frameWidth >= this.width || ship.x <= 0)
      )
    ) {
      ALIENS_SHIPS.forEach((ship) => {
        ship.direction *= -1;
        ship.y += 20 * this.scaleFactor;
        ship.speed += 0.5 * this.scaleFactor;
      });
    }

    // check for collision between the player bullets and the enemies
    this.enemies.forEach((enemy, index) => {
      if (enemy.y + enemy.frameHeight > this.height - this.dangerZoneHeight)
        this.lives = 0;
      this.player.projectiles.forEach((projectile) => {
        if (this.checkCollision(enemy, projectile)) {
          this.score += enemy.score;
          this.scoreElement.innerHTML = `${this.score}`;
          projectile.markedForDeletion = true;
          if (enemy instanceof Torpedo) {
            this.lastTimeTorpedoGenerated = 0
          }
          this.enemies.splice(index, 1);
          enemy.destroy();
        }
      });
    });

    this.dangerZoneElement.classList.remove("fliker");
    if (
      ALIENS_SHIPS.some(
        (ship) =>
          ship instanceof AlienShip &&
          ship.y + ship.frameHeight >= (this.height * 60) / 100
      )
    ) {
      this.dangerZoneElement.classList.add("fliker");
    }

    this.handleLives();
  }

  scale() {
    this.width = DEFAULT_CANVAS_WIDTH * this.scaleFactor;
    this.height = DEFAULT_CANVAS_HEIGHT * this.scaleFactor;
    canvas.style.width = this.width + "px";
    canvas.style.height = this.height + "px";
    this.gameStatsElement.style.fontSize = this.scaleFactor * 16 + "px";
  }

  toggleMenu() {
    if (this.pausedGame) this.pauseMenuElement.classList.remove("hide");
    else this.pauseMenuElement.classList.add("hide");
  }


  handleLives() {
    this.enemyProjectiles.forEach((enemyProjectile) => {
      if (this.checkCollision(enemyProjectile, this.player)) {
        enemyProjectile.markedForDeletion = true
        this.lives -= 1;
        if (this.lives >= 0) {
          this.livesElement.innerText = `💜`.repeat(this.lives);
        }
      }
    });
  }

  handleTimer(deltaTime) {
    this.timer += deltaTime;
    console.log(deltaTime)
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

  generateTorpedo(deltaTime) {
    this.lastTimeTorpedoGenerated += deltaTime;
    if (
      this.lastTimeTorpedoGenerated >= 7000 &&
      this.enemies.filter((enemy) => enemy instanceof Torpedo).length === 0
    ) {
      this.enemies.push(new Torpedo(this, 0, 0));
      this.lastTimeTorpedoGenerated = 0;
    }
  }

  generateTorpedoBullets(Torpedo_INSTANCE, deltaTime) {
    this.lastTorpedoShooted += deltaTime;
    if (this.lastTorpedoShooted >= 1500) {
      if (Torpedo_INSTANCE !== undefined) {
        this.enemyProjectiles.push(...Torpedo_INSTANCE?.shoot());
        this.lastTorpedoShooted = 0;
      }
    }
  }

  generateEnemies() {
    for (let row = 2; row < 5; row++) {
      for (let col = 1; col < 8; col++) {
        this.enemies.push(
          new AlienShip(row, col, this)
        );
      }
    }
    this.enemies.forEach((enemy) => canvas.append(enemy.element));
  }

  checkCollision(rect1, rect2) {
    return (
      rect1.x < rect2.x + rect2.frameWidth &&
      rect1.x + rect1.frameWidth > rect2.x &&
      rect1.y < rect2.y + rect2.frameHeight &&
      rect1.frameHeight + rect1.y > rect2.y
    );
  }

  reset() {
    this.player.reset();
    this.player = new Player(this);
    this.enemies.forEach((enemy) => {
      enemy.element.remove();
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
    this.gameStateElement.classList.add("hide");
    this.overLayElement.classList.add("hide");
    this.lastTimeTorpedoGenerated = 0;
    this.livesElement.innerText = `💜`.repeat(this.lives);
    this.generateEnemies();
  }

  gameComplete() {
    const enemies = this.enemies.filter((enemy) => enemy instanceof AlienShip);
    let time = this.timerElement.innerHTML;
    let score = this.scoreElement.innerHTML;
    let isWon = enemies.length === 0 && this.lives > 0;
    let isLost = this.lives === 0;
    if (!isWon && !isLost) return;
    this.gameStateElement.querySelector(".gameStats .time>span").innerHTML =
      time;
    this.gameStateElement.querySelector(".gameStats .score>span").innerHTML =
      score;
    if (isWon)
      this.gameStateElement.querySelector("p").innerHTML = "You Win !!";
    if (isLost)
      this.gameStateElement.querySelector("p").innerHTML = "You Lost !!";
    this.gameStateElement.classList.remove("hide");
    this.overLayElement.classList.remove("hide");
    return true;
  }
}
