import { FC, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import style from "./App.module.scss";

import Lobby from "./pages/Lobby";
import Room from "./pages/Room";
import { useSocket } from "./lib/hooks";

const App: FC = () => {
  const [roomList, setRoomlist] = useState<any>([]);

  const socket: WebSocket | null = useSocket();

  const send = (nickname: string) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "create_room", nickname, piece_type: "white" }));
    }
  };

  const join = (nickname: string, id: number) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "join_room", nickname, id }));
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
          window.location.pathname = "/room/";
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
      <Route path="/" element={<Lobby send={send} join={join} roomList={roomList} />} />
      <Route path="/room" element={<Room />} />
    </Routes>
  );
};

export default App;

