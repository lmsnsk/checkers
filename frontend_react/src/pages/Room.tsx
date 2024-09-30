import { FC, useEffect, useState } from "react";

import style from "./Room.module.scss";

import Chat from "../components/Chat";
import Field from "../components/Field";
import chatImg from "../assets/img/chat.png";
import backImg from "../assets/img/back.png";
import { RoomChat } from "../App";

interface RoomProps {
  nickname: string;
  roomChat: RoomChat[];
  sendChatMessage: (text: string) => void;
}

const Room: FC<RoomProps> = ({ nickname, roomChat, sendChatMessage }) => {
  const [fieldSize, setFieldSize] = useState(0);
  const [isVertical, setIsVertical] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpened, setIsChatOpened] = useState(false);

  useEffect(() => {
    const fieldSizeCalc = () => {
      let size = 0;
      if (window.innerWidth > 768 && window.innerHeight > 768) {
        size = 600;
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
      <div className={`${style.title} ${isVertical ? style.verticalTitle : ""}`}>ШАШКИ ОНЛАЙН</div>
    );
  };

  return (
    <>
      {isLoading && (
        <div className={`${style.main} ${isVertical ? style.verticalMain : ""}`}>
          {isVertical ? (
            <>
              {title()}
              <Field fieldSize={fieldSize} />
              <div className={`${style.chatBox} ${isChatOpened ? style.vertiCalchatBox : ""}`}>
                <Chat
                  nickname={nickname}
                  roomChat={roomChat}
                  fieldSize={fieldSize}
                  isVertical={isVertical}
                  sendChatMessage={sendChatMessage}
                />
              </div>
              <button className={style.button} onClick={() => setIsChatOpened(!isChatOpened)}>
                <img className={style.img} src={isChatOpened ? backImg : chatImg} alt="chat" />
              </button>
            </>
          ) : (
            <>
              <div>
                <Chat
                  nickname={nickname}
                  roomChat={roomChat}
                  fieldSize={fieldSize}
                  isVertical={isVertical}
                  sendChatMessage={sendChatMessage}
                />
              </div>
              <Field fieldSize={fieldSize} />
            </>
          )}
        </div>
      )}
    </>
  );
};

export default Room;
