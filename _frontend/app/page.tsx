"use client";

import { RoomsList } from "@/components/rooms-list";
import { useSocket } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [imgSize, setImgSize] = useState(100);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [roomList, setRoomlist] = useState<any>([]);

  const socket = useSocket();

  const send = (nickname: string) => {
    if (socket) {
      socket.send(
        JSON.stringify({ action: "create_room", nickname, piece_type: "white" })
      );
    }
  };

  const join = (nickname: string, id: number) => {
    if (socket) {
      socket.send(JSON.stringify({ action: "join_room", nickname, id }));
    }
  };

  if (socket) {
    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);

      console.log(data);

      switch (data.action) {
        case "create_room":
          setRoomlist(
            data.rooms.map((room: any) => ({
              id: room.id,
              name: room.name,
              players: room.players.length,
            }))
          );
          break;
        case "to_room":
          window.location.pathname = "/room/";
          break;
      }
    };
  }

  useEffect(() => {
    if (socket) {
      socket.onclose = () => {
        console.log("Подключение прервано");
      };
    }
    return () => {
      socket?.close();
      console.log("Подключение окончено");
    };
  }, [socket]);

  useEffect(() => {
    const isMobile = () => {
      let mobile = false;
      if (window.innerWidth < 768 || window.innerHeight < 768) {
        mobile = true;
      }
      return mobile;
    };
    const imgSizeCalc = () => {
      let size = 100;
      if (window.innerWidth < 768 || window.innerHeight < 768) {
        size = 70;
      }
      return size;
    };
    isMobile() ? setIsMobile(true) : setIsMobile(false);
    setImgSize(imgSizeCalc());
    const handleResize = () => {
      isMobile() ? setIsMobile(true) : setIsMobile(false);
      setImgSize(imgSizeCalc());
    };
    setIsLoading(true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      {isLoading && (
        <main className="w-screen flex flex-col items-center justify-center gap-4 py-6">
          <div className="flex flex-col gap-2 md:gap-4 justify-center items-center mb-3">
            <Image src="/log.svg" width={imgSize} height={imgSize} alt="logo" />
            <div className="flex flex-col items-center font-bold text-white">
              <span className={isMobile ? "text-4xl" : " md:text-6xl"}>
                CHECKERS
              </span>
              <span className={isMobile ? "text-2xl" : " md:text-4xl"}>
                ONLINE
              </span>
            </div>
          </div>
          <div
            className={cn(
              isMobile ? "w-[95%]" : "w-[600px]",
              "flex flex-col gap-2 md:gap-4"
            )}
          >
            <RoomsList
              isMobile={isMobile}
              send={send}
              join={join}
              roomList={roomList}
            />
          </div>
        </main>
      )}
    </>
  );
}
