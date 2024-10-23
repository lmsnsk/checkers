import { WebSocket } from "ws";

import { Session } from "../lib/types";
import { userIdGenerator } from "../lib/helpers";
import { rooms, users } from "../database/database";
import { checkPossibleMoves } from "../gameLogic/gameLogic";

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
          sendGameStateForReconnectUser(session, ws, isCreator);
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
