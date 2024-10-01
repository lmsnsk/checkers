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
  const [inGame, setInGame] = useState(false);
  const [roomCreator, setRoomCreator] = useState("");
  const [roomGuest, setRoomGuest] = useState("");

  const socket: WebSocket | null = useSocket();

  const createRoom = (nickname: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "create_room", nickname, userId, piece_type: "white" }));
    }
  };

  const joinRoom = (nickname: string, roomId: number) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "join_room", nickname, userId, roomId: roomId }));
    }
  };

  const sendChatMessage = (text: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "chat_message", text, nickname }));
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

          // console.log(data.currentSession.players.creator.nickname);

          break;
        case "chat_message":
          setRoomChat(data.chat);
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
    return () => {
      socket?.close();
      console.log("Подключение окончено");
    };
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
        />
      ) : (
        <Lobby createRoom={createRoom} joinRoom={joinRoom} roomList={roomList} />
      )}
    </>
  );
};

export default App;

