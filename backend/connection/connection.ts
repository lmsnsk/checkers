import { WebSocket, WebSocketServer } from "ws";

import { messages } from "./chat";
import { coordinates, resetGame } from "./game";
import { checkUser, closeConnection } from "./users";
import { createRoom, deleteRoom, joinRoom } from "./rooms";
import { rooms, sessions, users } from "../database/database";

export const wssConnection = () => {
  const wss = new WebSocketServer({ port: 8888, path: "/ws/checkers" });

  wss.on("connection", (ws: WebSocket) => {
    ws.on("message", (message) => {
      const data = JSON.parse(message.toString());

      console.log(data);

      switch (data.action) {
        case "check_userId":
          checkUser(ws, data.userId, sessions);
          break;
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
        case "delete_room":
          deleteRoom(sessions, users, rooms, data);
          break;
        case "reset_game":
          resetGame(data, sessions);
          break;
      }
    });

    ws.on("close", () => {
      closeConnection(ws);
    });
  });
};
