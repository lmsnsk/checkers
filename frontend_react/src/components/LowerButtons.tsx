import { FC, useState } from "react";

import style from "./LowerButtons.module.scss";

interface LowerButtonsProps {
  className?: string;
  isMobile: boolean;
  chosenRoom: number;
  send: (inputNickname: string) => void;
  join: (nickname: string, id: number) => void;
}

const LowerButtons: FC<LowerButtonsProps> = ({ chosenRoom, isMobile, join, send }) => {
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

  return (
    <div className={style.main} style={{ flexDirection: isMobile ? "column" : "row" }}>
      <input
        className={style.input}
        type="text"
        placeholder="Enter your nickname..."
        onChange={(e) => setInputNickname(e.target.value)}
      />
      <div className={style.buttonBox}>
        <button onClick={createRoomHandler}>CREATE ROOM</button>
        <button onClick={joinRoomHandler}>JOIN</button>
      </div>
    </div>
  );
};

export default LowerButtons;
