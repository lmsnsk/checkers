import { FC } from "react";

import style from "./RoomsListItem.module.scss";

interface RoomsListItemProps {
  id?: number;
  isTitle: boolean;
  isChosen?: boolean;
  firstCol: string;
  secondCol: string;
  setChosenRoom?: (id: number) => void;
}

const RoomsListItem: FC<RoomsListItemProps> = ({
  id,
  isChosen,
  firstCol,
  isTitle,
  secondCol,
  setChosenRoom,
}) => {
  return (
    <div
      className={`${style.main} ${isTitle ? style.mainTitle : ""}  ${isChosen ? style.chosen : ""}`}
      onClick={setChosenRoom && id ? () => setChosenRoom(id) : undefined}
    >
      <div className={`${style.columnElement} ${isTitle ? style.title : ""}`}>{firstCol}</div>
      <div className={`${style.columnElement} ${isTitle ? style.title : ""}`}>{secondCol}</div>
    </div>
  );
};

export default RoomsListItem;
