import { FC } from "react";

import { useCheckerStore } from "../store/store";

import style from "./ChatButton.module.scss";

interface ChatButtonProps {
  img: string;
  roomGuest: string;
  isChatOpened: boolean;
  showCounter: boolean;
  setIsChatOpened: (isChatOpened: boolean) => void;
}

const ChatButton: FC<ChatButtonProps> = ({
  img,
  roomGuest,
  isChatOpened,
  showCounter,
  setIsChatOpened,
}) => {
  const { unreadMessages, setUnreadMessages } = useCheckerStore();

  const onButtonClickHandler = () => {
    if (unreadMessages > 0 && isChatOpened) {
      setUnreadMessages(0);
    }
    window.scrollTo(0, 0); // ! check!
    setIsChatOpened(!isChatOpened);
  };

  return (
    <button
      disabled={roomGuest ? false : true}
      className={style.button}
      onClick={onButtonClickHandler}
    >
      <img className={style.img} src={img} alt="chat" />
      {unreadMessages > 0 && showCounter && <span className={style.counter}>{unreadMessages}</span>}
    </button>
  );
};

export default ChatButton;
