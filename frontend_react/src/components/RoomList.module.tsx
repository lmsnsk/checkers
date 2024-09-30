import { FC, Fragment, useState } from "react";
import RoomsListItem from "./RoomsListItem";
import LowerButtons from "./LowerButtons";

import style from "./RoomList.module.scss";

export interface IListItem {
  id: number;
  name: string;
  players: number;
}

// const list: IListItem[] = [
//   { id: 1, name: "Room 1", players: 2 },
//   { id: 2, name: "Room 2", players: 2 },
//   { id: 3, name: "Room 3", players: 2 },
//   { id: 4, name: "Room 4", players: 2 },
//   { id: 5, name: "Room 5", players: 2 },
//   { id: 6, name: "Room 6", players: 2 },
//   { id: 7, name: "Room 7", players: 2 },
//   { id: 8, name: "Room 8", players: 2 },
//   { id: 9, name: "Room 9", players: 2 },
//   { id: 10, name: "Room 10", players: 2 },
//   { id: 11, name: "Room 11", players: 2 },
//   { id: 12, name: "Room 12", players: 2 },
//   { id: 13, name: "Room 13", players: 2 },
//   { id: 14, name: "Room 14", players: 2 },
//   { id: 15, name: "Room 15", players: 2 },
//   { id: 16, name: "Room 16", players: 2 },
//   { id: 17, name: "Room 17", players: 2 },
//   { id: 18, name: "Room 18", players: 2 },
//   { id: 19, name: "Room 19", players: 2 },
//   { id: 20, name: "Room 20", players: 2 },
//   { id: 21, name: "Room 21", players: 2 },
//   { id: 22, name: "Room 22", players: 2 },
//   { id: 23, name: "Room 23", players: 2 },
//   { id: 24, name: "Room 24", players: 2 },
//   { id: 25, name: "Room 25", players: 2 },
//   { id: 26, name: "Room 26", players: 2 },
//   { id: 27, name: "Room 27", players: 2 },
//   { id: 28, name: "Room 28", players: 2 },
//   { id: 29, name: "Room 29", players: 2 },
// ];

interface RoomsListProps {
  isMobile: boolean;
  send: (nickname: string) => void;
  join: (nickname: string, id: number) => void;
  roomList: IListItem[];
}

const RoomsList: FC<RoomsListProps> = ({ isMobile, roomList, join, send }) => {
  const [chosenRoom, setChosenRoom] = useState(0);

  return (
    <>
      <div className={style.main}>
        <RoomsListItem
          isTitle={true}
          textSize={isMobile ? 1.125 : 1.5}
          firstCol="Room"
          secondCol="Players"
        />
        <div className={style.itemList}>
          {roomList.map((room) => (
            <Fragment key={room.id}>
              <RoomsListItem
                isTitle={false}
                id={room.id}
                textSize={isMobile ? 1 : 1.25}
                firstCol={room.name}
                secondCol={`${room.players.toString()} / 2`}
                isChosen={chosenRoom === room.id ? true : false}
                setChosenRoom={setChosenRoom}
              />
            </Fragment>
          ))}
        </div>
      </div>
      <LowerButtons chosenRoom={chosenRoom} isMobile={isMobile} send={send} join={join} />
    </>
  );
};

export default RoomsList;
