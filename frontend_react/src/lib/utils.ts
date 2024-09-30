export const clearTempCheckers = (field: number[][]) => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (field[y][x] === 9) field[y][x] = 0;
    }
  }
};
