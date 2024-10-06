import { WebSocket } from "ws";

import { reverseField } from "./../lib/helpers";
import { CoordinatesData, Session, JoinRoomData } from "../lib/types";
import { firstFieldClick, turn } from "../gameLogic/gameLogic";

export const sendStartGameState = (ws: WebSocket, sessions: Session[], data: JoinRoomData) => {
  sessions.forEach((session) => {
    if (session.roomId === data.roomId) {
      ws.send(
        JSON.stringify({
          action: "game_state",
          gameState: { field: reverseField(session.gameState.field) },
        })
      );
      session.players.creator.ws.send(
        JSON.stringify({
          action: "game_state",
        })
      );
    }
  });
};

const sendGameStateToCurrentPlayer = (
  ws: WebSocket,
  gameState: Session["gameState"],
  isCreator: boolean
) => {
  ws.send(
    JSON.stringify({
      action: "game_state",
      gameState: { field: isCreator ? gameState.field : gameState.field },
    })
  );
};

const sendGameStateToBothPlayer = (session: Session, turn: "creator" | "guest") => {
  const field = session.gameState.field;
  const reversedField = reverseField(session.gameState.field);

  session.players.creator.ws.send(
    JSON.stringify({
      action: "game_state",
      gameState: { field: turn === "creator" ? field : reversedField },
    })
  );
  session.players.guest?.ws.send(
    JSON.stringify({
      action: "game_state",
      gameState: { field: turn === "guest" ? field : reversedField },
    })
  );
};

export const coordinates = (ws: WebSocket, sessions: Session[], data: CoordinatesData) => {
  sessions.forEach((session) => {
    const gameState = session.gameState;
    const creator = session.players.creator;
    const guest = session.players.guest;
    const isCreator = creator.userId === data.userId;

    if ((isCreator && gameState.turn === "guest") || (!isCreator && gameState.turn === "creator")) {
      return;
    }

    if (data.userId === creator.userId || (guest && data.userId === guest.userId)) {
      console.log(gameState.firstClickCoords);

      if (turn(gameState, data.coordinates, isCreator)) {
        sendGameStateToBothPlayer(session, gameState.turn);
        gameState.turn = isCreator ? "guest" : "creator";
        gameState.field = reverseField(gameState.field);
        return;
      }
      if (firstFieldClick(data.coordinates, gameState.field, isCreator)) {
        sendGameStateToCurrentPlayer(ws, gameState, isCreator);
        gameState.firstClickCoords = data.coordinates;
      }
    }
  });
};
