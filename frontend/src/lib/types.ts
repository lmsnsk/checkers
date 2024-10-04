export type RoomI = {
  roomId: number;
  roomName: string;
  created: string;
  playersInRoom: { nickname: string; userId: number; pieceType: string }[];
};

export type Session = {
  roomId: number;
  created: string;
  gameState: {
    turn: "creator" | "guest";
    field: number[][];
  };
  players: {
    creator: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
    guest?: { ws: WebSocket; userId: number; nickname: string; pieceType: string };
  };
  chat: { nickname: string; date: string; text: string }[];
};

export type Data = {
  action: string;
  userId?: number;
  nickname?: string;
  roomId?: number;
  text?: string;
  coordinates?: { x: number; y: number };
  creator?: boolean;
  inGame?: boolean;
  pieceType?: string;
  gameState?: { field: number[][] };
  session?: Session;
  rooms?: RoomI[];
  chat?: { nickname: string; date: string; text: string }[];
};
