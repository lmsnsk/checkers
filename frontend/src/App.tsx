import { FC, useEffect, useState } from "react";

import Lobby from "./pages/Lobby";
import { useSocket } from "./lib/hooks";
import { Data, RoomI } from "./lib/types";
import Room from "./pages/Room";

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
  const [nickname, setNickname] = useState<string>("");
  const [userId, setUserId] = useState<number | undefined>();
  const [creator, setCreator] = useState<boolean>(false);
  const [inGame, setInGame] = useState<boolean>(false);
  const [roomCreator, setRoomCreator] = useState<string>("");
  const [roomGuest, setRoomGuest] = useState<string>("");
  const [field, setField] = useState<number[][]>(Array(8).fill(Array(8).fill(0)));

  const socket: WebSocket | null = useSocket();

  const createRoom = (nickname: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "create_room", nickname, userId }));
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
      const data: Data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case "room_list":
          if (data.rooms) {
            setRoomlist(
              data.rooms!.map((room: RoomI) => ({
                roomId: room.roomId,
                roomName: room.roomName,
                playersInRoom: room.playersInRoom.length,
              }))
            );
          }
          break;
        case "create_user":
          setUserId(data.userId);
          break;
        case "to_room":
          if (data.nickname) setNickname(data.nickname);
          setInGame(true);
          break;
        case "current_session":
          if (data.session) {
            setRoomCreator(data.session.players.creator.nickname);
            setRoomGuest(data.session.players.guest?.nickname ?? "");
            setField(data.session.gameState.field);
          }
          break;
        case "chat_message":
          if (data.chat) setRoomChat(data.chat);
          break;
        case "game_state":
          if (data.gameState) updateField(data.gameState.field);
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
          creator={creator}
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
