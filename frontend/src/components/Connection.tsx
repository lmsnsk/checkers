import { FC } from "react";

import { useSound } from "../lib/hooks";
import { Data, RoomI } from "../lib/types";
import { setToLocalStorage } from "../lib/utils";
import { useCheckerStore } from "../store/store";

const Connection: FC = () => {
  const { nickname, roomId, socket, unreadMessages } = useCheckerStore();
  const { setUserId, setInGame, setRoomCreator, setRoomGuest } = useCheckerStore();
  const { setGameState, setRoomChat, setNickname, setRoomList } = useCheckerStore();
  const { setRoomId, setUnreadMessages, setWinner, setCreator } = useCheckerStore();

  const playSoundCheckerTurn = useSound("/checker.mp3");
  const playSoundNewMessage = useSound("/incoming.mp3");

  const e = 1;

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

  if (socket) {
    socket.onmessage = (e) => {
      const data: Data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case "room_list":
          roomListSetter(data);
          break;

        case "create_user":
          if (data.userId) {
            setUserId(data.userId);
            setToLocalStorage("userId_checkers_game", data.userId.toString());
          }
          break;

        case "to_room":
          if (data.nickname && data.creator !== undefined) {
            setNickname(data.nickname);
            setRoomId(data.roomId);
            setCreator(data.creator);
            setUserId(data.userId);
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
          if (data.chat) {
            if (data.chat.at(-1)?.nickname !== nickname) playSoundNewMessage();
            setRoomChat(data.chat);
            setUnreadMessages(unreadMessages + 1);
          }
          break;

        case "game_state":
          if (data.gameState) {
            setGameState(data.gameState);
            if (data.move) playSoundCheckerTurn();
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

  return <></>;
};

export default Connection;
