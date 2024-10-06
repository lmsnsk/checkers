import { FC } from "react";

import style from "./Figures.module.scss";

interface FiguresProps {
  fieldSize: number;
  field: number[][];
  creator: boolean;
}

const BL_IN = "#333";
const BL_OUT = "black";
const WH_IN = "#ccc";
const WH_OUT = "white";

const Figures: FC<FiguresProps> = ({ fieldSize, field, creator }) => {
  const cellSize = fieldSize / 8;
  const checkerSize = cellSize * 0.8;

  return (
    <div className={style.main}>
      {field.map((row, y) => {
        return row.map((cell, x) => {
          if (cell === 0) {
            return null;
          }
          const outerColor = cell === 2 || cell === 4 || (cell === 9 && !creator) ? BL_OUT : WH_OUT;
          const innerColor = cell === 2 || cell === 4 || (cell === 9 && !creator) ? BL_IN : WH_IN;

          return (
            <div
              key={`checkers-${x}${y}`}
              className={style.checker}
              style={{
                opacity: cell === 9 ? 0.2 : 1,
                border: `${checkerSize * 0.15}px solid ${outerColor}`,
                backgroundColor: innerColor,
                left: cellSize * x + cellSize / 2 - checkerSize / 2,
                top: cellSize * y + cellSize / 2 - checkerSize / 2,
                width: checkerSize,
                height: checkerSize,
              }}
            ></div>
          );
        });
      })}
    </div>
  );
};

export default Figures;
