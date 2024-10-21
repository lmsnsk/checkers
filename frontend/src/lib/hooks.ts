import { useEffect, useState } from "react";
import { useCheckerStore } from "../store/store";
import { getFromLocalStorage } from "./utils";

export const useSocket = (setNoServerConnection: (noServerConnection: boolean) => void) => {
  const { socket, setSocket } = useCheckerStore();

  useEffect(() => {
    // const newSocket = new WebSocket("ws://193.227.240.131:8888/ws/checkers");
    const newSocket = new WebSocket("ws://localhost:8888/ws/checkers");
    setSocket(newSocket);

    const userId = getFromLocalStorage("userId_checkers_game");

    newSocket.onopen = () => {
      console.log("Подключение установлено");
      setNoServerConnection(false);
      newSocket.send(JSON.stringify({ action: "check_userId", userId }));
    };
  }, [setSocket, setNoServerConnection]);

  return socket;
};

export const useSound = (audioSource: string) => {
  const [audioBuffer, setAudioBuffer] = useState<AudioBuffer | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  useEffect(() => {
    const context = new AudioContext();
    setAudioContext(context);

    const getAudio = async () => {
      try {
        const response = await fetch(audioSource);
        const arrayBuffer = await response.arrayBuffer();
        const buffer = await context.decodeAudioData(arrayBuffer);
        setAudioBuffer(buffer);
      } catch (error) {
        console.error("Ошибка при загрузке звука:", error);
      }
    };
    getAudio();

    return () => {
      context.close();
    };
  }, [audioSource]);

  const playSound = () => {
    if (audioContext && audioBuffer) {
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  };

  return playSound;
};
