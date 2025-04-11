import { createContext } from "react";
import useGame from "../../hooks/useGame";
import { S } from "./Board.style";
import Cell from "./Cell";
import { CellType } from "../../utils/generate";

export const GameContext = createContext<{
  flagToggleHandler: (y: number, x: number) => void;
  openCellHandler: (y: number, x: number) => void;
  board: CellType[][];
}>({
  flagToggleHandler: () => {},
  openCellHandler: () => {},
  board: [],
});

const Board = () => {
  const { board, colCount, rowCount, flagToggleHandler, openCellHandler } =
    useGame({});

  return (
    <GameContext.Provider value={{ flagToggleHandler, openCellHandler, board }}>
      <S.GridContainer rowCount={rowCount} colCount={colCount}>
        {board.map((row, y) =>
          row.map((_, x) => <Cell y={y} x={x} key={`${y}-${x}`} />)
        )}
      </S.GridContainer>
    </GameContext.Provider>
  );
};

export default Board;
