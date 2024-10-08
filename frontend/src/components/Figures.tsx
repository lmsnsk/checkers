import { FC } from "react";

import { GameState } from "../lib/types";
import whiteCrownSvg from "../assets/img/whiteCrown.svg";
import blackCrownSvg from "../assets/img/blackCrown.svg";

import style from "./Figures.module.scss";

const BL_IN = "#333";
const BL_OUT = "black";
const WH_IN = "#ccc";
const WH_OUT = "white";

interface FiguresProps {
  fieldSize: number;
  creator: boolean;
  gameState: GameState | undefined;
}

const Figures: FC<FiguresProps> = ({ fieldSize, gameState, creator }) => {
  const cellSize = fieldSize / 8;
  const checkerSize = cellSize * 0.8;

  function showFigures(figures: GameState["checkers"] | GameState["possibleTurns"]) {
    return figures.map((figure) => {
      const outerColor = figure.color === "black" ? BL_OUT : WH_OUT;
      const innerColor = figure.color === "black" ? BL_IN : WH_IN;

      let className;
      let isOpacity = false;

      if ("canMove" in figure && "isChosen" in figure) {
        className = `${style.checker} ${figure.canMove ? style.canMove : ""} ${
          figure.isChosen ? style.chosen : ""
        }`;
      } else {
        className = style.checker;
        isOpacity = true;
      }

      return (
        <div
          key={`checker-${figure.x}${figure.y}`}
          className={className}
          style={{
            opacity: isOpacity ? 0.2 : 1,
            border: `${checkerSize * 0.15}px solid ${outerColor}`,
            backgroundColor: innerColor,
            left: cellSize * figure.x + cellSize / 2 - checkerSize / 2,
            top: cellSize * figure.y + cellSize / 2 - checkerSize / 2,
            width: checkerSize,
            height: checkerSize,
          }}
        >
          {figure.isKing && (
            <>
              {figure.color === "white" && <img src={whiteCrownSvg} alt="crown" />}
              {figure.color === "black" && <img src={blackCrownSvg} alt="crown" />}
            </>
          )}
        </div>
      );
    });
  }

  if (!gameState || !gameState.checkers || !gameState.checkers.length) {
    return <></>; /////
  }

  return (
    <div className={style.main}>
      {showFigures(gameState.checkers)}
      {gameState.showPossibleTurns && <>{showFigures(gameState.possibleTurns)}</>}
    </div>
  );
};

export default Figures;
