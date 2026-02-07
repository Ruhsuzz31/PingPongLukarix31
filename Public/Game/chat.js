import { socket } from "./socket.js";
import { mySide } from "./socket.js";

import { ball } from "./ball/state.js";
import { paddleLeft, paddleRight } from "./paddles/state.js";
import { scoreLeft, scoreRight } from "./hub/state.js";
import { canvas } from "./canvas/state.js";
import { HUD_HEIGHT } from "./hub/state.js";

const chatInput = document.getElementById("chatInput");
const messagesDiv = document.getElementById("messages");

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && chatInput.value.trim() !== "") {
    const input = chatInput.value.trim();
    if (mySide === "left") {
      if (input === "/pause") {
        gamePause();
        chatInput.value = "";
        return;
      }

      if (input === "/reset") {
        resetGame();
      }

      if (input.startsWith("/speed")) {
        const parts = input.split(" ");
        const value = parseFloat(parts[1]);

        if (!isNaN(value)) {
          if (mySide === "left") {
            ball.speedIncrement = value;
          }

          chatInput.value = "";
          return;
        } else {
          console.warn("Comando /speed malformado. Ejemplo: /speed 1.2");
          // Opcional: mostrar mensaje de error en el chat o interfaz
          chatInput.value = "";
          return;
        }
      }
    }

    // Si no fue comando válido, enviamos como mensaje de chat
    socket.emit("chatMessage", input);
    chatInput.value = "";
  }
});

socket.on("chatMessage", ({ nickname, message }) => {
  const msgElement = document.createElement("div");
  msgElement.textContent = `${nickname}: ${message}`;
  messagesDiv.appendChild(msgElement);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
});

let ballPause = null;

function gamePause() {
  if (!ballPause) {
    ballPause = { dx: ball.dx, dy: ball.dy };
    ball.dy = 0;
    ball.dx = 0;
  } else {
    ball.dx = ballPause.dx;
    ball.dy = ballPause.dy;
    ballPause = null;
  }
}

function resetGame() {
  scoreRight.value = 0;
  scoreLeft.value = 0;
  paddleLeft.y = (canvas.height - HUD_HEIGHT) / 2;
  paddleRight.y = (canvas.height - HUD_HEIGHT) / 2;
}
