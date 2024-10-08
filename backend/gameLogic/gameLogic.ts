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

export const resetChosen = (checkers: Checker[]): void => {
  for (let checker of checkers) {
    if (checker.isChosen) checker.isChosen = false;
  }
};

const checkFreeMove = (
  possibleTurns: PossibleTurns[],
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black"
): boolean => {
  if (checker.y === 0) return false;

  let isPossibleTurn = false;
  const { x, y, id: checkerId } = checker;

  if (x > 0 && !field[y - 1][x - 1]) {
    possibleTurns.push({ x: x - 1, y: y - 1, checkerId, color, isKing: false });
    isPossibleTurn = true;
  }
  if (x < 7 && !field[y - 1][x + 1]) {
    possibleTurns.push({ x: x + 1, y: y - 1, checkerId, color, isKing: false });
    isPossibleTurn = true;
  }

  return isPossibleTurn;
};

const checkFreeKingMove = (
  possibleTurns: PossibleTurns[],
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black"
): boolean => {
  let isPossibleTurn = false;
  const { x, y, id: checkerId } = checker;

  for (let i = 1; x - i >= 0 && y - i >= 0 && field[y - i][x - i] === 0; i++) {
    possibleTurns.push({ x: x - i, y: y - i, checkerId, color, isKing: true });
    isPossibleTurn = true;
  }
  for (let i = 1; x + i <= 7 && y - i >= 0 && field[y - i][x + i] === 0; i++) {
    possibleTurns.push({ x: x + i, y: y - i, checkerId, color, isKing: true });
    isPossibleTurn = true;
  }
  for (let i = 1; x - i >= 0 && y + i <= 7 && field[y + i][x - i] === 0; i++) {
    possibleTurns.push({ x: x - i, y: y + i, checkerId, color, isKing: true });
    isPossibleTurn = true;
  }
  for (let i = 1; x + i <= 7 && y + i <= 7 && field[y + i][x + i] === 0; i++) {
    possibleTurns.push({ x: x + i, y: y + i, checkerId, color, isKing: true });
    isPossibleTurn = true;
  }

  return isPossibleTurn;
};

const checkFightMove = (
  possibleTurns: PossibleTurns[],
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black",
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigKind.BLACK : FigKind.WHITE;
  let isFighting = false;
  const { x, y, id: checkerId } = checker;

  if (field[y - 1][x - 1] === enemy && y - 2 >= 0 && field[y - 2][x - 2] === 0) {
    possibleTurns.push({ x: x - 2, y: y - 2, checkerId, color, isKing: false });
    isFighting = true;
  }

  if (field[y - 1][x + 1] === enemy && y - 2 >= 0 && field[y - 2][x + 2] === 0) {
    possibleTurns.push({ x: x + 2, y: y - 2, checkerId, color, isKing: false });
    isFighting = true;
  }

  if (((y < 6 && field[y + 1][x - 1] === enemy) || y < 6) && field[y + 2][x - 2] === 0) {
    possibleTurns.push({ x: x - 2, y: y + 2, checkerId, color, isKing: false });
    isFighting = true;
  }

  if (((y < 6 && field[y + 1][x + 1] === enemy) || y < 6) && field[y + 2][x + 2] === 0) {
    possibleTurns.push({ x: x + 2, y: y + 2, checkerId, color, isKing: false });
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
      if (checkFightMove(gameState.possibleTurns, field, checker, color, isCreator)) {
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
      if (checkFreeMove(gameState.possibleTurns, field, checker, color)) {
        checker.canMove = true;
      }
    } else {
      if (checkFreeKingMove(gameState.possibleTurns, field, checker, color)) {
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
      gameState.firstClickDone = true;
      return true;
    }
  }
  return false;
};

export const move = (coord: Coord, gameState: GameState) => {
  let checkCorrectClock = false;

  for (const turn of gameState.possibleTurns) {
    if (turn.x === coord.x && turn.y === coord.y) {
      checkCorrectClock = true;
    }
  }

  if (!checkCorrectClock) return false;

  for (const checker of gameState.checkers) {
    if (checker.isChosen) {
      checker.move(coord.x, coord.y);
      gameState.showPossibleTurns = false;
      gameState.possibleTurns = [];
      gameState.firstClickDone = false;
      gameState.turn = gameState.turn === "creator" ? "guest" : "creator";
      return true;
    }
  }
  return false;
};
