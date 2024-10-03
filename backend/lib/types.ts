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
  gameState: {
    field: number[][];
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

export interface CoordinatesData {
  action: "coordinates";
  coordinates: { x: number; y: number };
  userId: number;
  creator: boolean;
}
