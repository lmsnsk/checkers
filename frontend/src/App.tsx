import { FC, useEffect, useState } from "react";

import Lobby from "./pages/Lobby";
import { useSocket } from "./lib/hooks";
import { Checker, Data, GameState, PossibleTurns, RoomI } from "./lib/types";
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
  // const [checkers, setCheckers] = useState<Checker[]>([]);
  const [gameState, setGameState] = useState<GameState>();
  // const [turn, setTurn] = useState<"creator" | "guest" | undefined>();

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

  // const updateGameState = (checkers: Checker[]) => {
  //   setCheckers(checkers);
  // };

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
            setGameState(data.session.gameState);
          }
          break;
        case "chat_message":
          if (data.chat) setRoomChat(data.chat);
          break;
        case "game_state":
          if (data.gameState) {
            // updateGameState(data.gameState);
            setGameState(data.gameState);
          }
          break;
        case "end_game":
          if (data.winner === "creator" && creator) {
            /////////////
          } else {
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
          sendCoordinates={sendCoordinates}
          userId={userId}
          creator={creator}
          gameState={gameState}
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
