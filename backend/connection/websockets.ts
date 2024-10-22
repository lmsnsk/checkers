import { WebSocket, WebSocketServer } from "ws";

import { messages } from "./chat";
import { coordinates, resetGame } from "./game";
import { createRoom, deleteRoom, joinRoom } from "./rooms";
import { userIdGenerator } from "../lib/helpers";
import { Session } from "../lib/types";
import { rooms, sessions, users } from "../database/database";
import { checkPossibleMoves, reverseCoordinates } from "../gameLogic/gameLogic";

const checkUser = (ws: WebSocket, userId: string, sessions: Session[]) => {
  let isUserExist = false;

  users.forEach((user, key) => {
    if (+userId === key) {
      user.ws = ws;

      let userInGame = false;

      sessions.forEach((session) => {
        // console.log(`Client id: ${key} reconnected`);
        if (session.players.creator.userId === key || session.players.guest?.userId === key) {
          const isCreator = session.players.creator.userId === key;
          userInGame = true;

          if (isCreator) {
            session.players.creator.ws = ws;
          } else {
            if (session.players.guest) session.players.guest.ws = ws;
          }

          ws.send(
            JSON.stringify({
              action: "to_room",
              nickname: user.nickname,
              roomId: session.roomId,
              userId: key,
              creator: isCreator,
            })
          );

          checkPossibleMoves(session.gameState, isCreator ? "white" : "black", isCreator);

          if (!isCreator && session.gameState.turn === "creator") {
            reverseCoordinates(session.gameState.checkers);
            ws.send(JSON.stringify({ action: "current_session", session }));
            reverseCoordinates(session.gameState.checkers);
          } else {
            ws.send(JSON.stringify({ action: "current_session", session }));
          }
          ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
        }
      });

      if (!userInGame) {
        ws.send(JSON.stringify({ action: "create_user", userId: key }));
        ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
      }

      isUserExist = true;
    }
  });

  if (!isUserExist) {
    const currentUserId = userIdGenerator();
    // console.log(`Client id: ${currentUserId} connected`);
    users.set(currentUserId, { ws, inGame: false });
    ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));
    ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
  }
};

const closeConnection = (ws: WebSocket) => {
  users.forEach((user, key) => {
    if (user.ws === ws) {
      // users.delete(key);
      // console.log(`Client id: ${key} disconnected`);
    }
  });
};

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
