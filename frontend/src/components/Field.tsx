import { useSound } from "../lib/hooks";
import { FC, Fragment, MouseEvent, useState } from "react";
import Figures from "./Figures";

import style from "./Field.module.scss";
import Preloader from "./Preloader";

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

interface CheckerType {
  x: number;
  y: number;
  color: 1 | 2 | 9;
  isQueen: boolean;
}

interface FieldProps {
  fieldSize: number;
  roomCreator: string;
  roomGuest: string;
  field: number[][];
  userId: number | undefined;
  creator: boolean;
  sendCoordinates: (x: number, y: number, userId: number | undefined) => void;
}

const Field: FC<FieldProps> = ({
  fieldSize,
  roomCreator,
  roomGuest,
  field,
  userId,
  creator,
  sendCoordinates,
}) => {
  const [repeatMove, setRepeatMove] = useState(false);
  const [playerColor, setPlayerColor] = useState<1 | 2>(2);
  const [currentChecker, setCurrentChecker] = useState<CheckerType | null>(null);

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
      </div>
    </>
  );
};

export default Field;
