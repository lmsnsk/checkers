import style from "./Board.module.css";
import CellComponent from "./CellComponent";

const BoardComponent: React.FC = () => {
  return (
    <div className={style.board}>
      <CellComponent />
    </div>
  );
};

export default BoardComponent;
