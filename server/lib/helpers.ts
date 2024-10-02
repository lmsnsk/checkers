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
