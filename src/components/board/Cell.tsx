import styled from "@emotion/styled";
import { ViewStatus } from "../../utils/generate";
import { useContext, useRef } from "react";
import { GameContext } from "./Board";
import { isMobile } from "react-device-detect";
import { COLS, ROWS } from "../../game.config";

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

const useMobileHandlers = (y: number, x: number) => {
  const timerRef = useRef<number | null>(null);

  const { flagToggleHandler, openCellHandler } = useContext(GameContext);

  return {
    onTouchStart: () => {
      timerRef.current = setTimeout(() => {
        if (timerRef.current) {
          flagToggleHandler(y, x);
          timerRef.current = null;
        }
      }, 300);
    },
    onTouchMove: () => {
      timerRef.current = null;
    },
    onTouchEnd: () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        openCellHandler(y, x);
      }
    },
  };
}

const useDesktopHandlers = (y: number, x: number) => {
  const { flagToggleHandler, openCellHandler } = useContext(GameContext);

  return {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      flagToggleHandler(y, x);
    },
    onClick: () => openCellHandler(y, x),
  };
};

const useViewStatus = (y: number, x: number) => {
  const { board } = useContext(GameContext);
  return board[y][x].viewStatus;
}

const Cell = ({ x, y }: { y: number; x: number }) => {
  const viewStatus = useViewStatus(y, x);
  const mobileHandlers = useMobileHandlers(y, x);
  const desktopHandlers = useDesktopHandlers(y, x);

  return (
    <S.CellContainer
      {...(isMobile ? mobileHandlers : desktopHandlers)}
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
    aspect-ratio: 1 / 1;
    width: calc(min(calc(100vh / ${ROWS}), calc(100vw / ${COLS})) - 4px);
  `,
};
