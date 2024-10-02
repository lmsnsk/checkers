import { WebSocket, WebSocketServer } from "ws";

import { messages } from "./chat";
import { userIdGenerator } from "../lib/helpers";
import { Room, Session, User } from "../lib/types";
import { createRoom, joinRoom, sendAllUsersRoomList } from "./rooms";

const rooms: Room[] = [];
const sessions: Session[] = [];
const users = new Map<number, User>();

const onConnection = (ws: WebSocket) => {
  // console.log("Client connected");
  const currentUserId = userIdGenerator();
  users.set(currentUserId, { ws, inGame: false });
  ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));

  ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
};

const closeConnection = (ws: WebSocket) => {
  sendAllUsersRoomList(users, rooms);
  users.forEach((user, key) => {
    if (user.ws === ws) {
      users.delete(key);
    }
  });
  // console.log("Client disconnected");
};

export const wssConnection = () => {
  const wss = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

  wss.on("connection", (ws: WebSocket) => {
    onConnection(ws);

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      switch (data.action) {
        case "create_room":
          createRoom(ws, data, users, rooms, sessions);
          break;
        case "join_room":
          joinRoom(ws, data, users, rooms, sessions);
          break;
        case "chat_message":
          messages(data, sessions);
          break;
      }
    });

    ws.on("close", () => {
      closeConnection(ws);
    });
  });
};
