import { WebSocket } from "ws";

export enum ClickState {
  START,
  FIRSTCLICK,
  END,
}

/*
0 - пустая
1 - белая
2 - черная
3 - белая королева
4 - черная королева
*/

export enum FigureKind {
  EMPTY,
  WHITE,
  BLACK,
  WHITE_KING,
  BLACK_KING,
  POSSIBLE_TURN,
}

export interface Room {
  roomId: number;
  roomName: string;
  created: string;
  playersInRoom: { nickname: string; userId: number; pieceType: string }[];
}

export interface User {
  ws: WebSocket;
  inGame: boolean;
  nickname?: string;
}

export interface Session {
  roomId: number;
  created: string;
  gameState: {
    turn: "creator" | "guest";
    firstClickCoords?: Coord;
    field: FigureKind[][];
  };
  players: {
    creator: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
    guest?: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
  };
  chat: { nickname: string; date: string; text: string }[];
}

export interface CreateRoomData {
  action: "create_room";
  userId: number;
  nickname: string;
}

export interface JoinRoomData {
  action: "join_room";
  userId: number;
  roomId: number;
  nickname: string;
}

export interface ChatMessageData {
  action: "chat_message";
  text: string;
  nickname: string;
}

export type Coord = { x: number; y: number };

export interface CoordinatesData {
  action: "coordinates";
  coordinates: Coord;
  userId: number;
  creator: boolean;
}
