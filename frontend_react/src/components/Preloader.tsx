import { FC } from "react";

import preloader from "../assets/img/ghost.gif";

import style from "./Preloader.module.scss";

const Preloader: FC = () => {
  return (
    <div className={style.box}>
      <img src={preloader} alt="preloader" />
    </div>
  );
};
export default Preloader;
