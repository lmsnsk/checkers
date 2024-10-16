import { FC } from "react";

import style from "./ChatButton.module.scss";

interface ChatButtonProps {
  img: string;
  roomGuest: string;
  isChatOpened: boolean;
  setIsChatOpened: (isChatOpened: boolean) => void;
}

const ChatButton: FC<ChatButtonProps> = ({ img, roomGuest, isChatOpened, setIsChatOpened }) => {
  return (
    <button
      disabled={roomGuest ? false : true}
      className={style.button}
      onClick={() => setIsChatOpened(!isChatOpened)}
    >
      <img className={style.img} src={img} alt="chat" />
    </button>
  );
};

export default ChatButton;
