import { WebSocket, WebSocketServer } from "ws";

import { messages } from "./chat";
import { coordinates } from "./game";
import { createRoom, joinRoom } from "./rooms";
import { userIdGenerator } from "../lib/helpers";
import { rooms, sessions, users } from "../database/database";

const onConnection = (ws: WebSocket) => {
  const currentUserId = userIdGenerator();
  console.log(`Client id: ${currentUserId} connected`);
  users.set(currentUserId, { ws, inGame: false });
  ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));
  ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
};

const closeConnection = (ws: WebSocket) => {
  // sendAllUsersRoomList(users, rooms);
  users.forEach((user, key) => {
    if (user.ws === ws) {
      users.delete(key);
      console.log(`Client id: ${key} disconnected`);
    }
  });
};

export const wssConnection = () => {
  const wss = new WebSocketServer({ port: 8080, path: "/ws/checkers" });

  wss.on("connection", (ws: WebSocket) => {
    onConnection(ws);

    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      console.log(data);

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
        case "coordinates":
          coordinates(ws, sessions, data);
          break;
      }
    });

    ws.on("close", () => {
      closeConnection(ws);
    });
  });
};
