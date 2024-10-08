import { Coord, FigureKind, GameState, Session } from "../lib/types";

const isKing = (field: FigureKind[][], coord: Coord) => {
  return (
    field[coord.y][coord.x] === FigureKind.WHITE_KING ||
    field[coord.y][coord.x] === FigureKind.BLACK_KING
  );
};

const isWhite = (field: FigureKind[][], coord: Coord) => {
  return (
    field[coord.y][coord.x] === FigureKind.WHITE ||
    field[coord.y][coord.x] === FigureKind.WHITE_KING
  );
};

const isBlack = (field: FigureKind[][], coord: Coord) => {
  return (
    field[coord.y][coord.x] === FigureKind.BLACK ||
    field[coord.y][coord.x] === FigureKind.BLACK_KING
  );
};

const clearTempCheckers = (field: FigureKind[][]) => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (field[y][x] === FigureKind.POSSIBLE_TURN) {
        field[y][x] = FigureKind.EMPTY;
      }
    }
  }
};

const checkFreeMove = (field: FigureKind[][], x: number, y: number) => {
  if (y === 0) return false;

  let isPossibleTurn = false;

  if (x > 0 && field[y - 1][x - 1] === FigureKind.EMPTY) {
    field[y - 1][x - 1] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }
  if (x < 7 && field[y - 1][x + 1] === FigureKind.EMPTY) {
    field[y - 1][x + 1] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }
  return isPossibleTurn;
};

const checkFreeKingMove = (field: FigureKind[][], x: number, y: number) => {
  let isPossibleTurn = false;

  for (let i = 1; x - i >= 0 && y - i >= 0 && field[y - i][x - i] === FigureKind.EMPTY; i++) {
    field[y - i][x - i] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }

  for (let i = 1; x + i <= 7 && y - i >= 0 && field[y - i][x + i] === FigureKind.EMPTY; i++) {
    field[y - i][x + i] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }

  for (let i = 1; x - i >= 0 && y + i <= 7 && field[y + i][x - i] === FigureKind.EMPTY; i++) {
    field[y + i][x - i] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }

  for (let i = 1; x + i <= 7 && y + i <= 7 && field[y + i][x + i] === FigureKind.EMPTY; i++) {
    field[y + i][x + i] = FigureKind.POSSIBLE_TURN;
    isPossibleTurn = true;
  }

  return isPossibleTurn;
};

const checkFightMove = (
  gameState: GameState,
  x: number,
  y: number,
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigureKind.BLACK : FigureKind.WHITE;
  const enemyKing = isCreator ? FigureKind.BLACK_KING : FigureKind.WHITE_KING;

  const field = gameState.field;

  let isFighting = false;

  if (
    (field[y - 1][x - 1] === enemy || field[y - 1][x - 1] === enemyKing) &&
    y - 2 >= 0 &&
    field[y - 2][x - 2] === FigureKind.EMPTY
  ) {
    field[y - 2][x - 2] = FigureKind.POSSIBLE_TURN;

    const possibleTurns = [{ x: x - 2, y: y - 2 }];
    gameState.eatVariants.push({ checkerForEat: { x: x - 1, y: y - 1 }, possibleTurns });

    isFighting = true;
  }

  if (
    (field[y - 1][x + 1] === enemy || field[y - 1][x + 1] === enemyKing) &&
    y - 2 >= 0 &&
    field[y - 2][x + 2] === FigureKind.EMPTY
  ) {
    field[y - 2][x + 2] = FigureKind.POSSIBLE_TURN;

    const possibleTurns = [{ x: x + 2, y: y - 2 }];
    gameState.eatVariants.push({ checkerForEat: { x: x + 1, y: y - 1 }, possibleTurns });

    isFighting = true;
  }

  if (
    ((y < 6 && field[y + 1][x - 1] === enemy) || (y < 6 && field[y + 1][x - 1] === enemyKing)) &&
    field[y + 2][x - 2] === FigureKind.EMPTY
  ) {
    field[y + 2][x - 2] = FigureKind.POSSIBLE_TURN;

    const possibleTurns = [{ x: x - 2, y: y + 2 }];
    gameState.eatVariants.push({ checkerForEat: { x: x - 1, y: y + 1 }, possibleTurns });

    isFighting = true;
  }

  if (
    ((y < 6 && field[y + 1][x + 1] === enemy) || (y < 6 && field[y + 1][x + 1] === enemyKing)) &&
    field[y + 2][x + 2] === FigureKind.EMPTY
  ) {
    field[y + 2][x + 2] = FigureKind.POSSIBLE_TURN;

    const possibleTurns = [{ x: x + 2, y: y + 2 }];
    gameState.eatVariants.push({ checkerForEat: { x: x + 1, y: y + 1 }, possibleTurns });

    isFighting = true;
  }
  return isFighting;
};

