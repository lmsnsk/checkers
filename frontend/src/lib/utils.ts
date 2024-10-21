export const clearTempCheckers = (field: number[][]) => {
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      if (field[y][x] === 9) field[y][x] = 0;
    }
  }
};

export const getFromLocalStorage = (key: string) => {
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(key);
  }
};

export const setToLocalStorage = (key: string, value: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const removeFromLocalStorage = (key: string) => {
  if (typeof localStorage !== "undefined") {
    localStorage.removeItem(key);
  }
};
