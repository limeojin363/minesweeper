import { atom, useAtom, useAtomValue } from "jotai";
import { useImmerAtom } from "jotai-immer";
import { PreconfiguredCellInfo, ViewStatus } from "../utils/generate";
import { useEffect } from "react";
import getPreset from "../utils/getPreset";

export type CellViewType = "INITIAL" | "BOOMED" | "FLAGGED" | number;

type InitialSetting = {
  vtSize: number;
  hztSize: number;
  howManyMines: number;
};

export const initialSettingAtom = atom<InitialSetting>({
  vtSize: 10,
  hztSize: 10,
  howManyMines: 10,
});

const preConfiguredBoardInfoAtom = atom<PreconfiguredCellInfo[][]>();
export const viewStatusAtom = atom<ViewStatus[][]>();

const untouchedAtom = atom(true);

export const useCell = () => {
  const initialSetting = useAtomValue(initialSettingAtom);
  const [untouched, setUntouched] = useAtom(untouchedAtom);
  const [preset, setPreset] = useAtom(preConfiguredBoardInfoAtom);
  const [viewStatus, setViewStatus] = useImmerAtom(viewStatusAtom);

  useEffect(() => {
    if (!viewStatus) {
      setViewStatus((draft) => {
        draft = Array.from(
          { length: initialSetting.vtSize },
          () =>
            Array.from(
              { length: initialSetting.hztSize },
              () => "INITIAL"
            ) as ViewStatus[]
        );
        return draft;
      });
    }
  }, [
    viewStatus,
    setViewStatus,
    initialSetting.vtSize,
    initialSetting.hztSize,
  ]);

  const flag = (y: number, x: number) => {
    if (!viewStatus) return;
    if (untouched) return;

    const nowStatus = viewStatus[y][x];
    if (isFixed(nowStatus)) return;

    setViewStatus((draft) => {
      const alreadyFlagged = nowStatus === "FLAGGED";
      draft![y][x] = alreadyFlagged ? "INITIAL" : "FLAGGED";
    });
  };

  const open = (y: number, x: number) => {
    if (!viewStatus) return;
    const nowStatus = viewStatus[y][x];
    if (isFixed(nowStatus)) return;

    if (untouched) {
      setUntouched(false);
      // 첫 클릭 위치에 따라 맵 생성
      const generatedPreset = getPreset({
        ...initialSetting,
        firstY: y,
        firstX: x,
      });

      setPreset(generatedPreset);
      setViewStatus((draft) => {
        getPositionsToReveal({
          preset: generatedPreset,
          x,
          y,
        }).forEach(({ x: revealX, y: revealY }) => {
          const nowStatus = draft![revealY][revealX];
          if (isFixed(nowStatus)) return;
          draft![revealY][revealX] =
            generatedPreset[revealY][revealX].howManyAdjoiningMines;
        });
      });
    } else {
      if (!preset) return;

      const nowPreset = preset[y][x];
      if (nowPreset.isMine) {
        setViewStatus((draft) => {
          draft![y][x] = "BOOMED";
        });
      } else {
        setViewStatus((draft) => {
          getPositionsToReveal({
            preset,
            x,
            y,
          }).forEach(({ x: revealX, y: revealY }) => {
            const nowStatus = draft![revealY][revealX];
            if (isFixed(nowStatus)) return;
            draft![revealY][revealX] =
              preset[revealY][revealX].howManyAdjoiningMines;
          });
        });
      }
    }
  };

  return {
    flag,
    open,
  };
};

const isFixed = (viewStatus: ViewStatus) =>
  typeof viewStatus === "number" || viewStatus === "BOOMED";

/* 
  y, x, preset으로부터, bfs 방식으로 해당 좌표 주변의, 주변 8칸이 모두 안전 영역인 안전 영역을 전부 구하기 
  (y, x)는안전영역이라는 전제
 */
const getPositionsToReveal = ({
  preset,
  x,
  y,
}: {
  preset: PreconfiguredCellInfo[][];
  y: number;
  x: number;
}) => {
  const vtSize = preset.length;
  const hztSize = preset[0].length;
  const positionsToReveal: { x: number; y: number }[] = [{ x, y }];

  const getAdjoiningCellPositions = (y: number, x: number) => {
    const directions = [
      [-1, -1],
      [-1, 0],
      [-1, 1],
      [0, -1],
      [0, 1],
      [1, -1],
      [1, 0],
      [1, 1],
    ];

    return directions
      .map(([dy, dx]) => ({
        y: y + dy,
        x: x + dx,
      }))
      .filter(({ y, x }) => y >= 0 && y < vtSize && x >= 0 && x < hztSize);
  };

  const queue: { x: number; y: number }[] = [];
  const visited = preset.map((row) => row.map(() => false));

  if (
    getAdjoiningCellPositions(y, x).every(({ y, x }) => !preset[y][x].isMine)
  ) {
    queue.push({ x, y });
    visited[y][x] = true;
  }

  while (queue.length > 0) {
    const { x: currX, y: currY } = queue.shift()!;

    getAdjoiningCellPositions(currY, currX).forEach(({ y, x }) => {
      positionsToReveal.push({ x, y });
    });

    for (const { x: adjX, y: adjY } of getAdjoiningCellPositions(
      currY,
      currX
    )) {
      if (
        !visited[adjY][adjX] &&
        !preset[adjY][adjX].isMine &&
        getAdjoiningCellPositions(adjY, adjX).every(
          ({ y, x }) => !preset[y][x].isMine
        )
      ) {
        queue.push({ x: adjX, y: adjY });
        visited[adjY][adjX] = true;
      }
    }
  }

  return positionsToReveal;
};
