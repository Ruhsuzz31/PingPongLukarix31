import { HUD_HEIGHT } from "../hub/state.js";
import { canvas, ctx } from "./state.js";

// Borra el canvas antes de dibujar los nuevos elementos
export function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

export function drawCenterLine() {
  const segmentHeight = 10;
  const gap = 10;
  ctx.fillStyle = "#fff"; // Blanco o el color que estés usando

  for (let y = HUD_HEIGHT + gap; y < canvas.height; y += segmentHeight + gap) {
    ctx.fillRect(canvas.width / 2 - 1, y, 2, segmentHeight);
  }
}

/* // Dibujar un rectángulo (pala del jugador)
ctx.fillStyle = "black"; // Color blanco
ctx.fillRect(20, 150, 10, 100); // (x, y, ancho, alto)
ctx.fillRect(800-20, 150, 10, 100); // (x, y, ancho, alto) */
