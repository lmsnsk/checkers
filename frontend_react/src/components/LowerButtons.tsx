import { FC, useState } from "react";

import style from "./LowerButtons.module.scss";

interface LowerButtonsProps {
  className?: string;
  isMobile: boolean;
  chosenRoom: number;
  createRoom: (inputNickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
}

const LowerButtons: FC<LowerButtonsProps> = ({ chosenRoom, isMobile, joinRoom, createRoom }) => {
  const [inputNickname, setInputNickname] = useState("");

  const inputNicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputNickname.length < 20) setInputNickname(e.target.value);
  };

  const createRoomHandler = () => {
    if (inputNickname) {
      createRoom(inputNickname);
    }
  };

  const joinRoomHandler = () => {
    if (inputNickname && chosenRoom) {
      joinRoom(inputNickname, chosenRoom);
    }
  };

  return (
    <div className={style.main} style={{ flexDirection: isMobile ? "column" : "row" }}>
      <input
        className={style.input}
        type="text"
        placeholder="Введите ваш ник..."
        value={inputNickname}
        onChange={inputNicknameHandler}
      />
      <div className={style.buttonBox}>
        <button onClick={createRoomHandler}>СОЗДАТЬ КОМНАТУ</button>
        <button onClick={joinRoomHandler}>ПРИСОЕДИНИТЬСЯ</button>
      </div>
    </div>
  );
};

export default LowerButtons;
