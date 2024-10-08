import { coordinates } from "./../connection/game";
import { Checker, Coord, FigKind, GameState, PossibleTurns } from "../lib/types";

const createField = (checkers: Checker[]): FigKind[][] => {
  const arr: FigKind[][] = new Array(8).fill(0).map(() => new Array(8).fill(0));
  for (let checker of checkers) {
    arr[checker.y][checker.x] = checker.color === "white" ? FigKind.WHITE : FigKind.BLACK;
  }
  return arr;
};

export const resetCanMove = (checkers: Checker[]): void => {
  for (let checker of checkers) {
    if (checker.canMove) checker.canMove = false;
  }
};

const checkFreeMove = (field: FigKind[][], x: number, y: number): boolean => {
  if (y === 0) return false;

  let isPossibleTurn = false;
  if (x > 0 && !field[y - 1][x - 1]) isPossibleTurn = true;
  if (x < 7 && !field[y - 1][x + 1]) isPossibleTurn = true;

  return isPossibleTurn;
};

const checkFreeKingMove = (field: FigKind[][], x: number, y: number): boolean => {
  let isPossibleTurn = false;

  for (let i = 1; x - i >= 0 && y - i >= 0 && field[y - i][x - i] === 0; i++) {
    isPossibleTurn = true;
  }
  for (let i = 1; x + i <= 7 && y - i >= 0 && field[y - i][x + i] === 0; i++) {
    isPossibleTurn = true;
  }
  for (let i = 1; x - i >= 0 && y + i <= 7 && field[y + i][x - i] === 0; i++) {
    isPossibleTurn = true;
  }
  for (let i = 1; x + i <= 7 && y + i <= 7 && field[y + i][x + i] === 0; i++) {
    isPossibleTurn = true;
  }

  return isPossibleTurn;
};

const checkFightMove = (
  possibleTurns: PossibleTurns[],
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black",
  isKing: boolean,
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigKind.BLACK : FigKind.WHITE;
  let isFighting = false;
  const { x, y, id: checkerId } = checker;

  if (field[y - 1][x - 1] === enemy && y - 2 >= 0 && field[y - 2][x - 2] === 0) {
    possibleTurns.push({ x: x - 2, y: y - 2, checkerId, color, isKing });
    isFighting = true;
  }

  if (field[y - 1][x + 1] === enemy && y - 2 >= 0 && field[y - 2][x + 2] === 0) {
    possibleTurns.push({ x: x + 2, y: y - 2, checkerId, color, isKing });
    isFighting = true;
  }

  if (((y < 6 && field[y + 1][x - 1] === enemy) || y < 6) && field[y + 2][x - 2] === 0) {
    possibleTurns.push({ x: x - 2, y: y + 2, checkerId, color, isKing });
    isFighting = true;
  }

  if (((y < 6 && field[y + 1][x + 1] === enemy) || y < 6) && field[y + 2][x + 2] === 0) {
    possibleTurns.push({ x: x + 2, y: y + 2, checkerId, color, isKing });
    isFighting = true;
  }
  return isFighting;
};

const checkFightKingMove = (
  possibleTurns: PossibleTurns[],
  field: FigKind[][],
  checker: Checker,
  isCreator: boolean
) => {
  return false; ///////////////////
};

export const checkPossibleMoves = (
  gameState: GameState,
  color: "white" | "black",
  isCreator: boolean
) => {
  const field = createField(gameState.checkers);
  let eatFlag = false;

  for (let checker of gameState.checkers) {
    if (checker.color !== color) continue;

    if (!checker.isKing) {
      if (checkFightMove(gameState.possibleTurns, field, checker, color, false, isCreator)) {
        checker.canMove = true;
        eatFlag = true;
      }
    } else {
      if (checkFightKingMove(gameState.possibleTurns, field, checker, isCreator)) {
        checker.canMove = true;
        eatFlag = true;
      }
    }
  }

  if (eatFlag) return;

  for (let checker of gameState.checkers) {
    if (checker.color !== color) continue;

    if (!checker.isKing) {
      if (checkFreeMove(field, checker.x, checker.y)) {
        checker.canMove = true;
      }
    } else {
      if (checkFreeKingMove(field, checker.x, checker.y)) {
        checker.canMove = true;
      }
    }
  }
};

export const firstClickRealization = (coord: Coord, gameState: GameState) => {
  for (const checker of gameState.checkers) {
    if (checker.x === coord.x && checker.y === coord.y) {
      checker.isChosen = true;
      gameState.possibleTurns = gameState.possibleTurns.filter(
        (turn) => turn.checkerId === checker.id
      );
      gameState.showPossibleTurns = true;
    }
  }
};
