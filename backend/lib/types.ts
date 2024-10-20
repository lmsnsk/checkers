import { WebSocket } from "ws";

export enum ClickState {
  START,
  FIRSTCLICK,
  END,
}

export enum FigKind {
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

export interface PossibleTurns {
  x: number;
  y: number;
  checkerId: number;
  color: "white" | "black";
  isKing: boolean;
}

export class Checker {
  constructor(
    public id: number,
    public x: number,
    public y: number,
    public color: "white" | "black"
  ) {}

  isChosen = false;
  canMove = false;
  isKing = false;

  move(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  becomeKing() {
    this.isKing = true;
  }

  reverseCoordinates() {
    this.x = 7 - this.x;
    this.y = 7 - this.y;
  }
}

export interface Session {
  roomId: number;
  created: string;
  gameState: {
    kingEatDirection: "lt" | "rt" | "lb" | "rb" | undefined;
    checkerAdditionalMove: Checker | undefined;
    needToEat: boolean;
    firstClickDone: boolean;
    winner: "creator" | "guest" | undefined;
    turn: "creator" | "guest";
    firstClickCoords?: Coord;
    checkers: Checker[];
    possibleTurns: PossibleTurns[];
    possibleTurnsAll: PossibleTurns[];
    enemiesForEat: (Coord & { checkerId: number })[];
    showPossibleTurns: boolean;
    scores: { black: number; white: number };
  };
  players: {
    creator: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
    guest?: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
  };
  chat: { nickname: string; date: string; text: string }[];
}

export type GameState = Session["gameState"];

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

export interface ResetGameData {
  action: "reset_game";
  userId: number;
  roomId: number;
}
