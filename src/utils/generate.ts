export type PreconfiguredCellInfo = {
  isMine: boolean;
    howManyAdjoiningMines: number;
};

// 위 두개를 조합해서 만들어내는 것
export type ViewStatus = "INITIAL" | "BOOMED" | "FLAGGED" | number;

// export const convert1dTo2d = (
//   origin: Dimension1,
//   colCount: number
// ): Dimension2 => [Math.floor(origin / colCount), origin % colCount];

// export const convert2dTo1d = (origin: Dimension2, rowCount: number) =>
//   origin[0] * rowCount + origin[1];
