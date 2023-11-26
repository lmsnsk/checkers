import { BoardCellI } from "./BoardComponent";
import style from "./Cell.module.css";

interface CellComponentI {
  board: BoardCellI;
  setBoard: React.Dispatch<React.SetStateAction<BoardCellI[][]>>;
}

const CellComponent: React.FC<CellComponentI> = ({ board, setBoard }) => {
  const cellCreator = () => {
    const styleLine =
      board.x % 2
        ? `${board.y % 2 ? style.black : style.white} ${style.cell}`
        : `${board.y % 2 ? style.white : style.black} ${style.cell}`;
    return <div className={styleLine}></div>;
  };

  return cellCreator();
};

export default CellComponent;
