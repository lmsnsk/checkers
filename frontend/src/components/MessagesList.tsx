import { FC } from "react";

import style from "./MessagesList.module.scss";
import { useCheckerStore } from "../store/store";

const MessagesList: FC = () => {
  const { roomChat, nickname } = useCheckerStore();

  return (
    <>
      {roomChat.map((message, index) => {
        return (
          <div
            className={`${style.message} ${
              message.nickname === nickname ? style.endAlignMain : ""
            }`}
            key={message.text + index}
          >
            <div
              className={`${style.colorMessegeBox} ${
                message.nickname === nickname ? style.color : ""
              }`}
            >
              <span className={style.text}>{message.text}</span>
              <span className={style.date}>{message.date}</span>
            </div>
          </div>
        );
      })}
    </>
  );
};

export default MessagesList;
