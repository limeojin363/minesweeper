import styled from "@emotion/styled";
import { ViewStatus } from "../../utils/generate";
import { useContext, useRef } from "react";
import { GameContext } from "./Board";
import { isMobile } from "react-device-detect";

const getBgColor = (viewStatus: ViewStatus) => {
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

const getContent = (viewStatus: ViewStatus) => {
  if (typeof viewStatus === "number") {
    if (viewStatus > 0) return " " + String(viewStatus);
    else return " ";
  }

  switch (viewStatus) {
    case "INITIAL":
      return " ";
    case "BOOMED":
      return " 💣";
    case "FLAGGED":
      return " 🚩";
  }
};

const Cell = ({ x, y }: { y: number; x: number }) => {
  const timerRef = useRef<number | null>(null);

  const { flagToggleHandler, openCellHandler, board } = useContext(GameContext);

  const { viewStatus } = board[y][x];

  if (!isMobile) {
    const handlers = {
      onContextMenu: (e: React.MouseEvent) => {
        e.preventDefault();

        flagToggleHandler(y, x);
      },
      onClick: () => openCellHandler(y, x),
    };

    return <S.CellContainer {...handlers} viewStatus={viewStatus} />;
  }

  return (
    <S.CellContainer
      onTouchStart={() => {
        timerRef.current = setTimeout(() => {
          if (timerRef.current) {
            flagToggleHandler(y, x);
            timerRef.current = null;
          }
        }, 100);
      }}
      onTouchEnd={() => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
          openCellHandler(y, x);
        }
      }}
      viewStatus={viewStatus}
    />
  );
};

export default Cell;

const S = {
  CellContainer: styled.div<{ viewStatus: ViewStatus }>`
    background-color: ${({ viewStatus }) => getBgColor(viewStatus)};
    border: 1px solid red;
    &::after {
      content: "${({ viewStatus }) => getContent(viewStatus)}";
    }
  `,
};
