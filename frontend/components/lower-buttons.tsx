"use client";

import { FC, useState } from "react";
import { IListItem } from "./rooms-list";
import { cn } from "@/lib/utils";

interface LowerButtonsProps {
  className?: string;
  isMobile: boolean;
  chosenRoom: number;
  send: (inputNickname: string) => void;
  join: (inputNickname: string, id: number) => void;
}

export const LowerButtons: FC<LowerButtonsProps> = ({
  chosenRoom,
  isMobile,
  send,
  join,
}) => {
  const [inputNickname, setInputNickname] = useState("");

  const createRoomHandler = () => {
    if (inputNickname) {
      send(inputNickname);
    }
  };

  const joinRoomHandler = () => {
    if (inputNickname && chosenRoom) {
      join(inputNickname, chosenRoom);
    }
  };

  const buttonStyle =
    "bg-white p-2 rounded-lg font-bold active:scale-95 transitionshadow-[0_0_50px] shadow-slate-500";

  return (
    <div
      className={cn(
        isMobile ? "flex-col" : "",
        "flex gap-2  w-full justify-between"
      )}
    >
      <input
        className="bg-white p-2 rounded-lg outline-none flex-grow"
        type="text"
        placeholder="Enter your nickname..."
        onChange={(e) => setInputNickname(e.target.value)}
      />
      <div className="flex gap-2 justify-between">
        <button className={buttonStyle} onClick={createRoomHandler}>
          CREATE ROOM
        </button>
        <button className={buttonStyle} onClick={joinRoomHandler}>
          JOIN
        </button>
      </div>
    </div>
  );
};
