import { useState } from "react";
import style from "./Board.module.css";
import CellComponent from "./CellComponent";

export interface BoardCellI {
  x: number;
  y: number;
  fig: boolean;
  king: boolean;
}

class Cell {
  constructor(x: number, y: number, fig: boolean, king: boolean) {
    this.x = x;
    this.y = y;
    this.fig = fig;
    this.king = king;
  }
  x = 0;
  y = 0;
  fig = false;
  king = false;
}

const boardArray: Array<Array<BoardCellI>> = [];

for (let i = 0; i < 8; i++) {
  boardArray.push([]);
  for (let j = 0; j < 8; j++) {
    boardArray[i].push(new Cell(i, j, false, false));
  }
}

const BoardComponent: React.FC = () => {
  const [board, setBoaed] = useState(boardArray);
  const cellsCreator = (): Array<React.ReactElement> => {
    const boardArray: Array<React.ReactElement> = [];
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        boardArray.push(
          <CellComponent board={board[i][j]} setBoard={setBoaed} />
        );
      }
    }
    return boardArray;
  };
  return <div className={style.board}>{cellsCreator()}</div>;
};

export default BoardComponent;
