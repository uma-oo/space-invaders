import { Enemy } from "./enemy.js";
const TORPEDO_SPRITE =
  "game/assets/Enemy/Weapons/PNGs/Nairan - Torpedo Ship - Weapons.png";

export class Torpedo extends Enemy {
  constructor(moveArea) {
    const frames = {
      totalFrames: 12,
      frameSize: 64,
      onLastFrame: () => {
        this.hide();
        this.freeze();
      },
    };
    const size = { width: 58.5, height: 47 };
    super(TORPEDO_SPRITE, frames, size, moveArea);
  }
}
