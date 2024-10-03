import { FC } from "react";

import style from "./RoomsListItem.module.scss";

interface RoomsListItemProps {
  id?: number;
  isTitle: boolean;
  textSize: number;
  isChosen?: boolean;
  firstCol: string;
  secondCol: string;
  setChosenRoom?: (id: number) => void;
}

const RoomsListItem: FC<RoomsListItemProps> = ({
  id,
  isChosen,
  textSize,
  firstCol,
  isTitle,
  secondCol,
  setChosenRoom,
}) => {
  return (
    <div
      className={style.main}
      style={{ backgroundColor: isChosen ? "rgb(180,180,180)" : "", fontSize: textSize + "rem" }}
      onClick={setChosenRoom && id ? () => setChosenRoom(id) : undefined}
    >
      <div className={`${style.columnElement} ${isTitle ? style.title : ""}`}>{firstCol}</div>
      <div className={`${style.columnElement} ${isTitle ? style.title : ""}`}>{secondCol}</div>
    </div>
  );
};

export default RoomsListItem;
