import { reverseCoordinates, reverseField } from "./../lib/helpers";
import { WebSocket } from "ws";
import { CoordinatesData, Session, User, JoinRoomData } from "../lib/types";

export const sendGameState = (ws: WebSocket, sessions: Session[], data: JoinRoomData) => {
  sessions.forEach((session) => {
    if (session.roomId === data.roomId) {
      ws.send(
        JSON.stringify({ action: "game_state", gameState: { field: session.gameState.field } })
      );
      session.players.creator.ws.send(
        JSON.stringify({
          action: "game_state",
          gameState: { field: reverseField(session.gameState.field) },
        })
      );
    }
  });
};

export const coordinates = (ws: WebSocket, users: Map<number, User>, data: CoordinatesData) => {
  users.forEach((_, key) => {
    if (key === data.userId) {
      console.log(data.creator ? data.coordinates : reverseCoordinates(data.coordinates));
    }
  });
};
