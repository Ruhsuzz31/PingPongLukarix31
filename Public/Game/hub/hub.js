import { HUD_HEIGHT, scoreLeft, scoreRight } from "./state.js";
import { canvas, ctx } from "../canvas/state.js";
import { nickname, nicknameRival } from "../input/state.js";
import { mySide } from "../socket.js";

const hubLimitBar = {
  x: 0,
  y: HUD_HEIGHT - 3,
  width: canvas.width,
  height: 1,
  color: "#777",
};

export function drawHUD() {
  ctx.fillStyle = hubLimitBar.color;
  ctx.fillRect(
    hubLimitBar.x,
    hubLimitBar.y,
    hubLimitBar.width,
    hubLimitBar.height
  );

  // Texto del score
  ctx.fillStyle = "white";
  ctx.font = "24px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    `${scoreLeft.value} : ${scoreRight.value}`,
    canvas.width / 2,
    HUD_HEIGHT - 15
  );

  // Nombres de jugadores
  ctx.textAlign = "left";
  ctx.fillText(
    mySide === "left" ? nickname.value : nicknameRival.value,
    20,
    HUD_HEIGHT - 15
  );

  ctx.textAlign = "right";
  ctx.fillText(
    mySide === "right" ? nickname.value : nicknameRival.value,
    canvas.width - 20,
    HUD_HEIGHT - 15
  );
}
