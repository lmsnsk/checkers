import { coordinates } from "./../connection/game";
import { Checker, Coord, FigKind, GameState, PossibleTurns } from "../lib/types";

export const createField = (checkers: Checker[]): FigKind[][] => {
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

export const checkFightMove = (
  gameState: GameState,
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black",
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigKind.BLACK : FigKind.WHITE;
  let isFighting = false;
  const { x, y, id: checkerId } = checker;

  if (y - 2 >= 0 && x - 2 >= 0 && field[y - 1][x - 1] === enemy && field[y - 2][x - 2] === 0) {
    gameState.possibleTurns.push({ x: x - 2, y: y - 2, checkerId, color, isKing: false });
    gameState.enemiesForEat.push({ x: x - 1, y: y - 1 });
    isFighting = true;
  }

  if (y - 2 >= 0 && x < 6 && field[y - 1][x + 1] === enemy && field[y - 2][x + 2] === 0) {
    gameState.possibleTurns.push({ x: x + 2, y: y - 2, checkerId, color, isKing: false });
    gameState.enemiesForEat.push({ x: x + 1, y: y - 1 });
    isFighting = true;
  }

  if (y < 6 && x - 2 >= 0 && field[y + 1][x - 1] === enemy && field[y + 2][x - 2] === 0) {
    gameState.possibleTurns.push({ x: x - 2, y: y + 2, checkerId, color, isKing: false });
    gameState.enemiesForEat.push({ x: x - 1, y: y + 1 });
    isFighting = true;
  }

  if (y < 6 && x < 6 && field[y + 1][x + 1] === enemy && field[y + 2][x + 2] === 0) {
    gameState.possibleTurns.push({ x: x + 2, y: y + 2, checkerId, color, isKing: false });
    gameState.enemiesForEat.push({ x: x + 1, y: y + 1 });
    isFighting = true;
  }

  return isFighting;
};

export const checkFightKingMove = (
  gameState: GameState,
  field: FigKind[][],
  checker: Checker,
  color: "white" | "black",
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigKind.BLACK : FigKind.WHITE;
  const player = isCreator ? FigKind.WHITE : FigKind.BLACK;

  let isFighting = false;
  const { x, y, id: checkerId } = checker;

  const oneDirectionChecker = (direction: "lt" | "rt" | "lb" | "rb") => {
    let firstCheck = true;
    const ked = gameState.kingEatDirection;

    if (
      (ked === "lb" && direction === "rt") ||
      (ked === "lt" && direction === "rb") ||
      (ked === "rb" && direction === "lt") ||
      (ked === "rt" && direction === "lb")
    ) {
      return;
    }

    for (
      let i = 1;
      (direction === "lt" || direction === "rt" ? y - i >= 0 : y + i <= 7) &&
      (direction === "lt" || direction === "lb" ? x - i >= 0 : x + i <= 7);
      i++
    ) {
      const xx = direction === "lt" || direction === "lb" ? x - i : x + i;
      const yy = direction === "lt" || direction === "rt" ? y - i : y + i;

      if (field[yy][xx] === player || (!firstCheck && field[yy][xx] === enemy)) break;

      if (!firstCheck) {
        gameState.possibleTurns.push({
          x: xx,
          y: yy,
          checkerId,
          color,
          isKing: true,
        });
      }

      if (
        (direction === "lt" || direction === "rt" ? y - i > 0 : y + i <= 6) &&
        (direction === "lt" || direction === "lb" ? x - i > 0 : x + i <= 6) &&
        field[yy][xx] === enemy
      ) {
        if (
          field[direction === "lt" || direction === "rt" ? y - i - 1 : y + i + 1][
            direction === "lt" || direction === "lb" ? x - i - 1 : x + i + 1
          ] === FigKind.EMPTY
        ) {
          gameState.enemiesForEat.push({ x: xx, y: yy });
          firstCheck = false;
          isFighting = true;
        } else {
          break;
        }
      }
    }
  };

  oneDirectionChecker("lt");
  oneDirectionChecker("rt");
  oneDirectionChecker("lb");
  oneDirectionChecker("rb");

  return isFighting;
};

const eatChecker = (gameState: GameState, checker: Checker, coord: Coord) => {
  let direction: "lt" | "rt" | "lb" | "rb";

  if (coord.x > checker.x && coord.y > checker.y) direction = "rb";
  else if (coord.x < checker.x && coord.y < checker.y) direction = "lt";
  else if (coord.x > checker.x && coord.y < checker.y) direction = "rt";
  else direction = "lb";

  gameState.kingEatDirection = direction;

  for (const enemy of gameState.enemiesForEat) {
    if (
      (direction === "rb" && enemy.x > checker.x && enemy.y > checker.y) ||
      (direction === "lt" && enemy.x < checker.x && enemy.y < checker.y) ||
      (direction === "rt" && enemy.x > checker.x && enemy.y < checker.y) ||
      (direction === "lb" && enemy.x < checker.x && enemy.y > checker.y)
    ) {
      gameState.checkers = gameState.checkers.filter(
        (checker) => !(checker.x === enemy.x && checker.y === enemy.y)
      );
    }
  }
};

const checkKing = (checker: Checker) => {
  if (checker.y === 0) checker.becomeKing();
};

export const checkPossibleMoves = (
  gameState: GameState,
  color: "white" | "black",
  isCreator: boolean
) => {
  const field = createField(gameState.checkers);

  for (let checker of gameState.checkers) {
    if (checker.color !== color) continue;

    if (!checker.isKing) {
      if (checkFightMove(gameState, field, checker, color, isCreator)) {
        checker.canMove = true;
        gameState.needToEat = true;
      }
    } else {
      if (checkFightKingMove(gameState, field, checker, color, isCreator)) {
        checker.canMove = true;
        gameState.needToEat = true;
      }
    }
  }

  if (gameState.needToEat) return;

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
      let checkCorrectClick = false;

      for (const turn of gameState.possibleTurns) {
        if (turn.checkerId === checker.id) {
          checkCorrectClick = true;
        }
      }

      if (!checkCorrectClick) return false;

      gameState.possibleTurns = gameState.possibleTurns.filter(
        (turn) => turn.checkerId === checker.id
      );
      checker.isChosen = true;
      resetCanMove(gameState.checkers);

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
      if (gameState.needToEat) {
        eatChecker(gameState, checker, coord);
        gameState.checkerAdditionalMove = checker;
      }

      checker.move(coord.x, coord.y);
      checkKing(checker);

      gameState.possibleTurns = [];
      gameState.enemiesForEat = [];

      return true;
    }
  }
  return false;
};

export const checkWinner = (gameState: GameState) => {
  if (gameState.checkers.filter((checker) => checker.color === "white").length === 0) {
    gameState.winner = "guest";
  }
  if (gameState.checkers.filter((checker) => checker.color === "black").length === 0) {
    gameState.winner = "creator";
  }
};
