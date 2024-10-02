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

export const reverseCoordinates = (coordinates: { x: number; y: number }) => {
  return { x: 7 - coordinates.y, y: 7 - coordinates.x };
};
