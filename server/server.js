import express from "express";
import { WebSocketServer } from "ws";

const app = express();

const connection = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

const PORT = process.env.PORT ?? 3001;

const rooms = [];
const sessions = [];
const users = [];

// { id: 1, name: "Room 1", players: 2 }

const sendAllUsersRoomList = () => {
  users.forEach((user) => {
    user.send(JSON.stringify({ action: "create_room", rooms: rooms }));
  });
};

const createRoom = (nickname, ws) => {
  const room = {
    id: rooms.length + 1,
    name: nickname,
    created: Date.now(),
    players: [{ name: nickname, pieceType: "white" }],
  };
  rooms.push(room);

  sessions.push({
    id: sessions.length + 1,
    roomName: nickname,
    players: { creator: { connect: ws, nickname } },
  });
};

const joinRoom = (nickname, id, ws) => {
  if (rooms[id - 1].players.length === 1) {
    rooms[id - 1].players.push({ name: nickname, pieceType: "black" });

    sessions.forEach((session) => {
      if (session.id === id) {
        session.players.guest = { connect: ws, nickname };
      }
    });
    console.log(sessions);
    return true;
  }
  return false;
};

connection.on("connection", (ws) => {
  console.log("Client connected");
  users.push(ws);
  ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));

  ws.on("message", (message) => {
    const data = JSON.parse(message);
    switch (data.action) {
      case "create_room":
        createRoom(data.nickname, ws);
        sendAllUsersRoomList();
        ws.send(
          JSON.stringify({
            action: "to_room",
            nickname: data.nickname,
            id: data.id,
          })
        );
        break;
      case "join_room":
        if (joinRoom(data.nickname, data.id, ws)) {
          sendAllUsersRoomList();
          ws.send(
            JSON.stringify({
              action: "to_room",
              nickname: data.nickname,
              id: data.id,
            })
          );
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
