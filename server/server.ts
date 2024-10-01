const express = require("express");

import { WebSocket, WebSocketServer } from "ws";

const app = express();

const wss = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

const PORT = process.env.PORT ?? 3001;

interface Room {
  roomId: number;
  roomName: string;
  created: string;
  playersInRoom: { nickname: string; userId: number; pieceType: string }[];
}

interface User {
  ws: WebSocket;
  inGame: boolean;
  nickname?: string;
}

interface Session {
  roomId: number;
  created: string;
  players: {
    creator: { ws: WebSocket; userId: number; nickname: string };
    guest?: { ws: WebSocket; userId: number; nickname: string };
  };
  chat: { nickname: string; date: string; text: string }[];
}

const rooms: Room[] = [];
const sessions: Session[] = [];
const users = new Map<number, User>();

let userCounter = 0;

const userIdGenerator = () => {
  return userCounter++;
};

const dateToString = () => {
  return new Date().toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const sendAllUsersRoomList = () => {
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
  });
};

const createRoom = (nickname: string, ws: WebSocket, userId: number) => {
  users.set(userId, { ws, inGame: true, nickname });

  const roomId = rooms.length + 1;
  const room = {
    roomId: roomId,
    roomName: nickname,
    created: dateToString(),
    playersInRoom: [{ nickname: nickname, userId: userId, pieceType: "white" }],
  };
  rooms.push(room);

  const currentSession: Session = {
    roomId: roomId,
    created: dateToString(),
    players: { creator: { ws: ws, userId: userId, nickname } },
    chat: [],
  };
  sessions.push(currentSession);
  ws.send(JSON.stringify({ action: "current_session", session: currentSession }));
};

const joinRoom = (nickname: string, roomId: number, ws: WebSocket, userId: number) => {
  users.set(userId, { ws, inGame: true, nickname });

  if (rooms[roomId - 1].playersInRoom.length === 1) {
    rooms[roomId - 1].playersInRoom.push({
      nickname: nickname,
      userId: userId,
      pieceType: "black",
    });

    sessions.forEach((session) => {
      if (session.roomId === roomId) {
        session.players.guest = { ws: ws, userId: userId, nickname };
        ws.send(JSON.stringify({ action: "current_session", session }));
        session.players.creator.ws.send(JSON.stringify({ action: "current_session", session }));
      }
    });
    return true;
  }
  return false;
};

wss.on("connection", (ws: WebSocket) => {
  // console.log("Client connected");
  const currentUserId = userIdGenerator();
  users.set(currentUserId, { ws, inGame: false });
  ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));

  ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));

  ws.on("message", (message) => {
    const data = JSON.parse(message.toString());

    switch (data.action) {
      case "create_room":
        createRoom(data.nickname, ws, data.userId);
        sendAllUsersRoomList();
        ws.send(
          JSON.stringify({
            action: "to_room",
            nickname: data.nickname,
            roomId: data.roomId,
          })
        );
        break;
      case "join_room":
        if (joinRoom(data.nickname, data.roomId, ws, data.userId)) {
          sendAllUsersRoomList();
          ws.send(
            JSON.stringify({
              action: "to_room",
              nickname: data.nickname,
              roomId: data.roomId,
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
            creator.ws.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
            guest?.ws?.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
          }
        });
        break;
    }
  });

  ws.on("close", () => {
    sendAllUsersRoomList();
    users.forEach((user, key) => {
      if (user.ws === ws) {
        users.delete(key);
      }
    });
    // console.log("Client disconnected");
  });
});

app.listen(PORT, () => {
  console.log("Server started on http://localhost:" + PORT);
});
