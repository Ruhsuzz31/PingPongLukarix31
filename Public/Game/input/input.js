import { nickname, roomName } from "./state.js";
import { socket } from "../socket.js";

// Estados de las teclas
export const keys = {
  ArrowUp: false, // Para mover la paleta derecha arriba
  ArrowDown: false, // Para mover la paleta derecha abajo
  w: false, // Para mover la paleta izquierda arriba
  s: false, // Para mover la paleta izquierda abajo
};

// Detectar cuando se presiona una tecla
document.addEventListener("keydown", (event) => {
  if (event.key in keys) {
    keys[event.key] = true;
  }
});

// Detectar cuando se suelta una tecla
document.addEventListener("keyup", (event) => {
  if (event.key in keys) {
    keys[event.key] = false;
  }
});

// formulario de inicio
document.getElementById("joinBtn").addEventListener("click", () => {
  nickname.value = document.getElementById("nickname").value.trim();
  roomName.value = document.getElementById("roomName").value.trim();

  if (nickname && roomName) {
    socket.emit("joinRoom", {
      nickname: nickname.value,
      roomName: roomName.value,
    });
    document.getElementById("startMenu").style.display = "none"; // ocultar UI inicial
  } else {
    alert("Por favor completá los campos.");
  }
});
