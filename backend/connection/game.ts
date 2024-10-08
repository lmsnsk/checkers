import { WebSocket } from "ws";

import { CoordinatesData, Session, JoinRoomData, GameState, Checker } from "../lib/types";

export const reverseCoordinates = (checkers: Checker[]) => {
  for (const checker of checkers) {
    checker.reverseCoordinates();
  }
};

// const sendGameStateToCurrentPlayer = (ws: WebSocket, gameState: GameState) => {
//   ws.send(
//     JSON.stringify({
//       action: "game_state",
//       gameState: { field: gameState.field, turn: gameState.turn },
//     })
//   );
// };

// const sendGameStateToBothPlayer = (session: Session, turn: "creator" | "guest") => {
//   const field = session.gameState.field;
//   const reversedField = reverseField(session.gameState.field);

//   session.players.creator.ws.send(
//     JSON.stringify({
//       action: "game_state",
//       gameState: {
//         field: turn === "creator" ? field : reversedField,
//         turn: turn === "creator" ? "guest" : "creator",
//       },
//     })
//   );
//   session.players.guest?.ws.send(
//     JSON.stringify({
//       action: "game_state",
//       gameState: {
//         field: turn === "guest" ? field : reversedField,
//         turn: turn === "creator" ? "guest" : "creator",
//       },
//     })
//   );
// };

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
      if (gameState.winner) endGame(session);
    }
  });

  // sessions.forEach((session) => {
  //   const gameState = session.gameState;
  //   const creator = session.players.creator;
  //   const guest = session.players.guest;
  //   const isCreator = creator.userId === data.userId;
  //   if ((isCreator && gameState.turn === "guest") || (!isCreator && gameState.turn === "creator")) {
  //     return;
  //   }
  //   if (data.userId === creator.userId || (guest && data.userId === guest.userId)) {
  //     if (turn(data.coordinates, gameState, isCreator)) {
  //       sendGameStateToBothPlayer(session, gameState.turn);
  //       gameState.turn = isCreator ? "guest" : "creator";
  //       gameState.field = reverseField(gameState.field);
  //       return;
  //     }
  //     if (fieldClick(data.coordinates, gameState, isCreator)) {
  //       sendGameStateToCurrentPlayer(ws, gameState);
  //       gameState.firstClickCoords = data.coordinates;
  //     }
  //     if (gameState.winner) endGame(session);
  //   }
  // });
};
