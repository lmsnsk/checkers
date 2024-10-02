import { WebSocket } from "ws";
import { Room, Session, User } from "../lib/types";
import { dateToString } from "../lib/helpers";

export const sendAllUsersRoomList = (users: Map<number, User>, rooms: Room[]) => {
  users.forEach((user) => {
    user.ws.send(JSON.stringify({ action: "room_list", rooms: rooms }));
  });
};

export const createRoom = (
  ws: WebSocket,
  data: any,
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
      roomId: data.roomId,
    })
  );
};

export const joinRoom = (
  ws: WebSocket,
  data: any,
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
      ws.send(JSON.stringify({ action: "current_session", session }));
      session.players.creator.ws.send(JSON.stringify({ action: "current_session", session }));
    }
  });

  sendAllUsersRoomList(users, rooms);

  ws.send(
    JSON.stringify({
      action: "to_room",
      nickname: data.nickname,
      roomId: data.roomId,
    })
  );
};