const checkFightKingMove = (
  gameState: GameState,
  x: number,
  y: number,
  isCreator: boolean
): boolean => {
  const enemy = isCreator ? FigureKind.BLACK : FigureKind.WHITE;
  const enemyKing = isCreator ? FigureKind.BLACK_KING : FigureKind.WHITE_KING;

  const player = isCreator ? FigureKind.WHITE : FigureKind.BLACK;
  const playerKing = isCreator ? FigureKind.WHITE_KING : FigureKind.BLACK_KING;

  const field = gameState.field;

  let isFighting = false;
  let firstCheck = false;

  let i = 1;
  while (y - i >= 0 && x - i >= 0) {
    if (field[y - i][x - i] === player || field[y - i][x - i] === playerKing) {
      break;
    }
    if (field[y - i][x - i] === FigureKind.EMPTY) {
      field[y - i][x - i] = FigureKind.POSSIBLE_TURN;
    }
    if (field[y - i][x - i] === enemy || field[y - i][x - i] === enemyKing) {
      if (!firstCheck && y - i > 0 && field[y - i - 1][x - i - 1] === FigureKind.EMPTY) {
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

const checkNextMove = (gameState: GameState, coord: Coord, isKing: boolean, isCreator: boolean) => {
  if (isKing) {
    if (!checkFightKingMove(gameState, coord.x, coord.y, isCreator)) {
      checkFreeKingMove(gameState.field, coord.x, coord.y);
    }
  } else {
    if (!checkFightMove(gameState, coord.x, coord.y, isCreator)) {
      checkFreeMove(gameState.field, coord.x, coord.y);
    }
  }
};

const eatEnemyChecker = (coords: Coord, gameState: GameState, isCreator: boolean) => {
  if (gameState.eatVariants.length === 0 || !gameState.firstClickCoords) return;

  for (let variant of gameState.eatVariants) {
    let checkEat = false;
    for (let el of variant.possibleTurns) {
      if (el.x === coords.x && el.y === coords.y) checkEat = true;
    }
    if (checkEat) {
      gameState.field[variant.checkerForEat.y][variant.checkerForEat.x] = FigureKind.EMPTY;
      isCreator ? gameState.whiteEated++ : gameState.blackEated++;
    }
  }
};

const checkVictoty = (gameState: GameState) => {
  if (gameState.whiteEated === 12) {
    gameState.winner = "creator";
  }
  if (gameState.blackEated === 12) {
    gameState.winner = "guest";
  }
};

export const turn = (coords: Coord, gameState: GameState, isCreator: boolean) => {
  const prevCoords = gameState.firstClickCoords;

  if (prevCoords && gameState.field[coords.y][coords.x] === FigureKind.POSSIBLE_TURN) {
    if (isCreator) {
      gameState.field[coords.y][coords.x] =
        gameState.field[prevCoords.y][prevCoords.x] === FigureKind.WHITE_KING
          ? FigureKind.WHITE_KING
          : FigureKind.WHITE;
    } else {
      gameState.field[coords.y][coords.x] =
        gameState.field[prevCoords.y][prevCoords.x] === FigureKind.BLACK_KING
          ? FigureKind.BLACK_KING
          : FigureKind.BLACK;
    }

    if (coords.y === 0) {
      gameState.field[coords.y][coords.x] = isCreator
        ? FigureKind.WHITE_KING
        : FigureKind.BLACK_KING;
    }

    gameState.field[prevCoords.y][prevCoords.x] = FigureKind.EMPTY;
    eatEnemyChecker(coords, gameState, isCreator);
    clearTempCheckers(gameState.field);
    checkVictoty(gameState);
    gameState.eatVariants = [];
    gameState.firstClickCoords = undefined;

    return true;
  }
  return false;
};

export const fieldClick = (coords: Coord, gameState: GameState, isCreator: boolean) => {
  if (isCreator ? isWhite(gameState.field, coords) : isBlack(gameState.field, coords)) {
    clearTempCheckers(gameState.field); // ?
    checkNextMove(gameState, coords, isKing(gameState.field, coords), isCreator);
    return true;
  }
  return false;
};
