import { FC, MouseEvent } from "react";

import Figures from "./Figures";
import EndGameMessage from "./EndGameMessage";

import { useCheckerStore } from "../store/store";

import style from "./Field.module.scss";

const marginRow = [" ", "A", "B", "C", "D", "E", "F", "G", "H", " "];
const marginColumn = ["8", "7", "6", "5", "4", "3", "2", "1"];

const BL_CELL = "#769656";
const WH_CELL = "#ffcb87";

interface FieldProps {
  fieldSize: number;
  leaveGame: () => void;
  sendCoordinates: (x: number, y: number, userId: number | undefined) => void;
}

const Field: FC<FieldProps> = ({ fieldSize, leaveGame, sendCoordinates }) => {
  const { userId, creator, roomCreator, roomGuest, gameState } = useCheckerStore();

  const onClickHandler = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / 8));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / 8));

    sendCoordinates(x, y, userId);
  };

  const drawField = () => {
    return Array(8)
      .fill(Array(8).fill(0))
      .map((row: number[], y: number) => {
        return row.map((_: number, x: number) => {
          const color = (x + y) % 2 ? BL_CELL : WH_CELL;
          return <div key={`${x}${y}`} style={{ backgroundColor: color }}></div>;
        });
      });
  };

  const drawMarginRow = (keyAdd: string) => {
    return (
      <div
        className={`${style.asideStyle} ${style.marginRow}`}
        style={
          fieldSize < 600
            ? {
                height: "24px",
                fontSize: "1rem",
                gridTemplateColumns: "2rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr 2rem",
              }
            : {}
        }
      >
        {marginRow.map((row, i) => (
          <div key={row + keyAdd + i}>{row}</div>
        ))}
      </div>
    );
  };

  const drawMarginColumn = (keyAdd: string) => {
    return (
      <div
        className={`${style.asideStyle} ${style.marginColumn}`}
        style={fieldSize < 600 ? { width: "24px", fontSize: "1rem" } : {}}
      >
        {marginColumn.map((row) => (
          <div key={row + keyAdd}>{row}</div>
        ))}
      </div>
    );
  };

  return (
    <>
      <div className={style.main}>
        {roomCreator && roomGuest && (
          <span className={style.enemyName}>{creator ? roomGuest : roomCreator}</span>
        )}
        {gameState &&
          ((gameState.turn === "creator" && !creator) || (gameState.turn === "guest" && creator)) &&
          roomGuest &&
          roomCreator && <span className={style.enemyTurn}>Ход противника</span>}
        {drawMarginRow("top")}
        <div className={style.wrapper}>
          {drawMarginColumn("left")}
          <div
            className={style.field}
            style={{ height: `${fieldSize}px`, width: `${fieldSize}px` }}
            onClick={onClickHandler}
          >
            {drawField()}
            <Figures gameState={gameState} fieldSize={fieldSize} />
          </div>
          {drawMarginColumn("right")}
        </div>
        {drawMarginRow("bottom")}
        {(!roomCreator || !roomGuest) && <div className={style.cloack}></div>}
        {roomCreator && roomGuest && (
          <span className={style.playerName}>{creator ? roomCreator : roomGuest}</span>
        )}
        {gameState &&
          ((gameState!.turn === "creator" && creator) ||
            (gameState!.turn === "guest" && !creator)) &&
          roomGuest &&
          roomCreator && <span className={style.youTurn}>Ваш ход</span>}
        <EndGameMessage leaveGame={leaveGame} />
      </div>
    </>
  );
};

export default Field;
