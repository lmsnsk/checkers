import { FC, useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// import style from "./App.module.scss";

import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { useSocket } from "./lib/hooks";

export interface RoomChat {
  text: string;
  nickname: string;
  date: string;
}

const App: FC = () => {
  const [roomList, setRoomlist] = useState<any>([]);
  const [roomChat, setRoomChat] = useState<RoomChat[]>([]);
  const [nickname, setNickname] = useState("");

  const navigate = useNavigate();

  const socket: WebSocket | null = useSocket();

  const createRoom = (nickname: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "create_room", nickname, piece_type: "white" }));
    }
  };

  const joinRoom = (nickname: string, id: number) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "join_room", nickname, id }));
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
        case "create_room":
          setRoomlist(
            data.rooms.map((room: any) => ({
              id: room.id,
              name: room.name,
              players: room.players.length,
            }))
          );
          break;
        case "to_room":
          setNickname(data.nickname);
          navigate("/room");
          break;
        case "chat_message":
          setRoomChat(data.chat);
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
    <Routes>
      <Route
        path="/"
        element={<Lobby createRoom={createRoom} joinRoom={joinRoom} roomList={roomList} />}
      />
      <Route
        path="/room"
        element={<Room nickname={nickname} roomChat={roomChat} sendChatMessage={sendChatMessage} />}
      />
    </Routes>
  );
};

export default App;

