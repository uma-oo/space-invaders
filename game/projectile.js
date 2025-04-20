


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

  update() {
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
