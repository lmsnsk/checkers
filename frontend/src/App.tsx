import { FC, useEffect } from "react";

import Room from "./pages/Room";
import Lobby from "./pages/Lobby";
import { useSocket } from "./lib/hooks";
import { Data, RoomI } from "./lib/types";
import { useCheckerStore } from "./store/store";

const App: FC = () => {
  const { nickname, userId, creator, inGame, roomId, setRoomId } = useCheckerStore();
  const { setUserId, setInGame, setRoomCreator, setRoomGuest, setWinner } = useCheckerStore();
  const { setGameState, setRoomList, setRoomChat, setNickname, setCreator } = useCheckerStore();

  const socket: WebSocket | null = useSocket();

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

  const sendCoordinates = (x: number, y: number, userId: number | undefined) => {
    if (socket) {
      socket.send(
        JSON.stringify({ action: "coordinates", coordinates: { x, y }, userId, creator })
      );
    }
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
            setRoomCreator(data.session.players.creator.nickname);
            setRoomGuest(data.session.players.guest?.nickname ?? "");
            setGameState(data.session.gameState);
          }
          break;
        case "chat_message":
          if (data.chat) setRoomChat(data.chat);
          break;
        case "game_state":
          if (data.gameState) setGameState(data.gameState);
          break;
        case "end_game":
          if (data.winner) setWinner(data.winner);
          break;
        case "delete_room":
          if (data.roomId === roomId) {
            setInGame(false);
            console.log(inGame, roomId, data.roomId);
          }
          break;
        case "check_game": // reconnect
          if (data.inGame) setInGame(true);
          break;
      }
    };
  }

  useEffect(() => {
    if (socket) {
      socket.onclose = () => console.log("Подключение прервано");
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
    </>
  );
};

export default App;
