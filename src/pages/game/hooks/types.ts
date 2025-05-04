export type CellPresetInfo = {
  isMine: boolean;
  howManyAdjoiningMines: number;
  y: number;
  x: number;
};

export type CellStatus = "INITIAL" | "FLAGGED" | "REVEALED";

export type CellView = "INITIAL" | "FLAGGED" | "BOOMED" | number;

export type LogicalPosition = {
  y: number;
  x: number;
};

export type Unit = "SQAURE" | "HEXAGON" | "TRIANGLE";
