import { FC, useState } from "react";

import { useCheckerStore } from "../store/store";

import style from "./EndGameMessage.module.scss";

interface EndGameMessageProps {
  leaveGame: () => void;
}

const EndGameMessage: FC<EndGameMessageProps> = ({ leaveGame }) => {
  const [waitToRepeat, setWaitToRepeat] = useState(false);

  const { winner, creator } = useCheckerStore();

  const onRepeatGameHandler = () => {
    // setWinner(undefined);
    setWaitToRepeat(true);
  };

  return (
    <>
      {winner && (
        <div className={style.main}>
          <div className={style.window}>
            <h3>
              {(winner === "creator" && creator) || (winner === "guest" && !creator)
                ? "ПОБЕДА!"
                : "ПОРАЖЕНИЕ"}
            </h3>
            <div className={style.buttons}>
              <button disabled={waitToRepeat} onClick={() => leaveGame()}>
                ПОКИНУТЬ ИГРУ
              </button>
              <button disabled={waitToRepeat} onClick={onRepeatGameHandler}>
                {waitToRepeat ? "ОЖИДАЕМ . . ." : "СЫГРАТЬ ЕЩЕ"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EndGameMessage;
