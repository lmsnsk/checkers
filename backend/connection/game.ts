import { WebSocket } from "ws";

import { CoordinatesData, Session, JoinRoomData, GameState, Checker } from "../lib/types";
import {
  checkFightKingMove,
  checkFightMove,
  checkPossibleMoves,
  checkWinner,
  createField,
  firstClickRealization,
  move,
  resetChosen,
} from "../gameLogic/gameLogic";

export const reverseCoordinates = (checkers: Checker[]) => {
  for (const checker of checkers) {
    checker.reverseCoordinates();
  }
};

const sendGameState = (ws: WebSocket, gameState: GameState) => {
  ws.send(JSON.stringify({ action: "game_state", gameState }));
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
    if (!session.players.guest) return;

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
          sendGameState(ws, gameState);
        }
      } else {
        if (move(data.coordinates, gameState)) {
          const oppositeWs = isCreator ? guest.ws : creator.ws;
          const checker = gameState.checkerAdditionalMove;
          let additionalMove = false;

          if (checker) {
            const field = createField(gameState.checkers);
            const color = isCreator ? "white" : "black";

            additionalMove = checker.isKing
              ? checkFightKingMove(gameState, field, checker, color, isCreator)
              : checkFightMove(gameState, field, checker, color, isCreator);
          }

          if (!additionalMove) {
            gameState.turn = gameState.turn === "creator" ? "guest" : "creator";
            gameState.showPossibleTurns = false;
            gameState.firstClickDone = false;
            gameState.needToEat = false;
            resetChosen(session.gameState.checkers);
          }
          sendGameState(ws, gameState);
          reverseCoordinates(session.gameState.checkers);

          if (!additionalMove) {
            checkPossibleMoves(gameState, isCreator ? "black" : "white", !isCreator);
          }
          sendGameState(oppositeWs, gameState);

          if (additionalMove) {
            reverseCoordinates(session.gameState.checkers);
          }
          checkWinner(gameState);
        }
      }

      if (gameState.winner) endGame(session);
    }
  });
};
