import { WebSocket } from "ws";

import { startGameState } from "./game";
import { dateToString, initialField } from "../lib/helpers";
import { Checker, CreateRoomData, JoinRoomData, Room, Session, User } from "../lib/types";

export const sendAllUsersRoomList = (users: Map<number, User>, rooms: Room[]) => {
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
  });
};

const startField = () => {
  const checkers: Checker[] = [];
  let id = 0;

  initialField.forEach((row, indexY) => {
    row.forEach((el, indexX) => {
      if (el === 0) return;
      checkers.push(new Checker(id++, indexX, indexY, el === 1 ? "white" : "black"));
    });
  });

  // for (let k = 0; k < 3; k++) {
  //   for (let i = 0; i < 4; i++) {
  //     checkers.push(new Checker(id++, k === 1 ? i * 2 + 1 : i * 2, k, "black"));
  //     checkers.push(new Checker(id++, k === 1 ? i * 2 : i * 2 + 1, k + 5, "white"));
  //   }
  // }

  return checkers;
};

export const deleteRoom = (
  sessions: Session[],
  users: Map<number, User>,
  rooms: Room[],
  data: { roomId: number }
) => {
  let indexForDeleteSession: number = -1;
  let indexForDeleteRoom: number = -1;

  sessions.forEach((session, index) => {
    if (data.roomId === session.roomId) indexForDeleteSession = index;
    session.players.creator.ws.send(
      JSON.stringify({
        action: "delete_room",
        roomId: data.roomId,
      })
    );
    session.players.guest?.ws.send(
      JSON.stringify({
        action: "delete_room",
        roomId: data.roomId,
      })
    );
  });
  if (indexForDeleteSession >= 0) sessions.splice(indexForDeleteSession, 1);

  rooms.forEach((room, index) => {
    if (data.roomId === room.roomId) indexForDeleteRoom = index;
  });
  if (indexForDeleteRoom >= 0) rooms.splice(indexForDeleteRoom, 1);

  sendAllUsersRoomList(users, rooms);
};

export const createRoom = (
  ws: WebSocket,
  data: CreateRoomData,
  users: Map<number, User>,
  rooms: Room[],
  sessions: Session[]
) => {
  users.set(data.userId, { ws, inGame: true, nickname: data.nickname });

  const roomId = rooms.length + 1;
  const room = {
    roomId: roomId,
    roomName: data.nickname,
    created: dateToString(),
    playersInRoom: [{ nickname: data.nickname, userId: data.userId, pieceType: "white" }],
  };
  rooms.push(room);

  const currentSession: Session = {
    roomId: roomId,
    created: dateToString(),
    gameState: {
      kingEatDirection: undefined,
      enemiesForEat: [],
      needToEat: false,
      firstClickDone: false,
      checkerAdditionalMove: undefined,
      winner: undefined,
      turn: "creator",
      checkers: startField(),
      possibleTurns: [],
      showPossibleTurns: false,
    },
    players: {
      creator: { ws: ws, userId: data.userId, nickname: data.nickname, pieceType: "white" },
    },
    chat: [],
  };
  sessions.push(currentSession);
  ws.send(JSON.stringify({ action: "current_session", session: currentSession }));

  sendAllUsersRoomList(users, rooms);

  ws.send(
    JSON.stringify({
      action: "to_room",
      nickname: data.nickname,
      userId: data.userId,
      roomId,
    })
  );
};

export const joinRoom = (
  ws: WebSocket,
  data: JoinRoomData,
  users: Map<number, User>,
  rooms: Room[],
  sessions: Session[]
) => {
  if (rooms[data.roomId - 1].playersInRoom.length !== 1) return;

  users.set(data.userId, { ws, inGame: true, nickname: data.nickname });

  rooms[data.roomId - 1].playersInRoom.push({
    nickname: data.nickname,
    userId: data.userId,
    pieceType: "black",
  });

  sessions.forEach((session) => {
    if (session.roomId === data.roomId) {
      session.players.guest = {
        ws: ws,
        userId: data.userId,
        nickname: data.nickname,
        pieceType: "black",
      };
      startGameState(ws, session);
    }
  });

  sendAllUsersRoomList(users, rooms);

  ws.send(
    JSON.stringify({
      action: "to_room",
      nickname: data.nickname,
      roomId: data.roomId,
      userId: data.userId,
    })
  );
};
