import { WebSocket } from "ws";

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
  players: {
    creator: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
    guest?: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
  };
  chat: { nickname: string; date: string; text: string }[];
}
