import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import style from "./Chat.module.scss";

import MessagesList from "./MessagesList";
import emojiImg from "../assets/img/emoji.png";
import sendImg from "../assets/img/send.png";
import { RoomChat } from "../App";

interface ChatProps {
  nickname: string;
  roomChat: RoomChat[];
  fieldSize: number;
  isVertical: boolean;
  sendChatMessage: (text: string) => void;
}

const Chat: FC<ChatProps> = ({ nickname, roomChat, fieldSize, isVertical, sendChatMessage }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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
          <MessagesList nickname={nickname} roomChat={roomChat} />
        </div>
        <div className={style.underWindow}>
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={keyDownHandler}
            placeholder="Enter your message..."
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
      </div>
    </div>
  );
};

export default Chat;