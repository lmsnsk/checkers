import { FC, useEffect, useState } from "react";

import Chat from "../components/Chat";
import Field from "../components/Field";
import chatImg from "../assets/img/chat.png";
import backImg from "../assets/img/back.png";
import ConfirmWindow from "../components/ConfirmWindow";
import { useCheckerStore } from "../store/store";

import preloader from "../assets/img/ghost.gif";
import logo from "../assets/img/log.svg";

import style from "./Room.module.scss";

interface RoomProps {
  sendChatMessage: (text: string) => void;
  sendCoordinates: (x: number, y: number, userId: number | undefined) => void;
  leaveGame: () => void;
}

const Room: FC<RoomProps> = ({ sendChatMessage, sendCoordinates, leaveGame }) => {
  const [fieldSize, setFieldSize] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpened, setIsChatOpened] = useState(false);
  const [confirmWindow, setConfirmWindow] = useState(false);

  const { roomCreator, roomGuest } = useCheckerStore();

  useEffect(() => {
    const fieldSizeCalc = () => {
      let size = 0;
      if (window.innerWidth > 1280 && window.innerHeight > 768) {
        size = 600;
      } else if (window.innerWidth > 768 && window.innerHeight > 768) {
        size = 500;
      } else if (window.innerWidth > 550 && window.innerHeight > 550) {
        size = 500;
      } else if (window.innerWidth > 450 && window.innerHeight > 450) {
        size = 400;
      } else {
        size = 300;
      }
      if (window.innerWidth < 1280) {
        if (!isVertical) setIsVertical(true);
      } else {
        if (isVertical) setIsVertical(false);
      }
      return size;
    };
    setFieldSize(fieldSizeCalc());

    const handleResize = () => {
      const size = fieldSizeCalc();
      setFieldSize(size);
    };
    window.addEventListener("resize", handleResize);

    setIsLoading(true);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isVertical]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (isChatOpened && e.key === "Escape") setIsChatOpened(false);
    };
    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [isChatOpened]);

  const title = () => {
    return (
      <>
        <div className={`${style.title} ${isVertical ? style.verticalTitle : ""}`}>
          {/* <img src={logo} alt="logo" style={{ width: "40px", height: "40px" }} /> */}
          <button className={style.back} onClick={() => setConfirmWindow(true)}>
            <img src={backImg} alt="back" />
          </button>
          ШАШКИ ОНЛАЙН
        </div>
      </>
    );
  };

  const showPlayer = (player: string, number: number) => {
    return (
      <div className={style.playerBox}>
        <span>Игрок {number}:</span>
        {!player && <img src={preloader} alt="preloader" />}
        <span className={style.nickname + " " + (player ? "" : style.waiting)}>
          {player ? <strong>{player}</strong> : "Ожидание..."}
        </span>
      </div>
    );
  };

  const showChat = () => {
    return <Chat fieldSize={fieldSize} isVertical={isVertical} sendChatMessage={sendChatMessage} />;
  };

  const showField = () => {
    return <Field fieldSize={fieldSize} sendCoordinates={sendCoordinates} leaveGame={leaveGame} />;
  };

  return (
    <>
      {isLoading && (
        <div className={`${style.main} ${isVertical ? style.verticalMain : ""}`}>
          {isVertical ? (
            <>
              {title()}
              <div className={style.players}>
                {showPlayer(roomCreator, 1)}
                {showPlayer(roomGuest, 2)}
              </div>
              {showField()}
              <div className={`${style.chatBox} ${isChatOpened ? style.openedChatBox : ""}`}>
                {showChat()}
              </div>
              <button
                disabled={roomGuest ? false : true}
                className={style.button}
                onClick={() => setIsChatOpened(!isChatOpened)}
              >
                <img className={style.img} src={isChatOpened ? backImg : chatImg} alt="chat" />
              </button>
            </>
          ) : (
            <>
              <section className={style.leftSection}>
                {title()}
                <div className={style.players}>
                  {showPlayer(roomCreator, 1)}
                  {showPlayer(roomGuest, 2)}
                </div>
                {showChat()}
              </section>
              {showField()}
            </>
          )}
        </div>
      )}
      {confirmWindow && (
        <ConfirmWindow
          text={"ПОКИНУТЬ КОМНАТУ?"}
          agreeFn={leaveGame}
          setConfirmWindow={setConfirmWindow}
        />
      )}
    </>
  );
};

export default Room;
