import { canvas } from "../canvas/state.js";
import { HUD_HEIGHT } from "../hub/state.js";

// Velocidad de movimiento de las paletas
export const paddleSpeed = 5;

export const paddleLeft = {
  x: 20,
  y: (canvas.height - HUD_HEIGHT) / 2,
  width: 10,
  height: 100,
  color: "white",
};

export const paddleRight = {
  x: canvas.width - 20,
  y: (canvas.height - HUD_HEIGHT) / 2,
  width: 10,
  height: 100,
  color: "white",
};
