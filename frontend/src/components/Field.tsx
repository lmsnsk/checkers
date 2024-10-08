import { useSound } from "../lib/hooks";
import { FC, MouseEvent } from "react";
import Figures from "./Figures";

import style from "./Field.module.scss";
import Preloader from "./Preloader";
import { FigureKind } from "../lib/types";

/*
0 - пустая
1 - белая
2 - черная
3 - белая королева
4 - черная королева
*/

const marginRow = [" ", "A", "B", "C", "D", "E", "F", "G", "H", " "];
const marginColumn = ["8", "7", "6", "5", "4", "3", "2", "1"];

const BL_CELL = "#769656";
const WH_CELL = "#ffcb87";

interface FieldProps {
  turn: "creator" | "guest" | undefined;
  fieldSize: number;
  roomCreator: string;
  roomGuest: string;
  field: FigureKind[][];
  userId: number | undefined;
  creator: boolean;
  sendCoordinates: (x: number, y: number, userId: number | undefined) => void;
}

const Field: FC<FieldProps> = ({
  turn,
  fieldSize,
  roomCreator,
  roomGuest,
  field,
  userId,
  creator,
  sendCoordinates,
}) => {
  // const playSound = useSound("../assets/sounds/checker.mp3");

  const onClickHandler = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / 8));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / 8));

    sendCoordinates(x, y, userId);
  };

  const drawField = () => {
    return field.map((row, y) => {
      return row.map((_, x) => {
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
                height: "32px",
                fontSize: "1.5rem",
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
        style={fieldSize < 600 ? { width: "32px", fontSize: "1.5rem" } : {}}
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
        <span className={style.enemyName}>{creator ? roomGuest : roomCreator}</span>
        {((turn === "creator" && !creator) || (turn === "guest" && creator)) &&
          roomGuest &&
          roomCreator && <span className={style.enemyTurn}>Ход противника</span>}
        {drawMarginRow("top")}
        <div className={style.wrapper}>
          {drawMarginColumn("left")}
          <div
            className={style.field}
            style={{ height: fieldSize, width: fieldSize }}
            onClick={onClickHandler}
          >
            {drawField()}
            <Figures field={field} fieldSize={fieldSize} creator={creator} />
          </div>
          {drawMarginColumn("right")}
        </div>
        {drawMarginRow("bottom")}
        {(!roomCreator || !roomGuest) && <Preloader />}
        <span className={style.playerName}>{creator ? roomCreator : roomGuest}</span>
        {((turn === "creator" && creator) || (turn === "guest" && !creator)) &&
          roomGuest &&
          roomCreator && <span className={style.youTurn}>Ваш ход</span>}
      </div>
    </>
  );
};

export default Field;
