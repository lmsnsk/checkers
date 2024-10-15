import { Checker, FigKind } from "./types";

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

const initialField: FigKind[][] = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 2, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 2, 0, 0, 0],
  [0, 0, 0, 0, 0, 1, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];
// const initialField: FigKind[][] = [
//   [0, 2, 0, 2, 0, 2, 0, 2],
//   [2, 0, 2, 0, 2, 0, 2, 0],
//   [0, 2, 0, 2, 0, 2, 0, 2],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 0, 1, 0, 1, 0, 1, 0],
//   [0, 1, 0, 1, 0, 1, 0, 1],
//   [1, 0, 1, 0, 1, 0, 1, 0],
// ];

export const startField = () => {
  const checkers: Checker[] = [];
  let id = 0;

  initialField.forEach((row, indexY) => {
    row.forEach((el, indexX) => {
      if (el === 0) return;
      checkers.push(new Checker(id++, indexX, indexY, el === 1 ? "white" : "black"));
    });
  });

  // for (let k = 0; k < 3; k++) {
  //   for (let i = 0; i < 4; i++) {
  //     checkers.push(new Checker(id++, k === 1 ? i * 2 + 1 : i * 2, k, "black"));
  //     checkers.push(new Checker(id++, k === 1 ? i * 2 : i * 2 + 1, k + 5, "white"));
  //   }
  // }

  return checkers;
};
