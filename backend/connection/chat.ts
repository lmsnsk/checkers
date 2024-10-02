import { dateToString } from "../lib/helpers";
import { Session } from "../lib/types";

export const messages = (data: any, sessions: Session[]) => {
  sessions.forEach((session) => {
    const creator = session.players.creator;
    const guest = session.players.guest;

    if (data.nickname === creator.nickname || data.nickname === guest?.nickname) {
      session.chat.push({ nickname: data.nickname, date: dateToString(), text: data.text });
      creator.ws.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
      guest?.ws?.send(JSON.stringify({ action: "chat_message", chat: session.chat }));
    }
  });
};
