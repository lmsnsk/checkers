import { FigKind } from "./types";

let userCounter = 0;

export const userIdGenerator = () => {
  return userCounter++;
};

export const dateToString = () => {
  return new Date().toLocaleTimeString("ru", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const reverseField = (field: number[][]): number[][] => {
  return field.map((row) => [...row].reverse()).reverse();
};

// export const startField: FigureKind[][] = [
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 2, 0, 2, 0, 0],
//   [0, 0, 0, 0, 3, 0, 0, 0],
//   [0, 0, 0, 2, 0, 2, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
// ];

export const initialField: FigKind[][] = [
  [0, 2, 0, 2, 0, 2, 0, 2],
  [2, 0, 2, 0, 2, 0, 2, 0],
  [0, 2, 0, 2, 0, 2, 0, 2],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 2, 0, 0, 0, 0],
  [1, 0, 1, 0, 1, 0, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0],
];
