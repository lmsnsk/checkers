import { WebSocket } from "ws";

import { Session } from "../lib/types";
import { userIdGenerator } from "../lib/helpers";
import { rooms, sessions, users } from "../database/database";
import { checkPossibleMoves } from "../gameLogic/gameLogic";
import { sendAllUsersRoomList } from "./rooms";

const DELAY_RECONNECT_IN_MIN = 10;

const sendGameStateForReconnectUser = (session: Session, ws: WebSocket, isCreator: boolean) => {
  if (
    (session.gameState.turn === "guest" && isCreator) ||
    (session.gameState.turn === "creator" && !isCreator)
  ) {
    const checkers = session.gameState.checkers.map((checker) => ({
      ...checker,
      x: 7 - checker.x,
      y: 7 - checker.y,
      canMove: false,
    }));

    ws.send(
      JSON.stringify({
        action: "current_session",
        session: { ...session, gameState: { ...session.gameState, checkers } },
      })
    );
  } else {
    ws.send(JSON.stringify({ action: "current_session", session }));
  }
  ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
};

export const checkUser = (ws: WebSocket, userId: string, sessions: Session[]) => {
  let isUserExist = false;

  users.forEach((user, key) => {
    if (+userId !== key) return;

    user.ws = ws;

    sessions.forEach((session) => {
      if (session.players.creator.userId === key || session.players.guest?.userId === key) {
        const isCreator = session.players.creator.userId === key;

        if (isCreator) {
          session.players.creator.ws = ws;
        } else {
          if (session.players.guest) session.players.guest.ws = ws;
        }

        clearTimeout(user.timeoutId);

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
        sendGameStateForReconnectUser(session, ws, isCreator);

        console.log(`Client id: ${key} reconnected`);
      }
    });

    if (!user.inGame) {
      ws.send(JSON.stringify({ action: "create_user", userId: key }));
      ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
    }

    isUserExist = true;
  });

  if (!isUserExist) {
    const currentUserId = userIdGenerator();
    console.log(`Client id: ${currentUserId} connected`);
    users.set(currentUserId, { ws, inGame: false, isDisconnected: false });
    ws.send(JSON.stringify({ action: "create_user", userId: currentUserId }));
    ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
  }
};

export const closeConnection = (ws: WebSocket) => {
  users.forEach((user, key) => {
    if (user.ws !== ws) return;

    if (user.inGame) {
      user.isDisconnected = true;

      let sessionIndex: number;

      user.timeoutId = setTimeout(() => {
        sessions.forEach((session, index) => {
          if (session.players.creator.userId === key || session.players.guest?.userId === key) {
            const isCreator = session.players.creator.userId === key;
            sessionIndex = index;

            session.gameState.winner = isCreator ? "guest" : "creator";

            // TODO: ????????????????
            (isCreator ? session.players.guest! : session.players.creator).ws.send(
              JSON.stringify({
                action: "end_game",
                winner: session.gameState.winner,
              })
            );
          }
        });

        sessionIndex !== undefined && sessions.splice(sessionIndex, 1);
        users.delete(key);

        sendAllUsersRoomList(users, rooms);

        console.log(`Client id: ${key} deleted`);
      }, DELAY_RECONNECT_IN_MIN * 60 * 1000);

      console.log(`Client id: ${key} in pending...`);
    } else {
      users.delete(key);
      console.log(`Client id: ${key} disconnected`);
    }
  });
};
