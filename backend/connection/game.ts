import { WebSocket } from "ws";

import { reverseField } from "./../lib/helpers";
import { CoordinatesData, Session, User, JoinRoomData, ClickState, FigureKind } from "../lib/types";
import { firstFieldClick } from "../gameLogic/gameLogic";

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
          gameState: { field: session.gameState.field },
        })
      );
    }
  });
};

const sendGameState = (ws: WebSocket, gameState: Session["gameState"]) => {
  ws.send(JSON.stringify({ action: "game_state", gameState: { field: gameState.field } }));
};

export const coordinates = (ws: WebSocket, sessions: Session[], data: CoordinatesData) => {
  sessions.forEach((session) => {
    const gameState = session.gameState;
    const creator = session.players.creator;

    if (creator.userId === data.userId && gameState.turn === "creator") {
      if (gameState.creatorClickState === ClickState.START) {
        if (firstFieldClick(data.coordinates, gameState.field, true)) {
          sendGameState(ws, gameState);
          gameState.creatorClickState = ClickState.FIRSTCLICK;
        }
      } else if (gameState.creatorClickState === ClickState.FIRSTCLICK) {
      }
    }
  });
};
