import { useSound } from "../lib/hooks";
import { clearTempCheckers } from "../lib/utils";
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
  sendCoordinates: (x: number, y: number, userId: number | undefined) => void;
}

const Field: FC<FieldProps> = ({
  fieldSize,
  roomCreator,
  roomGuest,
  field,
  userId,
  sendCoordinates,
}) => {
  const [repeatMove, setRepeatMove] = useState(false);
  const [playerColor, setPlayerColor] = useState<1 | 2>(2);
  const [currentChecker, setCurrentChecker] = useState<CheckerType | null>(null);

  // const playSound = useSound("../assets/sounds/checker.mp3");

  const checkFreeMove = (x: number, y: number) => {
    if (y === 0) return;
    if (x > 0 && field[y - 1][x - 1] === 0) {
      field[y - 1][x - 1] = 9;
    }
    if (x < 7 && field[y - 1][x + 1] === 0) {
      field[y - 1][x + 1] = 9;
    }
  };

  const checkFreeQueenMove = (x: number, y: number) => {
    for (let i = 1; x - i >= 0 && y - i >= 0 && field[y - i][x - i] === 0; i++) {
      field[y - i][x - i] = 9;
    }
    for (let i = 1; x + i <= 7 && y - i >= 0 && field[y - i][x + i] === 0; i++) {
      field[y - i][x + i] = 9;
    }
    for (let i = 1; x - i >= 0 && y + i <= 7 && field[y + i][x - i] === 0; i++) {
      field[y + i][x - i] = 9;
    }
    for (let i = 1; x + i <= 7 && y + i <= 7 && field[y + i][x + i] === 0; i++) {
      field[y + i][x + i] = 9;
    }
  };

  const checkFightMove = (x: number, y: number): boolean => {
    const enemyColor = playerColor === 1 ? 2 : 1;
    let isFighting = false;

    if (field[y - 1][x - 1] === enemyColor && y - 2 >= 0 && field[y - 2][x - 2] === 0) {
      field[y - 2][x - 2] = 9;
      isFighting = true;
    }
    if (field[y - 1][x + 1] === enemyColor && y - 2 >= 0 && field[y - 2][x + 2] === 0) {
      field[y - 2][x + 2] = 9;
      isFighting = true;
    }
    if (y < 6 && field[y + 1][x - 1] === enemyColor && field[y + 2][x - 2] === 0) {
      field[y + 2][x - 2] = 9;
      isFighting = true;
    }
    if (y < 6 && field[y + 1][x + 1] === enemyColor && field[y + 2][x + 2] === 0) {
      field[y + 2][x + 2] = 9;
      isFighting = true;
    }
    return isFighting;
  };

  const checkFightQueenMove = (x: number, y: number): boolean => {
    const enemyColor = playerColor === 1 ? 2 : 1;
    let isFighting = false;
    let firstCheck = false;

    let i = 1;
    while (y - i >= 0 && x - i >= 0) {
      if (field[y - i][x - i] === playerColor) break;
      if (field[y - i][x - i] === 0) field[y - i][x - i] = 9;
      if (field[y - i][x - i] === enemyColor) {
        if (!firstCheck && y - i > 0 && field[y - i - 1][x - i - 1] === 0) {
          clearTempCheckers(field);
          firstCheck = true;
          isFighting = true;
        } else {
          break;
        }
      }
      i++;
    }
    return isFighting;
  };

  const checkNextMove = (x: number, y: number, isQueen: boolean) => {
    if (isQueen) {
      if (!checkFightQueenMove(x, y)) checkFreeQueenMove(x, y);
    } else {
      if (!checkFightMove(x, y)) checkFreeMove(x, y);
    }
    // checkMove(x, y);
  };

  const onClickHandler = (e: MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor((e.clientX - rect.left) / (rect.width / 8));
    const y = Math.floor((e.clientY - rect.top) / (rect.height / 8));

    sendCoordinates(x, y, userId);
    // if (!currentChecker && field[y][x] === 0) {
    //   return;
    // }
    // if (field[y][x] === playerColor) {
    //   clearTempCheckers(field);
    //   setCurrentChecker({ x, y, color: field[y][x] as CheckerType["color"], isQueen: true });
    //   checkNextMove(x, y, true); // проверка дамки
    //   // setField([...field]);
    //   return;
    // }
    // if (currentChecker && field[y][x] === 9) {
    //   clearTempCheckers(field); // придет с сервера, не нужно очищать
    //   field[currentChecker.y][currentChecker.x] = 0;
    //   field[y][x] = currentChecker.color;
    //   // setField([...field]);
    //   setCurrentChecker(null);
    //   // playSound();
    // }
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
            <Figures field={field} fieldSize={fieldSize} />
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
