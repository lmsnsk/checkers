import { FC, useEffect, useState } from "react";

import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { useSocket } from "./lib/hooks";

interface RoomListItem {
  roomId: number;
  roomName: string;
  playersInRoom: number;
}

export interface RoomChat {
  text: string;
  nickname: string;
  date: string;
}

const App: FC = () => {
  const [roomList, setRoomlist] = useState<RoomListItem[]>([]);
  const [roomChat, setRoomChat] = useState<RoomChat[]>([]);
  const [nickname, setNickname] = useState("");
  const [userId, setUserId] = useState<number | undefined>();
  const [creator, setCreator] = useState(false);
  const [inGame, setInGame] = useState(false);
  const [roomCreator, setRoomCreator] = useState("");
  const [roomGuest, setRoomGuest] = useState("");
  const [field, setField] = useState<number[][]>(Array(8).fill(Array(8).fill(0)));

  const socket: WebSocket | null = useSocket();

  const createRoom = (nickname: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "create_room", nickname, userId, piece_type: "white" }));
    }
  };

  const joinRoom = (nickname: string, roomId: number) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "join_room", nickname, userId, roomId }));
    }
  };

  const sendChatMessage = (text: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "chat_message", text, nickname }));
    }
  };

  const updateField = (field: number[][]) => {
    setField(field);
  };

  const sendCoordinates = (x: number, y: number, userId: number | undefined) => {
    if (socket) {
      socket.send(
        JSON.stringify({ action: "coordinates", coordinates: { x, y }, userId, creator })
      );
    }
  };

  if (socket) {
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case "room_list":
          setRoomlist(
            data.rooms.map((room: any) => ({
              roomId: room.roomId,
              roomName: room.roomName,
              playersInRoom: room.playersInRoom.length,
            }))
          );
          break;
        case "create_user":
          setUserId(data.userId);
          break;
        case "to_room":
          setNickname(data.nickname);
          setInGame(true);
          break;
        case "current_session":
          setRoomCreator(data.session.players.creator.nickname);
          setRoomGuest(data.session.players.guest?.nickname ?? "");
          break;
        case "chat_message":
          setRoomChat(data.chat);
          break;
        case "game_state":
          updateField(data.gameState);
          break;
        case "check_game": // reconnect
          if (data.inGame) setInGame(true);
          break;
      }
    };
  }

  useEffect(() => {
    if (socket) {
      socket.onclose = () => {
        console.log("Подключение прервано");
      };
    }

    return () => socket?.close();
  }, [socket]);

  return (
    <>
      {inGame ? (
        <Room
          nickname={nickname}
          roomChat={roomChat}
          sendChatMessage={sendChatMessage}
          roomCreator={roomCreator}
          roomGuest={roomGuest}
          field={field}
          sendCoordinates={sendCoordinates}
          userId={userId}
        />
      ) : (
        <Lobby
          createRoom={createRoom}
          joinRoom={joinRoom}
          roomList={roomList}
          setCreator={setCreator}
        />
      )}
    </>
  );
};

export default App;
