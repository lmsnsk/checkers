import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import Preloader from "./Preloader";
import ChatButton from "./ChatButton";
import MessagesList from "./MessagesList";

import backImg from "../assets/img/back.png";
import emojiImg from "../assets/img/emoji.png";
import sendImg from "../assets/img/send.png";
import { useCheckerStore } from "../store/store";

import style from "./Chat.module.scss";

interface ChatProps {
  fieldSize: number;
  isChatOpened: boolean;
  sendChatMessage: (text: string) => void;
  setIsChatOpened: (isChatOpened: boolean) => void;
}

const Chat: FC<ChatProps> = ({ fieldSize, sendChatMessage, isChatOpened, setIsChatOpened }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const { roomCreator, roomGuest } = useCheckerStore();

  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const listenerHandler = () => {
      setWindowWidth(window.innerWidth);
    };
    window.addEventListener("resize", listenerHandler);

    return () => {
      window.removeEventListener("resize", listenerHandler);
    };
  }, []);

  const sendMessage = () => {
    if (inputMessage) {
      sendChatMessage(inputMessage);
      setIsEmojiOpen(false);
      setInputMessage("");
      setTimeout(() => {
        messageListRef.current?.scrollTo({
          top: messageListRef.current.scrollHeight,
        });
      }, 50);
    }
  };

  const keyDownHandler = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div
      className={style.main}
      style={
        windowWidth > 1280
          ? { width: fieldSize * 0.8, height: fieldSize }
          : { width: "95%", height: "85%" }
      }
    >
      <div className={style.titleBox}>
        <span>ЧАТИК</span>
      </div>
      <div className={style.windowBox}>
        <div ref={messageListRef} className={style.window}>
          <MessagesList />
        </div>
        <div className={style.underWindow}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={keyDownHandler}
            placeholder="Введите ваше сообщение..."
          />
          <div className={style.emoji} onClick={() => setIsEmojiOpen(!isEmojiOpen)}>
            <img src={emojiImg} alt="emoji" />
          </div>
          <EmojiPicker
            open={isEmojiOpen}
            className={style.emojiPicker}
            onEmojiClick={(e) => setInputMessage((prev) => prev + e.emoji)}
            lazyLoadEmojis={true}
          />
          <button onClick={sendMessage}>
            <img src={sendImg} alt="send" />
          </button>
        </div>
        {(!roomCreator || !roomGuest) && <Preloader />}
      </div>
      {fieldSize < 600 && (
        <ChatButton
          img={backImg}
          roomGuest={roomGuest}
          isChatOpened={isChatOpened}
          setIsChatOpened={setIsChatOpened}
        />
      )}
    </div>
  );
};

export default Chat;
