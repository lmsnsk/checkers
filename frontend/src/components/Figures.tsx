import { FC } from "react";

import { FigureKind } from "../lib/types";
import whiteCrownSvg from "../assets/img/whiteCrown.svg";
import blackCrownSvg from "../assets/img/blackCrown.svg";

import style from "./Figures.module.scss";

const BL_IN = "#333";
const BL_OUT = "black";
const WH_IN = "#ccc";
const WH_OUT = "white";

interface FiguresProps {
  fieldSize: number;
  field: FigureKind[][];
  creator: boolean;
}

const Figures: FC<FiguresProps> = ({ fieldSize, field, creator }) => {
  const cellSize = fieldSize / 8;
  const checkerSize = cellSize * 0.8;

  return (
    <div className={style.main}>
      {field.map((row, y) => {
        return row.map((cell, x) => {
          if (cell === FigureKind.EMPTY) {
            return null;
          }
          const outerColor =
            cell === FigureKind.BLACK ||
            cell === FigureKind.BLACK_KING ||
            (cell === FigureKind.POSSIBLE_TURN && !creator)
              ? BL_OUT
              : WH_OUT;

          const innerColor =
            cell === FigureKind.BLACK ||
            cell === FigureKind.BLACK_KING ||
            (cell === FigureKind.POSSIBLE_TURN && !creator)
              ? BL_IN
              : WH_IN;

          return (
            <div
              key={`checkers-${x}${y}`}
              className={style.checker}
              style={{
                opacity: cell === FigureKind.POSSIBLE_TURN ? 0.2 : 1,
                border: `${checkerSize * 0.15}px solid ${outerColor}`,
                backgroundColor: innerColor,
                left: cellSize * x + cellSize / 2 - checkerSize / 2,
                top: cellSize * y + cellSize / 2 - checkerSize / 2,
                width: checkerSize,
                height: checkerSize,
              }}
            >
              {cell === FigureKind.WHITE_KING && <img src={whiteCrownSvg} alt="crown" />}
              {cell === FigureKind.BLACK_KING && <img src={blackCrownSvg} alt="crown" />}
            </div>
          );
        });
      })}
    </div>
  );
};

export default Figures;
