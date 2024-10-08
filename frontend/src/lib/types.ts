export enum FigureKind {
  EMPTY,
  WHITE,
  BLACK,
  WHITE_KING,
  BLACK_KING,
  POSSIBLE_TURN,
}

export type RoomI = {
  roomId: number;
  roomName: string;
  created: string;
  playersInRoom: { nickname: string; userId: number; pieceType: string }[];
};

export type Checker = {
  id: number;
  x: number;
  y: number;
  color: "white" | "black";
  isChosen: boolean;
  isKing: boolean;
  canMove: boolean;
};

export type PossibleTurns = {
  x: number;
  y: number;
  checkerId: number;
  color: "white" | "black";
  isKing: boolean;
};

export interface GameState {
  turn: "creator" | "guest";
  checkers: Checker[];
  possibleTurns: PossibleTurns[];
  showPossibleTurns: boolean;
}

export type Session = {
  roomId: number;
  created: string;
  gameState: GameState;
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
  gameState?: GameState;
  session?: Session;
  rooms?: RoomI[];
  winner?: "creator" | "guest";
  chat?: { nickname: string; date: string; text: string }[];
};
