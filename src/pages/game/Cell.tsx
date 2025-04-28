import styled from "@emotion/styled";
import { useRef } from "react";
import { useAtomValue } from "jotai";
import {
  CellView,
  configAtom,
  useCellView,
  useFlag,
  useOpen,
} from "./hooks/useCell";
import { LogicalPosition } from "./hooks/types";
import { isMobile } from "react-device-detect";
import { css } from "@emotion/react";

const getBgColor = (viewStatus: CellView) => {
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

const getContent = (viewStatus: CellView) => {
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

const useHandlers = ({ y, x }: LogicalPosition) => {
  const flag = useFlag();
  const open = useOpen();
  const timerRef = useRef<number | null>(null);

  const mobileHandlers = {
    onTouchStart: () => {
      timerRef.current = setTimeout(() => {
        if (timerRef.current) {
          flag({ y, x });
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
        open({ y, x });
      }
    },
  };
  const desktopHandlers = {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      flag({ y, x });
    },
    onClick: () => open({ y, x }),
  };

  return {
    mobileHandlers,
    desktopHandlers,
  };
};

const Cell = ({ x, y }: { y: number; x: number }) => {
  const { desktopHandlers, mobileHandlers } = useHandlers({ y, x });
  const viewStatus = useCellView({ y, x });
  const { hztSize, vtSize } = useAtomValue(configAtom);

  return (
    <S.CellContainer
      {...(isMobile ? mobileHandlers : desktopHandlers)}
      viewStatus={viewStatus}
      vtSize={vtSize}
      hztSize={hztSize}
      y={y}
      x={x}
    />
  );
};

export default Cell;

const S = {
  CellContainer: styled.div<{
    viewStatus: CellView;
    vtSize: number;
    hztSize: number;
    y: number;
    x: number;
  }>`
    background-color: ${({ viewStatus }) => getBgColor(viewStatus)};
    border: 1px solid red;
    &::after {
      content: "${({ viewStatus }) => getContent(viewStatus)}";
    }
    aspect-ratio: 1 / 1;
    position: absolute;

    ${({ hztSize, vtSize, x, y }) => sqaureCellSize({ hztSize, vtSize, x, y })};
  `,
};

const sqaureCellSize = ({
  x,
  y,
  hztSize,
  vtSize,
}: {
  y: number;
  x: number;
  vtSize: number;
  hztSize: number;
}) => {
  const cellSize = `calc(min(calc(100vh / ${vtSize}), calc(100vw / ${hztSize})) - 4px)`;

  return css`
    width: ${cellSize};
    top: calc(${y} * ${cellSize});
    left: calc(${x} * ${cellSize});
  `;
};
