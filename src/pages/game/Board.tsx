import { useAtomValue } from "jotai";
import { S } from "./Board.style";
import Cell from "./Cell";
import { initialSettingAtom } from "../../hooks/useGame";

const Board = () => {
  const { hztSize, vtSize } = useAtomValue(initialSettingAtom);

  return (
    <S.GridContainer vtSize={vtSize} hztSize={hztSize}>
      {/* {board.map((row, y) =>
        row.map((_, x) => <Cell y={y} x={x} key={`${y}-${x}`} />)
      )} */}
      {Array.from({ length: vtSize }, (_, y) =>
        Array.from({ length: hztSize }, (_, x) => (
          <Cell y={y} x={x} key={`${y}-${x}`} />
        ))
      )}
    </S.GridContainer>
  );
};

export default Board;
