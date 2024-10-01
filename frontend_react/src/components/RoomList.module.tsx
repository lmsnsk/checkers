import { FC, Fragment, useState } from "react";
import RoomsListItem from "./RoomsListItem";
import LowerButtons from "./LowerButtons";

import style from "./RoomList.module.scss";

export interface IListItem {
  roomId: number;
  roomName: string;
  playersInRoom: number;
}

interface RoomsListProps {
  isMobile: boolean;
  createRoom: (nickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
  roomList: IListItem[];
}

const RoomsList: FC<RoomsListProps> = ({ isMobile, roomList, joinRoom, createRoom }) => {
  const [chosenRoom, setChosenRoom] = useState(0);

  return (
    <>
      <div className={style.main}>
        <RoomsListItem
          isTitle={true}
          textSize={isMobile ? 1.125 : 1.5}
          firstCol="Комната"
          secondCol="Игроки"
        />
        <div className={style.itemList}>
          {roomList.map((room) => (
            <Fragment key={room.roomId}>
              <RoomsListItem
                isTitle={false}
                id={room.roomId}
                textSize={isMobile ? 1 : 1.25}
                firstCol={room.roomName}
                secondCol={`${room.playersInRoom.toString()} / 2`}
                isChosen={chosenRoom === room.roomId ? true : false}
                setChosenRoom={setChosenRoom}
              />
            </Fragment>
          ))}
        </div>
      </div>
      <LowerButtons
        chosenRoom={chosenRoom}
        isMobile={isMobile}
        createRoom={createRoom}
        joinRoom={joinRoom}
      />
    </>
  );
};

export default RoomsList;
