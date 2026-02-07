import { scoreLeft, scoreRight } from "../hub/state.js";
import { ball } from "./state.js";
import { HUD_HEIGHT } from "../hub/state.js";
import { canvas, ctx } from "../canvas/state.js";
import { paddleLeft, paddleRight } from "../paddles/state.js";

const INITIAL_BALL_SPEED = 3.5;

// Mueve la pelota
export function updateBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;

  // Rebote contra los bordes superior, inferior y el HUD
  if (
    ball.y - ball.radius <= HUD_HEIGHT ||
    ball.y - ball.radius <= 0 ||
    ball.y + ball.radius >= canvas.height
  ) {
    ball.dy *= -1; // Invierte la dirección vertical
  }

  // Verificar si la pelota salió por la izquierda (gol para el jugador derecho)
  if (ball.x + ball.radius < 0) {
    scoreRight.value++;
    resetBall("right"); // la pelota sale hacia la derecha
  }

  // Verificar si la pelota salió por la derecha (gol para el jugador izquierdo)
  if (ball.x - ball.radius > canvas.width) {
    scoreLeft.value++;
    resetBall("left"); // la pelota sale hacia la izquierda
  }

  // Verifica colisión con ambas paletas
  handlePaddleCollision(paddleLeft, true);
  handlePaddleCollision(paddleRight, false);
}

// Dibuja la pelota
export function drawBall() {
  ctx.fillStyle = ball.color;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

export function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;

  // Dirección hacia la que sale la pelota
  let angle = ((Math.random() - 0.5) * Math.PI) / 3; // entre -30° y +30°

  // Aplica la velocidad base con ese ángulo
  ball.dx =
    (direction === "left" ? -1 : 1) * Math.cos(angle) * INITIAL_BALL_SPEED;
  ball.dy = Math.sin(angle) * INITIAL_BALL_SPEED;
}

// Función para manejar colisión con las paletas
export function handlePaddleCollision(paddle, isLeftPaddle) {
  if (
    ball.y + ball.radius >= paddle.y && // La pelota está dentro del rango vertical
    ball.y - ball.radius <= paddle.y + paddle.height &&
    ((isLeftPaddle && ball.x - ball.radius <= paddle.x + paddle.width) || // Contacto con paleta izquierda
      (!isLeftPaddle && ball.x + ball.radius >= paddle.x)) // Contacto con paleta derecha
  ) {
    // Reposicionar la pelota ligeramente fuera de la paleta para evitar "pegado"
    ball.x = isLeftPaddle
      ? paddle.x + paddle.width + ball.radius
      : paddle.x - ball.radius;

    // Calcula la zona de impacto (de -1 a 1, donde 0 es el centro de la paleta)
    let relativeImpact =
      (ball.y - (paddle.y + paddle.height / 2)) / (paddle.height / 2);

    // Ajusta el ángulo de rebote en función del impacto
    let angle = relativeImpact * (Math.PI / 3); // Máximo de 60° de inclinación

    // Velocidad actual
    let currentSpeed = Math.sqrt(ball.dx ** 2 + ball.dy ** 2);

    // Incremento de velocidad (pequeño)
    let speedIncrement = ball.speedIncrement;

    // Límite máximo de velocidad
    let maxSpeed = 8;

    // Nueva velocidad limitada
    let newSpeed = Math.min(currentSpeed + speedIncrement, maxSpeed);

    // Aplicar nueva dirección con velocidad limitada
    ball.dx = (isLeftPaddle ? 1 : -1) * Math.cos(angle) * newSpeed;
    ball.dy = Math.sin(angle) * newSpeed;
  }
}
