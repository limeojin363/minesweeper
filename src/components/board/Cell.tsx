import styled from "@emotion/styled";
import { ViewStatus } from "../../game/generate";

const getColor = (viewStatus: ViewStatus) => {
  if (typeof viewStatus === "number") return "whitegray";

  switch (viewStatus) {
    case "INITIAL":
      return "gray";
    case "BOOMED":
      return "red";
    case "FLAGGED":
      return "blue";
  }
};

const Cell = ({
  viewStatus,
  onClick,
  onClickRight,
}: {
  viewStatus: ViewStatus;
  onClick: () => void;
  onClickRight: (e: React.MouseEvent<HTMLDivElement>) => void;
}) => {
  return (
    <S.CellContainer
      onClick={onClick}
      onContextMenu={onClickRight}
      viewStatus={viewStatus}>
      {viewStatus === "BOOMED" && "💣"}
      {viewStatus === "FLAGGED" && "🚩"}
      {typeof viewStatus === "number" && viewStatus > 0 && viewStatus}
    </S.CellContainer>
  );
};

export default Cell;

const S = {
  CellContainer: styled.div<{ viewStatus: ViewStatus }>`
    background-color: ${({ viewStatus }) => getColor(viewStatus)};
    border: 1px solid red;
  `,
};
