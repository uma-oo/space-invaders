import { UserInput, canvas, canvasHeight, canvasWidth } from "./index.js"
import { Player } from "./player.js"
import  {Torpedo, AlienShip} from "./torpedo.js"




export class Game {
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
    this.lastTimeTorpedoGenerated = 0
      this.menuElement = document.querySelector(".menu")
    this.overLayElement = document.querySelector(".overLay")
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
    this.generateTorpedo(deltaTime)
    // console.log(this.enemies);
    this.enemies.forEach((enemy) => enemy.slide(timeStamp));
    const Torpedo_INSTANCE = this.enemies.filter(
      (enemy) => enemy instanceof Torpedo
    )[0];
    if (Torpedo_INSTANCE?.canShoot) {
      Torpedo_INSTANCE.canShoot= false
      this.enemyProjectiles.push(Torpedo_INSTANCE.shoot())
    }

    const ALIENS_SHIPS = this.enemies.filter(
      (enemy) => enemy instanceof AlienShip
    );
    this.generateEnemyBullets(ALIENS_SHIPS, deltaTime);
   
    // console.log("projectiles", this.enemyProjectiles);
    this.enemyProjectiles.forEach((enemyShoot) => {
      // console.log("ENEMY", enemyShoot);
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



  generateTorpedo(deltaTime){
    this.lastTimeTorpedoGenerated+= deltaTime
    const torpedo = new Torpedo(this,50, 0, { start: -50, end: this.width - 50 });
    if (this.lastTimeTorpedoGenerated>=10000) {
      this.enemies.push(torpedo);
      canvas.append(torpedo.element)
      this.lastTimeTorpedoGenerated=0
    }
   
  }


  generateEnemies() {
    for (let row = 1; row < 2; row++) {
      for (let col = 1; col < 2; col++) {
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
    console.log("inside the reset",this.enemies);
    this.enemies.forEach((enemy) => {
      console.log("enemy" , enemy);
      console.log("hnayaaaaaaaaaaaaaa");
      enemy.element.remove(); // just in case if the torpedo is gone
    });
    delete this.enemies
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
    this.overLayElement.classList.add('hide')


    this.generateEnemies();
    this.resize()
  }

  gameComplete() {
    const enemies = this.enemies.filter((enemy) => enemy instanceof AlienShip);
    // console.log("enemies inside game comp", enemies);
    let time = this.timerElement.innerHTML
    let score = this.scoreElement.innerHTML
    let isWon = enemies.length === 0 && this.lives > 0;
    let isLost = this.lives === 0;
    if (!isWon && !isLost) return;
    this.isComplet = true;
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
