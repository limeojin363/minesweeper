import styled from "@emotion/styled";
import { useAtomValue } from "jotai";
import Cell from "./Cell";
import { allCellPositionsAtom, configAtom } from "./hooks/useCell";

const Board = () => {
  const { hztSize, vtSize } = useAtomValue(configAtom);

  const allPos = useAtomValue(allCellPositionsAtom);

  return (
    <S.BoardContainer vtSize={vtSize} hztSize={hztSize}>
      {allPos.map((pos) => (
        <Cell y={pos.y} x={pos.x} key={`${pos.y}-${pos.x}`} />
      ))}
    </S.BoardContainer>
  );
};

export default Board;

const S = {
  BoardContainer: styled.div<{ vtSize: number; hztSize: number }>`
    width: 100%;
    height: 100%;
    position: relative;
  `,
};
