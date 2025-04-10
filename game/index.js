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
        this.game = game;
        this.x = x;
        this.y = y;
        this.width = 10
        this.height = 3
        this.speed = 3;
        this.markedForDeletion = false;
        this.image = document.getElementById('projectile');
    }
    update() {
        this.x += this.speed;
        if (this.x > this.game.height) this.markedForDeletion = true;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y)
    }
}

class Player {
    constructor(game) {
        this.game = game,
            this.width = 64,
            this.height = 64,
            this.x = (this.game.width - this.width) / 2,
            this.y = (this.game.height) - 20,
            this.isDestructed = false,
            this.isRevived = false,
            this.imgHolder = document.createElement('div'),
            // this.img = document.createElement('img'),
            this.imgBase = './game/assets/Player/ships/Fighter.png',
            this.spriteFrame = 0,
            this.destrctionSprite = './game/assets/Player/Destruction/Nautolan Ship - Fighter.png',
            this.shieldSprite = './game/assets/Player/Shields/Nautolan Ship - Fighter - Shield.png',
            this.attckSprite = './game/assets/Player/Weapons/Nautolan Ship - Fighter - Weapons.png',
            this.engineEffect = './game/assets/Player/engineEffects/fighter.png'
            // this.img.src = this.imgBase,
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
        this.imgHolder.innerHTML = ''
        // drawImage(canvas, this.imgHolder, this.engineEffect, (-this.width *1) , -this.height/2, this.x, this.y, this.width, this.height)
        drawImage(canvas, this.imgHolder, this.imgBase, -this.width/2, -this.height/2, this.x, this.y, this.width, this.height)
        // console.log(this.imgHolder)
    }

    shoot(){

    } 
}

class Layer {
    constructor(game, image, speedModifier) {
        this.game = game;
        this.image = image;
        this.speedModifier = speedModifier;
        this.width = 1768;
        this.height = 500;
        this.x = 0;
        this.y = 0;
    }
    update() {
        if (this.x <= -this.width) this.x = 0;
        else this.x -= this.game.speed * this.speedModifier;
    }
    draw(context) {
        context.drawImage(this.image, this.x, this.y)
        context.drawImage(this.image, this.x + this.width, this.y)
    }
}

class Background {
    constructor(game) {
        this.game = game;
        this.image1 = document.getElementById('layer1');
        this.image2 = document.getElementById('layer2');
        this.image3 = document.getElementById('layer3');
        this.image4 = document.getElementById('layer4');
        this.layer1 = new Layer(this.game, this.image1, .2);
        this.layer2 = new Layer(this.game, this.image2, .4);
        this.layer3 = new Layer(this.game, this.image3, 1);
        this.layer4 = new Layer(this.game, this.image4, 1.5);
        this.layers = [this.layer1, this.layer2, this.layer3]
    }
    update() {
        this.layers.forEach(layer => layer.update())
    }
    draw(context) {
        this.layers.forEach(layer => layer.draw(context))
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

function drawImage(canvas,imgHolder, imgSrc, ...arg) {
    let img = document.createElement('img');
    img.src = imgSrc;
    let [sx, sy, dx, dy, dw, dh] = arg;
    imgHolder.style.width = `${dw}px`;
    imgHolder.style.height = `${dh}px`;
    imgHolder.style.border = 'solid red 1px';
    imgHolder.style.position = 'absolute';
    imgHolder.style.top = `${dy - dw}px`;
    imgHolder.style.left = `${dx}px`;

    img.style.height = '200%'
    img.style.objectfit = 'cover'
    img.style.border = 'solid'
    img.style.transform = `translate(${sx}px, ${sy}px)`
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