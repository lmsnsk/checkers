import { FC } from "react";

import style from "./MessagesList.module.scss";

interface IMessage {
  text: string;
  date: string;
  sender: string;
}

interface MessagesListProps {
  messageList: IMessage[];
}

const MessagesList: FC<MessagesListProps> = ({ messageList }) => {
  return (
    <>
      {messageList.map((message, index) => {
        return (
          <div
            className={`${style.message} ${message.sender === "Me" ? style.endAlignMain : ""}`}
            key={message.text + index}
          >
            <div
              className={`${style.colorMessegeBox} ${message.sender === "Me" ? style.color : ""}`}
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
