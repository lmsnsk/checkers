import { FC } from "react";

import style from "./ConfirmWindow.module.scss";

interface ConfirmWindowProps {
  text: string;
  agreeFn: () => void;
  setConfirmWindow: (confirmWindow: boolean) => void;
}

const ConfirmWindow: FC<ConfirmWindowProps> = ({ text, agreeFn, setConfirmWindow }) => {
  return (
    <div className={style.main}>
      <div className={style.window}>
        <span className={style.text}>{text}</span>
        <div className={style.buttons}>
          <button onClick={agreeFn}>Подтвердить</button>
          <button onClick={() => setConfirmWindow(false)}>Отмена</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmWindow;
