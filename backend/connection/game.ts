import { WebSocket } from "ws";

import { reverseField } from "./../lib/helpers";
import { CoordinatesData, Session, JoinRoomData, GameState } from "../lib/types";
import { fieldClick, turn } from "../gameLogic/gameLogic";

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

const sendGameStateToCurrentPlayer = (ws: WebSocket, gameState: GameState, isCreator: boolean) => {
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

const endGame = (session: Session) => {
  session.players.creator.ws.send(
    JSON.stringify({
      action: "end_game",
      winner: session.gameState.winner,
    })
  );
  session.players.guest?.ws.send(
    JSON.stringify({
      action: "end_game",
      winner: session.gameState.winner,
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
      if (turn(data.coordinates, gameState, isCreator)) {
        sendGameStateToBothPlayer(session, gameState.turn);
        gameState.turn = isCreator ? "guest" : "creator";
        gameState.field = reverseField(gameState.field);
        return;
      }
      if (fieldClick(data.coordinates, gameState, isCreator)) {
        sendGameStateToCurrentPlayer(ws, gameState, isCreator);
        gameState.firstClickCoords = data.coordinates;
      }
      if (gameState.winner) endGame(session);
    }
  });
};
