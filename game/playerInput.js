import { calculateScale } from "./index.js";

export class UserInput {
    constructor(game) {
        this.game = game
        this.continue = document.querySelector(".continue")
        this.restarts = document.querySelectorAll(".restart")

        // event listeners 
        // continue button 
        this.continue.addEventListener("click", () => {
            this.game.overLayElement.classList.add('hide')
            this.game.pausedGame = false;
        }),

            // restarts options

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

        addEventListener("visibilitychange", () => {
            this.game.pausedGame = true;
        });
        addEventListener("resize", () => {
            this.game.scaleFactor = calculateScale()
            this.game.scale()
            this.game.reset()
        })
    }
}