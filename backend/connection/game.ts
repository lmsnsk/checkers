import { WebSocket } from "ws";

import { CoordinatesData, Session, JoinRoomData, GameState, Checker } from "../lib/types";
import { firstClickRealization, move, resetChosen } from "../gameLogic/gameLogic";

export const reverseCoordinates = (checkers: Checker[]) => {
  for (const checker of checkers) {
    checker.reverseCoordinates();
  }
};

const sendGameStateToCurrentPlayer = (ws: WebSocket, gameState: GameState) => {
  ws.send(JSON.stringify({ action: "game_state", gameState }));
};

const sendGameStateToBothPlayer = (session: Session) => {
  session.players.creator.ws.send(
    JSON.stringify({
      action: "game_state",
      gameState: {
        ...session.gameState,
      },
    })
  );
  session.players.guest?.ws.send(
    JSON.stringify({
      action: "game_state",
      gameState: {
        ...session.gameState,
      },
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
  reverseCoordinates(session.gameState.checkers);
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
    const guest = session.players.guest;
    const creator = session.players.creator;
    const isCreator = creator.userId === data.userId;

    if ((isCreator && gameState.turn === "guest") || (!isCreator && gameState.turn === "creator")) {
      return;
    }

    if (data.userId === creator.userId || (guest && data.userId === guest.userId)) {
      if (!gameState.firstClickDone) {
        if (firstClickRealization(data.coordinates, gameState)) {
          sendGameStateToCurrentPlayer(ws, gameState);
        }
      } else {
        if (move(data.coordinates, gameState)) {
          resetChosen(session.gameState.checkers);
          sendGameStateToBothPlayer(session);
        }
      }

      if (gameState.winner) endGame(session);
    }
  });
};
