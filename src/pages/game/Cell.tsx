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
import { LogicalPosition, Unit } from "./hooks/types";
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
  const { unit } = useAtomValue(configAtom);

  return (
    <S.CellContainer
      {...(isMobile ? mobileHandlers : desktopHandlers)}
      viewStatus={viewStatus}
      vtSize={vtSize}
      hztSize={hztSize}
      y={y}
      x={x}
      unit={unit}
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
    unit: Unit;
  }>`
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: ${({ viewStatus }) => getBgColor(viewStatus)};
    &::after {
      content: "${({ viewStatus }) => getContent(viewStatus)}";
      /* content: ${({ y, x }) => `${y}, ${x}`}; */
    }
    aspect-ratio: 1 / 1;
    position: absolute;

    ${({ hztSize, vtSize, x, y, unit }) =>
      CellStyles({ hztSize, vtSize, x, y, unit })};
  `,
};

const CellStyles = ({
  x,
  y,
  hztSize,
  vtSize,
  unit,
}: {
  vtSize: number;
  hztSize: number;
  y: number;
  x: number;
  unit: Unit;
}) => {
  if (unit === "SQAURE") {
    const side = `calc(min(calc(100vh / ${vtSize}), calc(100vw / ${hztSize})) - 4px)`;

    return css`
      width: ${side};
      top: calc(${y} * ${side});
      left: calc(${x} * ${side});
    `;
  }
  if (unit === "HEXAGON") {
    const height = `calc(min(calc(100vh / ${vtSize}), calc(100vw / ${hztSize})) - 4px)`;

    return css`
      height: ${height};
      border: 1px solid blue;

      clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
      aspect-ratio: 0.866;
      top: calc(${y} * ${height} / 2);
      left: calc(${x} * ${height} * (1 - 1 / (2 * ${Math.sqrt(3)})));
    `;
  }

  return css``;
};
