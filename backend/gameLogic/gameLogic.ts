import { Coord, FigureKind } from "../lib/types";

export const clearTempCheckers = (field: FigureKind[][]) => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (field[y][x] === FigureKind.POSSIBLE_TURN) {
        field[y][x] = FigureKind.EMPTY;
      }
    }
  }
};

const checkFreeMove = (field: FigureKind[][], x: number, y: number) => {
  if (y === 0) return;
  if (x > 0 && field[y - 1][x - 1] === FigureKind.EMPTY) {
    field[y - 1][x - 1] = FigureKind.POSSIBLE_TURN;
  }
  if (x < 7 && field[y - 1][x + 1] === FigureKind.EMPTY) {
    field[y - 1][x + 1] = FigureKind.POSSIBLE_TURN;
  }
};

const checkFreeKingMove = (field: FigureKind[][], x: number, y: number) => {
  for (let i = 1; x - i >= 0 && y - i >= 0 && field[y - i][x - i] === FigureKind.EMPTY; i++) {
    field[y - i][x - i] = FigureKind.POSSIBLE_TURN;
  }
  for (let i = 1; x + i <= 7 && y - i >= 0 && field[y - i][x + i] === FigureKind.EMPTY; i++) {
    field[y - i][x + i] = FigureKind.POSSIBLE_TURN;
  }
  for (let i = 1; x - i >= 0 && y + i <= 7 && field[y + i][x - i] === FigureKind.EMPTY; i++) {
    field[y + i][x - i] = FigureKind.POSSIBLE_TURN;
  }
  for (let i = 1; x + i <= 7 && y + i <= 7 && field[y + i][x + i] === FigureKind.EMPTY; i++) {
    field[y + i][x + i] = FigureKind.POSSIBLE_TURN;
  }
};

const checkFightMove = (field: FigureKind[][], x: number, y: number): boolean => {
  const enemy =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.BLACK
      : FigureKind.WHITE;
  const enemyKing =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.BLACK_KING
      : FigureKind.WHITE_KING;

  let isFighting = false;

  if (
    (field[y - 1][x - 1] === enemy || field[y - 1][x - 1] === enemyKing) &&
    y - 2 >= 0 &&
    field[y - 2][x - 2] === FigureKind.EMPTY
  ) {
    field[y - 2][x - 2] = FigureKind.POSSIBLE_TURN;
    isFighting = true;
  }

  if (
    (field[y - 1][x + 1] === enemy || field[y - 1][x + 1] === enemyKing) &&
    y - 2 >= 0 &&
    field[y - 2][x + 2] === FigureKind.EMPTY
  ) {
    field[y - 2][x + 2] = FigureKind.POSSIBLE_TURN;
    isFighting = true;
  }

  if (
    ((y < 6 && field[y + 1][x - 1] === enemy) || (y < 6 && field[y + 1][x - 1] === enemyKing)) &&
    field[y + 2][x - 2] === FigureKind.EMPTY
  ) {
    field[y + 2][x - 2] = FigureKind.POSSIBLE_TURN;
    isFighting = true;
  }

  if (
    ((y < 6 && field[y + 1][x + 1] === enemy) || (y < 6 && field[y + 1][x + 1] === enemyKing)) &&
    field[y + 2][x + 2] === FigureKind.EMPTY
  ) {
    field[y + 2][x + 2] = FigureKind.POSSIBLE_TURN;
    isFighting = true;
  }
  return isFighting;
};

const checkFightKingMove = (field: FigureKind[][], x: number, y: number): boolean => {
  const enemy =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.BLACK
      : FigureKind.WHITE;
  const enemyKing =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.BLACK_KING
      : FigureKind.WHITE_KING;

  const player =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.WHITE
      : FigureKind.BLACK;
  const playerKing =
    field[y][x] === (FigureKind.WHITE || FigureKind.WHITE_KING)
      ? FigureKind.WHITE_KING
      : FigureKind.BLACK_KING;

  let isFighting = false;
  let firstCheck = false;

  let i = 1;
  while (y - i >= 0 && x - i >= 0) {
    if (field[y - i][x - i] === player || field[y - i][x - i] === playerKing) break;
    if (field[y - i][x - i] === 0) field[y - i][x - i] = 9;
    if (field[y - i][x - i] === enemy || field[y - i][x - i] === enemyKing) {
      if (!firstCheck && y - i > 0 && field[y - i - 1][x - i - 1] === 0) {
        clearTempCheckers(field);
        firstCheck = true;
        isFighting = true;
      } else {
        break;
      }
    }
    i++;
  }
  return isFighting;
};

const checkNextMove = (field: FigureKind[][], x: number, y: number, isKing: boolean) => {
  if (isKing) {
    if (!checkFightKingMove(field, x, y)) checkFreeKingMove(field, x, y);
  } else {
    if (!checkFightMove(field, x, y)) checkFreeMove(field, x, y);
  }
};

export const firstFieldClick = (coord: Coord, field: FigureKind[][], isCreator: boolean) => {
  if (
    isCreator
      ? field[coord.y][coord.x] === FigureKind.WHITE ||
        field[coord.y][coord.x] === FigureKind.WHITE_KING
      : field[coord.y][coord.x] === FigureKind.BLACK ||
        field[coord.y][coord.x] === FigureKind.BLACK_KING
  ) {
    console.log("cool!");
    clearTempCheckers(field);
    checkNextMove(field, coord.x, coord.y, true); // проверка дамки
    return true;
  }
  return false;
};
