import { FC, useEffect, useState } from "react";

import RoomsList from "../components/RoomList";

import logo from "../assets/img/log.svg";

import style from "./Lobby.module.scss";

interface LobbyProps {
  createRoom: (nickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
}

const Lobby: FC<LobbyProps> = ({ joinRoom, createRoom }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
  }, []);

  return (
    <>
      {isLoading && (
        <main className={style.main}>
          <div className={style.head}>
            <div className={style.logoBox}>
              <img className={style.logo} src={logo} alt="logo" />
            </div>
            <div className={style.title}>
              <span className={style.firstWord}>ШАШКИ</span>
              <span className={style.secondWord}>ОНЛАЙН</span>
            </div>
          </div>
          <div className={style.roomListBox}>
            <RoomsList createRoom={createRoom} joinRoom={joinRoom} />
          </div>
        </main>
      )}
    </>
  );
};

export default Lobby;
