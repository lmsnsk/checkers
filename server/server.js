import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const connection = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

const PORT = process.env.PORT ?? 3001;

const rooms = [];

// { id: 1, name: "Room 1", players: 2 }

const createRoom = (nickname) => {
  const room = {
    id: rooms.length + 1,
    name: nickname,
    created: Date.now(),
    players: [{ name: nickname, pieceType: "white" }],
  };
  rooms.push(room);
};

const joinRoom = (nickName, id) => {
  if (rooms[id - 1].players.length === 1) {
    rooms[id - 1].players.push({ name: nickName, pieceType: "black" });
    return true;
  }
  return false;
};

connection.on("connection", (ws) => {
  console.log("Client connected");
  ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    switch (data.action) {
      case "create_room":
        createRoom(data.nickname);
        ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));
        break;
      case "join_room":
        if (joinRoom(data.nickname, data.id)) {
          ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));
        }
        break;
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT);
});
