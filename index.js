const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const port = process.env.PORT || 4000;

app.use(express.static("public")); // carpeta con el HTML y JS

const rooms = {}; // { roomName: [ { id, nickname }, ... ] }

io.on("connection", (socket) => {
  console.log("Jugador conectado:", socket.id);

  socket.on("paddleMove", (data) => {
    socket.broadcast.emit("paddleUpdate", data); // lo manda a todos menos al que envió
  });

  // envia el jugador no host la poscion de la pelota y marcador
  socket.on("updateGame", (data) => socket.broadcast.emit("updateGame", data));

  socket.on("disconnect", () => {
    console.log("Jugador desconectado:", socket.id);

    const roomName = socket.roomName;

    if (rooms[roomName]) {
      rooms[roomName] = rooms[roomName].filter((p) => p.id !== socket.id);

      // Si la sala queda vacía, la borramos
      if (rooms[roomName].length === 0) {
        delete rooms[roomName];
      }
    }

    // Podés también avisar al jugador restante que el rival se fue
    socket.to(roomName).emit("rivalLeft");
  });

  // Recibir movimiento de paleta
  socket.on("paddleMove", (data) => {
    // Reenviar a todos excepto al que envió
    socket.broadcast.emit("opponentMove", data);
  });

  socket.on("joinRoom", ({ nickname, roomName }) => {
    if (!rooms[roomName]) {
      rooms[roomName] = [];
    }

    const numPlayers = rooms[roomName].length;

    if (numPlayers >= 2) {
      socket.emit("roomFull");
      socket.disconnect();
      return;
    }

    socket.join(roomName);
    socket.nickname = nickname;
    socket.roomName = roomName;

    rooms[roomName].push({ id: socket.id, nickname });
    console.log(rooms);
    console.log(numPlayers);

    const side = numPlayers === 0 ? "left" : "right";
    socket.emit("sideAssigned", side);

    if (rooms[roomName].length === 2) {
      const [player1, player2] = rooms[roomName];
      io.to(player1.id).emit("rivalNickname", player2.nickname);
      io.to(player2.id).emit("rivalNickname", player1.nickname);
    }
  });

  socket.on("chatMessage", (message) => {
    const room = socket.roomName;
    const nickname = socket.nickname;
  
    if (room) {
      io.to(room).emit("chatMessage", {
        nickname,
        message
      });
    }
  });
  
});

server.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
