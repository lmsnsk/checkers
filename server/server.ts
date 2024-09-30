const express = require("express");

import { WebSocket, WebSocketServer } from "ws";

const app = express();

const connection = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

const PORT = process.env.PORT ?? 3001;

interface Room {
  id: number;
  name: string;
  created: string;
  players: { name: string; pieceType: string }[];
}

interface Session {
  id: number;
  created: string;
  players: {
    creator: { connect: WebSocket; nickname: string };
    guest?: { connect: WebSocket; nickname: string };
  };
  chat: { nickname: string; date: string; text: string }[];
}

const rooms: Room[] = [];
const sessions: Session[] = [];
const users: WebSocket[] = [];

const dateToString = () => {
  return new Date().toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sendAllUsersRoomList = () => {
  users.forEach((user) => {
    user.send(JSON.stringify({ action: "create_room", rooms: rooms }));
  });
};

const createRoom = (nickname: string, ws: WebSocket) => {
  const room = {
    id: rooms.length + 1,
    name: nickname,
    created: dateToString(),
    players: [{ name: nickname, pieceType: "white" }],
  };
  rooms.push(room);

  sessions.push({
    id: sessions.length + 1,
    created: dateToString(),
    players: { creator: { connect: ws, nickname } },
    chat: [],
  });
};

const joinRoom = (nickname: string, id: number, ws: WebSocket) => {
  if (rooms[id - 1].players.length === 1) {
    rooms[id - 1].players.push({ name: nickname, pieceType: "black" });

    sessions.forEach((session) => {
      if (session.id === id) {
        session.players.guest = { connect: ws, nickname };
      }
    });
    return true;
  }
  return false;
};

connection.on("connection", (ws: WebSocket) => {
  console.log("Client connected");
  users.push(ws);
  ws.send(JSON.stringify({ action: "create_room", rooms: rooms }));

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());
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
      case "chat_message":
        sessions.forEach((session) => {
          const creator = session.players.creator;
          const guest = session.players.guest;

          if (data.nickname === creator.nickname || data.nickname === guest?.nickname) {
            session.chat.push({ nickname: data.nickname, date: dateToString(), text: data.text });
            creator.connect.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
            guest?.connect?.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
          }
        });
        break;
    }
  });

  ws.on("close", () => {
    sendAllUsersRoomList();
    console.log("Client disconnected");
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT);
});
