import { reverseCoordinates, reverseField } from "./../lib/helpers";
import { WebSocket } from "ws";
import { Session, User } from "../lib/types";

const gameState: number[][] = [
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
];

export const sendGameState = (ws: WebSocket, sessions: Session[], data: any) => {
  let isSend = false;

  sessions.forEach((session) => {
    if (session.roomId === data.roomId && !isSend) {
      ws.send(JSON.stringify({ action: "game_state", gameState }));
      session.players.creator.ws.send(
        JSON.stringify({ action: "game_state", gameState: reverseField(gameState) })
      );
      isSend = true;
    }
  });
};

export const coordinates = (ws: WebSocket, users: Map<number, User>, data: any) => {
  users.forEach((_, key) => {
    if (key === data.userId) {
      console.log(data.creator ? data.coordinates : reverseCoordinates(data.coordinates));
    }
  });
};
