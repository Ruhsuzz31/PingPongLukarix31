import { drawHUD } from "./hub/hub.js";
import { updatePaddles, drawPaddle } from "./paddles/paddles.js";
import { paddleLeft, paddleRight } from "./paddles/state.js";
import { updateBall, drawBall } from "./ball/ball.js";
import { mySide, socket } from "./socket.js";
import { drawCenterLine, clearCanvas } from "./canvas/canvas.js";
import { ball } from "./ball/state.js";
import { scoreLeft, scoreRight } from "./hub/state.js";

// Función que actualiza el juego
function updateGame() {
  clearCanvas(); // 1. Borra el canvas
  drawHUD();
  drawCenterLine();
  updatePaddles(); // Mueve las paletas
  if (mySide === "left") {
    updateBall(); // 2. Mueve la pelota
    socket.emit("updateGame", {
      ball: { x: ball.x, y: ball.y, dx: ball.dx, dy: ball.dy },
      scoreLeft: scoreLeft.value,
      scoreRight: scoreRight.value,
    });
  }
  drawPaddle(paddleLeft); // 3. Dibuja la paleta izquierda
  drawPaddle(paddleRight); // 4. Dibuja la paleta derecha
  drawBall(); // 5. Dibuja la pelota

  requestAnimationFrame(updateGame); // Llama a la función en el próximo frame
}

// Iniciar el juego
updateGame();
