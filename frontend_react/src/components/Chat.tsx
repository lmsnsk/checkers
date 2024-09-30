import { FC, KeyboardEvent, useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";

import style from "./Chat.module.scss";

import { useSocket } from "../lib/hooks";
import MessagesList from "./MessagesList";
import emojiImg from "../assets/img/emoji.png";
import sendImg from "../assets/img/send.png";

interface ChatProps {
  fieldSize: number;
  isVertical: boolean;
}

const messages = [
  { text: "Привет", date: "12:00", sender: "Me" },
  { text: "Привет!", date: "12:01", sender: "Ken" },
  { text: "Чо, как оно?", date: "12:02", sender: "Me" },
  { text: "Да норм😁", date: "12:03", sender: "Ken" },
];

const Chat: FC<ChatProps> = ({ fieldSize, isVertical }) => {
  const [inputMessage, setInputMessage] = useState("");
  const [messageList, setMessageList] = useState(messages);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const messageListRef = useRef<HTMLDivElement | null>(null);

  const socket = useSocket();

  const send = (inputMessage: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({
          action: "send_message",
          room_id: "0",
          sender: "333",
          content: inputMessage,
        })
      );
    }
  };

  if (socket) {
    socket.onmessage = (e) => console.log(JSON.parse(e.data));
  }

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
      send(inputMessage);
      setIsEmojiOpen(false);

      setMessageList([
        ...messageList,
        {
          text: inputMessage,
          date: new Date().toLocaleTimeString("ru", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          sender: "Me",
        },
      ]);
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
          <MessagesList messageList={messageList} />
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
