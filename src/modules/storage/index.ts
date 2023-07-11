export const getLocalStorage = (key: string): any => {
  if (typeof window !== "undefined") {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  }
};
