import { create } from "zustand";

import { GameState, RoomChat, RoomListItem } from "../lib/types";

interface State {
  roomList: RoomListItem[];
  roomChat: RoomChat[];
  nickname: string;
  userId: number | undefined;
  roomId: number | undefined;
  creator: boolean;
  inGame: boolean;
  roomCreator: string;
  roomGuest: string;
  gameState: GameState | undefined;
  winner: "creator" | "guest" | undefined;
  setRoomList: (roomList: RoomListItem[]) => void;
  setRoomChat: (roomChat: RoomChat[]) => void;
  setNickname: (nickname: string) => void;
  setUserId: (userId: number | undefined) => void;
  setRoomId: (roomId: number | undefined) => void;
  setCreator: (creator: boolean) => void;
  setInGame: (inGame: boolean) => void;
  setRoomCreator: (roomCreator: string) => void;
  setRoomGuest: (roomGuest: string) => void;
  setGameState: (gameState: GameState | undefined) => void;
  setWinner: (winner: "creator" | "guest" | undefined) => void;
}

export const useCheckerStore = create<State>()((set) => ({
  roomList: [],
  roomChat: [],
  nickname: "",
  userId: undefined,
  roomId: undefined,
  creator: false,
  inGame: false,
  roomCreator: "",
  roomGuest: "",
  gameState: undefined,
  winner: undefined,
  setRoomList: (roomList: RoomListItem[]) => set({ roomList }),
  setRoomChat: (roomChat: RoomChat[]) => set({ roomChat }),
  setNickname: (nickname: string) => set({ nickname }),
  setUserId: (userId: number | undefined) => set({ userId }),
  setRoomId: (roomId: number | undefined) => set({ roomId }),
  setCreator: (creator: boolean) => set({ creator }),
  setInGame: (inGame: boolean) => set({ inGame }),
  setRoomCreator: (roomCreator: string) => set({ roomCreator }),
  setRoomGuest: (roomGuest: string) => set({ roomGuest }),
  setGameState: (gameState: GameState | undefined) => set({ gameState }),
  setWinner: (winner: "creator" | "guest" | undefined) => set({ winner }),
}));
