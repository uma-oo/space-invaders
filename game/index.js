let canvas = document.getElementById('canvas')
let canvasWidth = 400
let canvasHeight = 600

canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';


class UserInput {
    constructor(game) {
        this.game = game,
            window.addEventListener('keydown', e => {
                if (((e.key === "ArrowRight") ||
                    (e.key === "ArrowLeft")
                ) && this.game.keys.indexOf(e.key) === -1) {
                    this.game.keys.push(e.key)
                } else if (e.key === " ") {
                    this.game.player.shoot();
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
            this.speed = 3,
            this.markedForDeletion = false,
            this.imgHolder = document.createElement('div')
    }
    update() {
        this.y -= this.speed;
        if (this.y < this.game.height) {
            this.markedForDeletion = true
            // this.imgHolder.remove()
        };
    }
    draw(canvas) { 
        console.log('drawing bullet', this.imgHolder)
        this.imgHolder.style.backgroundColor = 'red';
        this.imgHolder.style.position = 'absolute'
        this.imgHolder.style.zIndex = '100'
        this.imgHolder.style.width = `${this.width}px`;
        this.imgHolder.style.height = `${this.height}px`;
        this.imgHolder.style.border = 'solid red';
        this.imgHolder.style.transform = `translate(${this.x}px, ${this.y}px)`
        console.log(this.x, this.y)
        canvas.append(this.imgHolder)
    }
}

class Player {
    constructor(game) {
        this.game = game,
            this.width = 48,
            this.height = 48,
            this.x = (this.game.width - this.width) / 2,
            this.y = (this.game.height) - 20,
            this.isDestructed = false,
            this.isRevived = false,
            this.imgHolder = document.createElement('div'),
            // this.imgHolder.style.opacity = 0
            this.imgBase = './game/assets/Player/ships/Fighter.png',
            this.spriteFrame = 0,
            this.engineEffect = './game/assets/Player/engineEffects/fighter.png',
            this.speed = 3,
            this.center = { x: this.x + this.width / 2, y: this.x + this.y + this.height / 2 },
            this.projectiles = []
    }

    update(deltaTime) {
        if (this.game.keys.includes('ArrowRight')) this.x += this.speed * deltaTime * 0.1;
        else if (this.game.keys.includes('ArrowLeft')) this.x -= this.speed * deltaTime * 0.1;
        else this.maxSpeed = 0

        if (this.x > this.game.width - this.width * 0.5) this.x = this.game.width - this.width * 0.5
        else if (this.x < -this.width * 0.5) this.x = -this.width * 0.5

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
        // this.imgHolder.innerHTML = ''
        // drawImage(canvas, this.imgHolder, this.engineEffect, (-this.width *1) , -this.height/2, this.x, this.y, this.width, this.height)
        drawImage(canvas, this.imgHolder, this.imgBase, -this.width / 2, -this.height / 2, this.x, this.y, this.width, this.height)
    }

    shoot() {
        console.log(this.center)
        this.projectiles.push(new Projectile(this.game, this.center.x , this.center.y))
    }
}

class Layer {
    constructor(game, image, speed) {
        this.game = game
    }
    update() {
    }
    draw(context) {
    }
}

class Background {
    constructor(game) {
        this.game = game;
    }
    update() {
    }
    draw(context) {
    }
}


class Game {
    constructor(width, height) {
        this.width = width,
            this.height = height,
            this.input = new UserInput(this),
            this.player = new Player(this),
            this.keys = []
    }

    update(deltaTime) {
        this.player.update(deltaTime)
    }

    draw(canavas) {
        this.player.draw(canavas)
    }
}

function drawImage(canvas, imgHolder, imgSrc, ...arg) {
    let img = document.createElement('img');
    img.src = imgSrc;
    let [sx, sy, dx, dy, dw, dh] = arg;
    imgHolder.style.width = `${dw}px`;
    imgHolder.style.height = `${dh}px`;
    imgHolder.style.border = 'solid red 1px';
    imgHolder.style.transform = `translate(${dx}px, ${dy - dw}px)`

    img.style.height = '200%'
    img.style.objectfit = 'cover'
    img.style.border = 'solid'
    img.style.transform = `translate(${sx}px, ${sy}px)`
    imgHolder.append(img)
    canvas.append(imgHolder)
}

let game = new Game(canvasWidth, canvasHeight)
let lastTime = 0

function gameLoop(timeStamp) {
    let deltaTime = timeStamp - lastTime
    lastTime = timeStamp
    game.draw(canvas)
    game.update(deltaTime)

    requestAnimationFrame(gameLoop)
}

gameLoop(0)