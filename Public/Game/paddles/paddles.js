import { paddleLeft, paddleRight, paddleSpeed } from "./state.js";
import { socket, mySide } from "../socket.js";
import { canvas, ctx } from "../canvas/state.js";
import { keys } from "../input/input.js";
import { HUD_HEIGHT } from "../hub/state.js";

// Dibuja una paleta
export function drawPaddle(paddle) {
  ctx.fillStyle = paddle.color;
  ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// Mueve las paletas basado en las teclas presionadas
export function updatePaddles() {
  let lastPaddleY = null;
  // Movimiento de la paleta izquierda (W y S)
  if (mySide === "left") {
    lastPaddleY = paddleLeft.y;
    if ((keys.w || keys.ArrowUp) && paddleLeft.y > HUD_HEIGHT) {
      paddleLeft.y -= paddleSpeed;
    }
    if (
      (keys.s || keys.ArrowDown) &&
      paddleLeft.y + paddleLeft.height < canvas.height
    ) {
      paddleLeft.y += paddleSpeed;
    }
    if (lastPaddleY !== paddleLeft.y) {
      socket.emit("paddleMove", { side: mySide, y: paddleLeft.y });
    }
  }

  // Movimiento de la paleta derecha (ArrowUp y ArrowDown)
  if (mySide === "right") {
    lastPaddleY = paddleRight.y;
    if ((keys.w || keys.ArrowUp) && paddleRight.y > HUD_HEIGHT) {
      paddleRight.y -= paddleSpeed;
    }
    if (
      (keys.s || keys.ArrowDown) &&
      paddleRight.y + paddleRight.height < canvas.height
    ) {
      paddleRight.y += paddleSpeed;
    }
    if (lastPaddleY !== paddleRight.y) {
      socket.emit("paddleMove", { side: mySide, y: paddleRight.y });
    }
  }
}
