import { FC, useEffect, useState } from "react";

import style from "./Lobby.module.scss";

import logo from "../assets/img/log.svg";

import RoomsList from "../components/RoomList";

interface LobbyProps {
  createRoom: (nickname: string) => void;
  joinRoom: (nickname: string, id: number) => void;
}

const Lobby: FC<LobbyProps> = ({ joinRoom, createRoom }) => {
  const [imgSize, setImgSize] = useState<number>(100);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const isMobile = () => {
      let mobile: boolean = false;
      if (window.innerWidth < 768 || window.innerHeight < 768) {
        mobile = true;
      }
      return mobile;
    };
    const imgSizeCalc = () => {
      let size: number = 100;
      if (window.innerWidth < 768 || window.innerHeight < 768) {
        size = 70;
      }
      return size;
    };
    isMobile() ? setIsMobile(true) : setIsMobile(false);
    setImgSize(imgSizeCalc());
    const handleResize = () => {
      isMobile() ? setIsMobile(true) : setIsMobile(false);
      setImgSize(imgSizeCalc());
    };
    setIsLoading(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <main className={style.main}>
          <div className={style.head}>
            <img src={logo} alt="logo" style={{ width: imgSize, height: imgSize }} />
            <div className={style.title}>
              <span className={style.firstWord}>ШАШКИ</span>
              <span className={style.secondWord}>ОНЛАЙН</span>
            </div>
          </div>
          <div className={style.roomListBox} style={{ width: isMobile ? "95%" : "600px" }}>
            <RoomsList isMobile={isMobile} createRoom={createRoom} joinRoom={joinRoom} />
          </div>
        </main>
      )}
    </>
  );
};

export default Lobby;
