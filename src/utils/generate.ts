export type ViewStatus = "INITIAL" | "BOOMED" | "FLAGGED" | number;

export type CellType = {
  isMine: boolean;
  viewStatus: ViewStatus;
};

export const getEmptyBoard = (rowCount: number, colCount: number) =>
  Array(rowCount).fill(
    Array(colCount).fill({
      isMine: false,
      viewStatus: "INITIAL",
    })
  ) as CellType[][];

export type Dimension1 = number;

export type Dimension2 = [number, number];

export const convert1dTo2d = (
  origin: Dimension1,
  rowCount: number
): Dimension2 => [Math.floor(origin / rowCount), origin % rowCount];

export const convert2dTo1d = (origin: Dimension2, rowCount: number) =>
  origin[0] * rowCount + origin[1];
