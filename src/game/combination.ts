const getSuffledArray = <Item>(array: Item[]): Item[] => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }

  return array;
};

export const pickMinePos = <Item>(candidates: Item[], count: number): Item[] =>
  getSuffledArray(candidates).slice(0, count);

export const range = (start: number, end: number) =>
  Array.from({ length: end - start }, (_, i) => i + start);
