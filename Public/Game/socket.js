import { ball } from "./ball/state.js";
import { scoreLeft, scoreRight } from "./hub/state.js";
import { nicknameRival } from "./input/state.js";
import { paddleLeft, paddleRight } from "./paddles/state.js";

export const socket = io();
export let mySide = null;

socket.on("sideAssigned", (side) => {
  mySide = side;
  //console.log("Soy el jugador:", side);
  if (side === "right") {
    socket.on("updateGame", (data) => {
      // pelota
      ball.x = data.ball.x;
      ball.y = data.ball.y;
      ball.dx = data.ball.dx;
      ball.dy = data.ball.dy;

      // marcador
      scoreLeft.value = data.scoreLeft;
      scoreRight.value = data.scoreRight;
    });
  }
});

socket.on("paddleUpdate", (data) => {
  if (data.side === "left") {
    paddleLeft.y = data.y; // el rival es el izquierdo
  } else if (data.side === "right") {
    paddleRight.y = data.y; // el rival es el derecho
  }
});

socket.on("rivalNickname", (rival) => {
  nicknameRival.value = rival;
  //muevo la pelota cuando se une el otro jugador
  if (mySide === "left") {
    ball.dx = -5; // Solo el jugador izquierdo inicia la pelota
  }
});
