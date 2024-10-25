import { FC, useEffect, useState } from "react";

import Room from "./pages/Room";
import Lobby from "./pages/Lobby";
import ServerError from "./components/ServerError";
import { useCheckerStore } from "./store/store";
import { useSocket } from "./lib/hooks";
import Connection from "./components/Connection";

const App: FC = () => {
  const { nickname, userId, creator, inGame, roomId, socket } = useCheckerStore();
  const { setInGame, setRoomCreator, setRoomGuest, setWinner } = useCheckerStore();
  const { setGameState, setRoomChat, setNickname, setCreator } = useCheckerStore();

  const [noServerConnection, setNoServerConnection] = useState(true);

  useSocket(setNoServerConnection);

  const createRoom = (nickname: string) => {
    socket?.send(JSON.stringify({ action: "create_room", nickname, userId }));
  };

  const joinRoom = (nickname: string, roomId: number) => {
    socket?.send(JSON.stringify({ action: "join_room", nickname, userId, roomId }));
  };

  const sendChatMessage = (text: string) => {
    socket?.send(JSON.stringify({ action: "chat_message", text, nickname }));
  };

  const sendCoordinates = (x: number, y: number, userId: number | undefined) => {
    socket?.send(JSON.stringify({ action: "coordinates", coordinates: { x, y }, userId, creator }));
  };

  const leaveGame = () => {
    if (socket) {
      setWinner(undefined);
      setInGame(false);
      setRoomChat([]);
      setNickname("");
      setCreator(false);
      setRoomCreator("");
      setRoomGuest("");
      setGameState(undefined);
      socket.send(JSON.stringify({ action: "delete_room", roomId }));
    }
  };

  useEffect(() => {
    if (socket) {
      socket.onclose = () => {
        console.log("Подключение прервано");
        setNoServerConnection(true);
        setTimeout(() => window.location.reload(), 3000);
      };
    }
    return () => socket?.close();
  }, [socket]);

  return (
    <>
      <Connection />
      {inGame ? (
        <Room
          sendChatMessage={sendChatMessage}
          sendCoordinates={sendCoordinates}
          leaveGame={leaveGame}
        />
      ) : (
        <Lobby createRoom={createRoom} joinRoom={joinRoom} />
      )}
      {noServerConnection && <ServerError />}
    </>
  );
};

export default App;
