import { FC, useEffect, useState } from "react";

import Room from "./pages/Room";
import Lobby from "./pages/Lobby";
import ServerError from "./components/ServerError";
import { useSocket, useSound } from "./lib/hooks";
import { Data, RoomI } from "./lib/types";
import { useCheckerStore } from "./store/store";

const App: FC = () => {
  const { nickname, userId, creator, inGame, roomId, socket, setRoomId } = useCheckerStore();
  const { setUserId, setInGame, setRoomCreator, setRoomGuest, setWinner } = useCheckerStore();
  const { setGameState, setRoomList, setRoomChat, setNickname, setCreator } = useCheckerStore();

  const [noServerConnection, setNoServerConnection] = useState(true);

  const playSound = useSound("/checker.mp3");

  useSocket(setNoServerConnection);

  const roomListSetter = (data: Data) => {
    if (data.rooms) {
      setRoomList(
        data.rooms!.map((room: RoomI) => ({
          roomId: room.roomId,
          roomName: room.roomName,
          playersInRoom: room.playersInRoom.length,
        }))
      );
    }
  };

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

  if (socket) {
    socket.onmessage = (e) => {
      const data: Data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case "room_list":
          roomListSetter(data);
          break;

        case "create_user":
          setUserId(data.userId);
          break;

        case "to_room":
          if (data.nickname) {
            setNickname(data.nickname);
            setRoomId(data.roomId);
          }
          setInGame(true);
          break;

        case "current_session":
          if (data.session) {
            setWinner(undefined);
            setRoomCreator(data.session.players.creator.nickname);
            setRoomGuest(data.session.players.guest?.nickname ?? "");
            setGameState(data.session.gameState);
          }
          break;

        case "chat_message":
          if (data.chat) setRoomChat(data.chat);
          break;

        case "game_state":
          if (data.gameState) {
            setGameState(data.gameState);
            if (data.move) playSound();
          }
          break;

        case "end_game":
          if (data.winner) setWinner(data.winner);
          break;

        case "delete_room":
          if (data.roomId === roomId) setInGame(false);
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
        setNoServerConnection(true);
        setTimeout(() => window.location.reload(), 3000);
      };
    }
    return () => socket?.close();
  }, [socket]);

  return (
    <>
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
