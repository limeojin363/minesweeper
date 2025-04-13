import styled from "@emotion/styled";
import { ViewStatus } from "../../utils/generate";
import { useRef } from "react";
import { isMobile } from "react-device-detect";
import { useAtomValue } from "jotai";
import {
  initialSettingAtom,
  useCell,
  viewStatusAtom,
} from "../../hooks/useGame";

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

  const { flag, open } = useCell();

  return {
    onTouchStart: () => {
      timerRef.current = setTimeout(() => {
        if (timerRef.current) {
          flag(y, x);
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
        open(y, x);
      }
    },
  };
};

const useDesktopHandlers = (y: number, x: number) => {
  const { flag, open } = useCell();

  return {
    onContextMenu: (e: React.MouseEvent) => {
      e.preventDefault();
      flag(y, x);
    },
    onClick: () => open(y, x),
  };
};

const useViewStatus = (y: number, x: number) => {
  const viewStatus = useAtomValue(viewStatusAtom);
  if (!viewStatus) return "INITIAL";
  return viewStatus[y][x];
};

const Cell = ({ x, y }: { y: number; x: number }) => {
  const viewStatus = useViewStatus(y, x);
  const mobileHandlers = useMobileHandlers(y, x);
  const desktopHandlers = useDesktopHandlers(y, x);
  const { hztSize, vtSize } = useAtomValue(initialSettingAtom);

  return (
    <S.CellContainer
      {...(isMobile ? mobileHandlers : desktopHandlers)}
      viewStatus={viewStatus}
      vtSize={vtSize}
      hztSize={hztSize}
    />
  );
};

export default Cell;

const S = {
  CellContainer: styled.div<{
    viewStatus: ViewStatus;
    vtSize: number;
    hztSize: number;
  }>`
    background-color: ${({ viewStatus }) => getBgColor(viewStatus)};
    border: 1px solid red;
    &::after {
      content: "${({ viewStatus }) => getContent(viewStatus)}";
    }
    aspect-ratio: 1 / 1;
    width: ${({ hztSize, vtSize }) =>
      `calc(min(calc(100vh / ${vtSize}), calc(100vw / ${hztSize})) - 4px)`};
  `,
};
