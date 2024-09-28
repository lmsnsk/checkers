"use client";

import { FC, Fragment, useState } from "react";
import { RoomsListItem } from "./rooms-list-item";
import clsx from "clsx";
import { LowerButtons } from "./lower-buttons";
import { cn } from "@/lib/utils";

export interface IListItem {
  id: number;
  name: string;
  players: number;
}

interface RoomsListProps {
  className?: string;
  isMobile: boolean;
  roomList: IListItem[];
  send: (inputNickname: string) => void;
  join: (inputNickname: string, id: number) => void;
}

export const RoomsList: FC<RoomsListProps> = ({
  isMobile,
  roomList,
  send,
  join,
}) => {
  const [chosenRoom, setChosenRoom] = useState(0);

  return (
    <>
      <div className="w-full h-[350px] md:h-[480px] bg-white rounded-md flex flex-col overflow-hidden shadow-[0_0_50px] shadow-slate-500">
        <RoomsListItem
          className={cn(
            isMobile ? "text-lg" : "text-2xl",
            "bg-black text-white font-bold pr-1 border-b-2 border-gray-800"
          )}
          firstCol="Room"
          secondCol="Players"
        />
        <div className="w-full overflow-auto">
          {roomList.map((room) => (
            <Fragment key={room.id}>
              <RoomsListItem
                id={room.id}
                className={isMobile ? "text-md" : "text-xl"}
                firstCol={room.name}
                secondCol={clsx(room.players.toString(), "/ 2")}
                isChosen={chosenRoom === room.id ? true : false}
                setChosenRoom={setChosenRoom}
              />
            </Fragment>
          ))}
        </div>
      </div>
      <LowerButtons
        chosenRoom={chosenRoom}
        isMobile={isMobile}
        send={send}
        join={join}
      />
    </>
  );
};
