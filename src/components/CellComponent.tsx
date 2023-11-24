import style from "./Cell.module.css";

const CellComponent: React.FC = () => {
  const cellsCreator = (): Array<React.ReactElement> => {
    const cellArray: Array<React.ReactElement> = [];
    for (let i = 0; i < 8; i++) {
      let k: number = i % 2 ? 0 : 1;
      for (let j = k; j < k + 8; j++) {
        cellArray.push(
          <div
            className={`${j % 2 ? style.black : style.white} ${style.cell}`}
          ></div>
        );
      }
    }
    return cellArray;
  };
  return <>{cellsCreator()}</>;
};

export default CellComponent;
