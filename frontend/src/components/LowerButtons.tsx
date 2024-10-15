import { FC, useState } from "react";

import { useCheckerStore } from "../store/store";

import style from "./LowerButtons.module.scss";

interface LowerButtonsProps {
  chosenRoom: number;
  createRoom: (inputNickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
}

const LowerButtons: FC<LowerButtonsProps> = ({ chosenRoom, joinRoom, createRoom }) => {
  const [inputNickname, setInputNickname] = useState("");
  const [errorInput, setErrorInput] = useState(false);

  const setCreator = useCheckerStore((state) => state.setCreator);

  const inputNicknameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (inputNickname.length < 20) {
      setInputNickname(e.target.value);
      setErrorInput(false);
    }
  };

  const createRoomHandler = () => {
    if (inputNickname && inputNickname.length > 2) {
      createRoom(inputNickname);
      setCreator(true);
    } else {
      setErrorInput(true);
    }
  };

  const joinRoomHandler = () => {
    if (chosenRoom) {
      if (inputNickname && inputNickname.length > 2) {
        joinRoom(inputNickname, chosenRoom);
      } else {
        setErrorInput(true);
      }
    }
  };

  return (
    <div className={style.main}>
      <input
        className={`${style.input} ${errorInput && style.errorInput}`}
        type="text"
        placeholder="Введите ваш ник..."
        value={inputNickname}
        onChange={inputNicknameHandler}
      />
      <div className={style.buttonBox}>
        <button className={style.button} onClick={createRoomHandler}>
          СОЗДАТЬ КОМНАТУ
        </button>
        <button
          className={chosenRoom ? style.button : style.disabledButton}
          onClick={joinRoomHandler}
        >
          ПРИСОЕДИНИТЬСЯ
        </button>
      </div>
    </div>
  );
};

export default LowerButtons;
