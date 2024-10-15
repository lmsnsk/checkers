import { FC, Fragment, useState } from "react";
import RoomsListItem from "./RoomsListItem";
import LowerButtons from "./LowerButtons";

import { useCheckerStore } from "../store/store";

import style from "./RoomList.module.scss";

export interface IListItem {
  roomId: number;
  roomName: string;
  playersInRoom: number;
}

interface RoomsListProps {
  createRoom: (nickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
}

const RoomsList: FC<RoomsListProps> = ({ joinRoom, createRoom }) => {
  const [chosenRoom, setChosenRoom] = useState(0);
  const roomList = useCheckerStore((state) => state.roomList);

  return (
    <>
      <div className={style.main}>
        <RoomsListItem isTitle={true} firstCol="Комната" secondCol="Игроки" />
        <div className={style.itemList}>
          {roomList.map((room) => (
            <Fragment key={room.roomId}>
              <RoomsListItem
                isTitle={false}
                id={room.roomId}
                firstCol={room.roomName}
                secondCol={`${room.playersInRoom.toString()} / 2`}
                isChosen={chosenRoom === room.roomId ? true : false}
                setChosenRoom={setChosenRoom}
              />
            </Fragment>
          ))}
        </div>
      </div>
      <LowerButtons chosenRoom={chosenRoom} createRoom={createRoom} joinRoom={joinRoom} />
    </>
  );
};

export default RoomsList;
