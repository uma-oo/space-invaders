import { AlienShip, Torpedo } from "./torpedo.js";
let layzerBulletSound = document.getElementById('lazerBullet')

let canvas = document.getElementById('canvas')
let canvasWidth = 320
let canvasHeight = 600
canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';
let [canvasLeft, canvasRight] = [canvas.getBoundingClientRect().x, canvas.getBoundingClientRect().right]
console.log(canvasLeft, canvasRight)

class UserInput {
    constructor(game) {
        this.game = game,
            window.addEventListener('keydown', e => {
                if (((e.key === "ArrowRight") ||
                    (e.key === "ArrowLeft") || (e.key === " ")
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key)
                }
            })
        window.addEventListener('keyup', e => {
            if (this.game.keys.indexOf(e.key) > -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
            }
        })
    }
}

class Projectile {
    constructor(game, x, y) {
        this.game = game,
            this.x = x,
            this.y = y,
            this.height = 20,
            this.width = 10,
            this.speed = 10,
            this.markedForDeletion = false,
            this.imgHolder = document.createElement('div')
    }
    update() {
        this.y -= this.speed;

        if (this.y < 0) {
            this.markedForDeletion = true

        };

        if (this.markedForDeletion) {
            this.imgHolder.remove()
        }
    }
    draw(canvas) {
        this.imgHolder.style.backgroundColor = 'red';
        this.imgHolder.style.position = 'absolute'
        this.imgHolder.style.zIndex = '0'
        this.imgHolder.style.width = `${this.width}px`;
        this.imgHolder.style.height = `${this.height}px`;
        // this.imgHolder.style.border = 'solid red';
        this.imgHolder.style.transform = `translate(${this.x - this.width / 2}px, ${this.y}px)`
        canvas.append(this.imgHolder)
    }
}

class Player {
    constructor(game) {
        this.game = game,
            this.canShoot = true,
            this.spriteWidth = 64,
            this.spriteheight = 54,
            this.width = 64,
            this.height = 54,
            this.x = (this.game.width - this.width) / 2,
            this.y = (this.game.height) - 20,
            this.isDestructed = false,
            this.isRevived = false,
            this.imgHolder = document.createElement('div'),
            // this.imgHolder.style.opacity = 0
            this.imgBase = './game/assets/Player/ships/Fighter.svg',
            this.spriteFrame = 0,
            this.engineEffect = './game/assets/Player/engineEffects/fighter.png',
            this.speed = 5,
            this.center = { x: this.x + this.width / 2, y: this.x + this.y + this.height / 2 },
            this.projectiles = []
    }

    update() {
        if (this.game.keys.includes('ArrowRight')) this.x += this.speed;
        else if (this.game.keys.includes('ArrowLeft') && this.x > 0) this.x -= this.speed;
        if (this.game.keys.includes(' ')) this.shoot();
        if (this.x + this.width > this.game.width) this.x = this.game.width - this.width
        this.projectiles.forEach(projectile => {
            projectile.update()
        })
        this.projectiles = this.projectiles.filter(projectile => !projectile.markedForDeletion)

    }

    draw(canvas) {
        this.projectiles.forEach(projectile => {
            projectile.draw(canvas)
        })
        // if (this.game.)
        this.imgHolder.innerHTML = ''
        // this.imgHolder.style.display = 'flex'
        // this.imgHolder.style.alignItems = 'center'
        // this.imgHolder.style.justifyContent = 'center'

        // drawImage(canvas, this.imgHolder, this.engineEffect, (-this.width *1) , -this.height/2, this.x, this.y, this.width, this.height)
        drawImage(canvas, this.imgHolder, this.imgBase, 0, 0, this.spriteWidth, this.spriteheight, this.x, this.y, this.width, this.height)
    }

    shoot() {
        // layzerBulletSound.play()
        if (this.canShoot) {
            this.canShoot = false
            setTimeout(() => this.canShoot = true, 200)
            this.projectiles.push(new Projectile(this.game, this.x + this.width / 2,
                this.y - this.height))
        }
    }
}





function detectCollision(elementA, elementB) {
    // element A is the target 
    let [boundariesA, boundariesB] = [elementA?.getBoundingClientRect(), elementB?.getBoundingClientRect()]
    let [lbA, rbA, bbA] = [boundariesA?.x, boundariesA?.right, boundariesA?.bottom]
    let [lbB, rbB, btB] = [boundariesB?.x, boundariesB?.right, boundariesB?.y]
    return (((lbB >= lbA && lbB <= rbA) || (rbB >= lbA && rbB <= rbA)) && btB <= bbA)
}


class Game {
    constructor(width, height) {
        this.width = width,
            this.height = height,
            this.input = new UserInput(this),
            this.player = new Player(this),
            this.keys = []
        const torpedo = new Torpedo(50, 0, { start: 0, end: this.width })
        this.enemies = [torpedo,]
        for (let row = 1; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                this.enemies.push(new AlienShip(row, col, { start: 0, end: this.width }))
            }
        }
        this.enemies.forEach((enemy) => canvas.append(enemy.element))
    }

    update(timeStamp) {
        let deltaTime = timeStamp - lastTime
        lastTime = timeStamp
        this.enemies.forEach((enemy) => enemy.slide(timeStamp))
        this.player.update()
        this.enemies.forEach((enemy) => {
            if (enemy instanceof AlienShip) {
                console.log(enemy.x, enemy.x+enemy.size.width);
                if (enemy.x == 0 || enemy.x+enemy.size.width == this.width) {
                    enemy.y += 5
                    enemy.direction *= -1
                }
            }
            this.player.projectiles.forEach((projectile) => {
                if (detectCollision(enemy.element, projectile.imgHolder)) {
                    projectile.markedForDeletion = true
                    enemy.destroy()
                }
            })
        })
    }

    draw(canavas) {
        // console.log(this.keys)

        this.player.draw(canavas)
    }
}

function touchEdge(enemy, left, right) {
    console.log(enemy.x, left, right)
    return (enemy.x === left || enemy.x + enemy.size.width === right)
}


function drawImage(canvas, imgHolder, imgSrc, ...arg) {
    let img = document.createElement('img');
    img.src = imgSrc;
    let [sx, sy, sw, sh, dx, dy, dw, dh] = arg;
    imgHolder.style.width = `${dw}px`;
    imgHolder.style.height = `${dh}px`;
    imgHolder.style.border = 'solid red 1px';
    imgHolder.style.transform = `translate(${dx}px, ${dy - dw}px)`

    img.style.height = `${sh}px`
    img.style.width = `${sw}px`
    img.style.objectfit = 'cover'
    img.style.border = 'solid green 1px'
    img.style.transform = `translate(${sx}px, ${sy}px)`
    imgHolder.append(img)
    canvas.append(imgHolder)
}

export let game = new Game(canvasWidth, canvasHeight)
let lastTime = 0

function gameLoop(timeStamp) {
    game.draw(canvas)
    game.update(timeStamp)

    requestAnimationFrame(gameLoop)
}

gameLoop(0)