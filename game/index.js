let canvas = document.getElementById('canvas')
let canvasWidth = 300
let canvasHeight = 500

canvas.style.width = canvasWidth + 'px';
canvas.style.height = canvasHeight + 'px';




class UserInput {
    constructor(game) {
        this.game = game,
            window.addEventListener('keydown', e => {
                if (((e.key === "ArrowRight") ||
                    (e.key === "ArrowLeft")
                ) && this.game.keys.indexOf(e.key) === -1) {
                    console.log(e.key)
                    this.game.keys.push(e.key)
                } else if (e.key === " ") {
                    // this.game.player.shoot();
                }
            })
        window.addEventListener('keyup', e => {
            if (this.game.keys.indexOf(e.key) > -1) {
                this.game.keys.splice(this.game.keys.indexOf(e.key), 1)
            }
        })
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
            this.img = document.createElement('img'),
            this.imgBase = './game/assets/Player/ships/Fighter.png',
            this.spriteFrame = 0,
            this.destrctionSprite = './assets/Player/Destruction/Nautolan Ship - Fighter.png',
            this.shieldSprite = './assets/Player/Shields/Nautolan Ship - Fighter - Shield.png',
            this.attckSprite = './assets/Player/Weapons/Nautolan Ship - Fighter - Weapons.png',
            this.img.src = this.imgBase,
            this.speed = 3
    }

    update(deltaTime) {
        if (this.game.keys.includes('ArrowRight')) this.x += this.speed * deltaTime * 0.1;
        else if (this.game.keys.includes('ArrowLeft')) this.x -= this.speed * deltaTime * 0.1;
        else this.maxSpeed = 0
        
        if (this.x > this.game.width - this.width * 0.5) this.x = this.game.width - this.width * 0.5
            else if (this.x < -this.width * 0.5) this.x = -this.width * 0.5
    }

    draw(canvas) {
        drawImage(canvas, this.imgHolder, this.img, this.x, this.y, this.width, this.height)
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

function drawImage(canvas, imgHolder, img, ...arg) {
    let [dx, dy, dw, dh] = arg;
    imgHolder.style.width = `${dw}px`;
    imgHolder.style.height = `${dh}px`;
    imgHolder.style.border = 'solid red 1px';
    imgHolder.style.position = 'absolute';
    imgHolder.style.top = `${dy - dw}px`;
    imgHolder.style.left = `${dx}px`;

    img.style.height = '200%'
    img.style.objectfit = 'cover'
    img.style.transform = 'translate(-25%,-25%)'
    imgHolder.append(img)
    canvas.append(imgHolder)

}


let game = new Game(canvasWidth, canvasHeight)
let lastTime = 0

function gameLoop(currentTime) {
    let deltaTime = currentTime - lastTime
    lastTime = currentTime
    game.draw(canvas)
    game.update(deltaTime)
    
    requestAnimationFrame(gameLoop)
}

gameLoop(0)