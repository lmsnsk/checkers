import { WebSocket } from "ws";

import * as logic from "../gameLogic/gameLogic";
import { CoordinatesData, Session, GameState } from "../lib/types";

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

export const startGameState = (ws: WebSocket, session: Session) => {
  logic.reverseCoordinates(session.gameState.checkers);
  ws.send(JSON.stringify({ action: "current_session", session }));
  logic.reverseCoordinates(session.gameState.checkers);

  logic.checkPossibleMoves(session.gameState, "white", true);
  session.players.creator.ws.send(JSON.stringify({ action: "current_session", session }));
  logic.resetCanMove(session.gameState.checkers);
};

const firstClickOnChecker = (ws: WebSocket, gameState: GameState, data: CoordinatesData) => {
  if (logic.firstClickRealization(data.coordinates, gameState)) {
    sendGameState(ws, gameState);
  }
};

const secondClickOnChecker = (
  ws: WebSocket,
  session: Session,
  data: CoordinatesData,
  isCreator: boolean
) => {
  const gameState = session.gameState;

  if (logic.move(data.coordinates, gameState)) {
    const oppositeWs = isCreator ? session.players.guest!.ws : session.players.creator.ws;
    const checkerWithAddMove = gameState.checkerAdditionalMove;
    let addMove = false;

    if (checkerWithAddMove) {
      const field = logic.createField(gameState.checkers);
      const color = isCreator ? "white" : "black";

      addMove = checkerWithAddMove.isKing
        ? logic.checkFightKingMove(gameState, field, checkerWithAddMove, color, isCreator)
        : logic.checkFightMove(gameState, field, checkerWithAddMove, color, isCreator);
    }

    if (!addMove) {
      gameState.turn = gameState.turn === "creator" ? "guest" : "creator";
      gameState.showPossibleTurns = false;
      gameState.firstClickDone = false;
      gameState.needToEat = false;
      logic.resetChosen(session.gameState.checkers);
    }
    sendGameState(ws, gameState);
    logic.reverseCoordinates(session.gameState.checkers);

    if (!addMove) {
      logic.checkPossibleMoves(gameState, isCreator ? "black" : "white", !isCreator);
    }
    sendGameState(oppositeWs, gameState);

    if (addMove) {
      logic.reverseCoordinates(session.gameState.checkers);
    }
    logic.checkWinner(gameState);
  }
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
        firstClickOnChecker(ws, gameState, data);
      } else {
        secondClickOnChecker(ws, session, data, isCreator);
      }
      if (gameState.winner) endGame(session);
    }
  });
};
