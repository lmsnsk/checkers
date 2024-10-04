import { Room, Session, User } from "../lib/types";

export const rooms: Room[] = [];
export const sessions: Session[] = [];
export const users = new Map<number, User>();
