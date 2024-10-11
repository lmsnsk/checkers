import { FC } from "react";

import preloader from "../assets/img/preloader.svg";

import style from "./ServerError.module.scss";

interface ServerErrorProps {}

const ServerError: FC<ServerErrorProps> = () => {
  return (
    <div className={style.main}>
      <img src={preloader} alt="preloader" />
    </div>
  );
};

export default ServerError;
