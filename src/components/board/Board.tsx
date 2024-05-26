import { CellType } from "../../game/generate";
import { S } from "./Board.style";
import Cell from "./Cell";

const Board = ({
  board,
  onClickCell,
  rowCount,
  colCount,
  flagHandler,
}: {
  board: CellType[][];
  flagHandler: (y: number, x: number) => void;
  onClickCell: (y: number, x: number) => void;
  rowCount: number;
  colCount: number;
}) => {
  return (
    <S.GridContainer rowCount={rowCount} colCount={colCount}>
      {board.map((row, y) =>
        row.map(({ viewStatus }, x) => (
          <Cell
            onClickRight={(e) => {
              e.preventDefault();
              flagHandler(y, x);
            }}
            key={`${y}-${x}`}
            onClick={() => onClickCell(y, x)}
            viewStatus={viewStatus}
          />
        ))
      )}
    </S.GridContainer>
  );
};

export default Board;
