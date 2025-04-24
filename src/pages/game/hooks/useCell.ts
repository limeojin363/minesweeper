import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomFamily } from "jotai/utils";
import { useMemo } from "react";
import { CellPresetInfo, CellStatus, LogicalPosition, Unit } from "./types";

// dependency: configAtom
export const allCellPositionsAtom = atom<LogicalPosition[]>((get) => {
  const { hztSize, vtSize } = get(configAtom);
  const positions: LogicalPosition[] = [];
  for (let y = 0; y < vtSize; y++) {
    for (let x = 0; x < hztSize; x++) {
      positions.push({
        y,
        x,
      });
    }
  }
  return positions;
});

const cellStatusAtomFamily = atomFamily(
  (_: LogicalPosition) => atom<CellStatus>("INITIAL"),
  (a, b) => a.x === b.x && a.y === b.y
);

export type CellView = "INITIAL" | "FLAGGED" | "BOOMED" | number;

// dependency: cellStatusAtomFamily
const getCellViewAtom = ({ y, x }: LogicalPosition) =>
  atom((get) => {
    const status = get(cellStatusAtomFamily({ y, x }));
    const { isMine, howManyAdjoiningMines } = get(
      cellPresetInfoAtomFamily({ y, x })
    );
    if (status === "REVEALED") {
      if (isMine) return "BOOMED";
      else return howManyAdjoiningMines;
    }
    return status;
  });

export const useCellView = ({ y, x }: LogicalPosition) => {
  const cellViewAtom = useMemo(() => getCellViewAtom({ y, x }), [y, x]);

  return useAtomValue(cellViewAtom);
};

const cellPresetInfoAtomFamily = atomFamily(
  ({ y, x }: LogicalPosition) =>
    atom<CellPresetInfo>({ isMine: false, howManyAdjoiningMines: 0, y, x }),
  (a, b) => a.x === b.x && a.y === b.y
);

type LogicalPositionKey = `x${number}y${number}`;

// `x${number}y${number}` => {y, x};
const getCellPositionKey = ({ y, x }: LogicalPosition): LogicalPositionKey =>
  `x${x}y${y}`;

// {y, x} => `x${number}y${number}`
const getCellPosition = (key: LogicalPositionKey) => {
  const [x, y] = key.split("y").map((v) => parseInt(v.replace("x", "")));
  return { x, y };
};

// setter 호출 시, 사전에 계산된 인접 - 0 위치들에 대해 접근하여 전부 open시키는 atom
// dependency: allCellPositionsAtom, configAtom, cellPresetInfoAtomFamily
const adjOpenAtom = (() => {
  const adjOpenEntireOpenAtom = atom((get) => {
    const allPositions = get(allCellPositionsAtom);
    // TODO: dx, dy는 config의 unit값을 통해 결정하도록 한다. 일단 임시로 처리.
    const { unit = "SQAURE" } = get(configAtom);
    const offsets = AdjOffset[unit];

    const adjOpenMap = (() => {
      const ret = new Map<LogicalPositionKey, LogicalPosition[]>();

      const register = (pos: LogicalPosition) => {
        const { howManyAdjoiningMines } = get(
          cellPresetInfoAtomFamily({ y: pos.y, x: pos.x })
        );
        if (howManyAdjoiningMines !== 0) {
          ret.set(getCellPositionKey(pos), [pos]);
          return;
        }

        const toOpenPosKeySet = new Set<LogicalPositionKey>();
        const q: LogicalPosition[] = [];

        toOpenPosKeySet.add(getCellPositionKey(pos));
        q.push(pos);

        // 큐에 삽입되는 놈은 곧 open할 놈
        // 뽑은 놈이 인접 - 0이다: visited가 아닌 주변부 셀을 큐에 삽입
        while (q.length > 0) {
          const { y, x } = q.pop()!;

          if (
            get(cellPresetInfoAtomFamily({ y, x })).howManyAdjoiningMines !== 0
          )
            continue;

          offsets.forEach(({ dx, dy }) => {
            const newY = y + dy;
            const newX = x + dx;
            const adjPos = { y: newY, x: newX };

            // out of bounds
            if (!allPositions.find((pos) => pos.y === newY && pos.x === newX))
              return;
            // already visited
            if (toOpenPosKeySet.has(getCellPositionKey(adjPos))) return;

            toOpenPosKeySet.add(getCellPositionKey(adjPos));
            q.push(adjPos);
          });
        }

        const zeroPosKeyGroup = [...toOpenPosKeySet];
        const zeroPosGroup = zeroPosKeyGroup.map((key) => getCellPosition(key));
        ret.set(getCellPositionKey(pos), zeroPosGroup);
      };

      allPositions.forEach((pos) => {
        register(pos);
      });

      return ret;
    })();

    return adjOpenMap;
  });

  return atom(null, (get, set, update: LogicalPosition) => {
    const adjOpenEntireOpen = get(adjOpenEntireOpenAtom);
    const posKey = getCellPositionKey(update);
    const adjZeroPosGroup = adjOpenEntireOpen.get(posKey)!;

    adjZeroPosGroup.forEach((pos) => {
      // console.log("adjOpen", pos);
      set(cellStatusAtomFamily(pos), "REVEALED");
    });
  });
})();

const AdjOffset: { [key in Unit]: { dx: number; dy: number }[] } = {
  HEXAGON: [
    // { dx: 0, dy: -1 },
    // { dx: 1, dy: -1 },
    // { dx: 1, dy: 0 },
    // { dx: 0, dy: 1 },
    // { dx: -1, dy: 0 },
    // { dx: -1, dy: -1 },
  ],
  SQAURE: [
    { dx: -1, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: -1 },
    { dx: 1, dy: 0 },
    { dx: 1, dy: 1 },
  ],
  TRIANGLE: [
    // { dx: 0, dy: -1 },
    // { dx: 1, dy: -1 },
    // { dx: 1, dy: 0 },
    // { dx: 0, dy: 1 },
    // { dx: -1, dy: 0 },
    // { dx: -1, dy: -1 },
  ],
};

type Config = {
  vtSize: number;
  hztSize: number;
  howManyMines: number;
  unit?: "SQAURE" | "HEXAGON" | "TRIANGLE";
};

export const configAtom = atom<Config>({
  vtSize: 10,
  hztSize: 10,
  howManyMines: 10,
});

// dependency: allCellPositionsAtom, configAtom
const assignMinesAtom = atom(null, (get, set, { y, x }: LogicalPosition) => {
  const { howManyMines, unit = "SQAURE" } = get(configAtom);
  const allPositions = get(allCellPositionsAtom);

  const availablePositions = allPositions.filter((pos) => {
    if (pos.y === y && pos.x === x) {
      return false;
    }

    return !AdjOffset[unit].some(({ dx, dy }) => {
      const newY = y + dy;
      const newX = x + dx;
      return pos.y === newY && pos.x === newX;
    });
  });

  // shuffle
  for (let i = availablePositions.length; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    [availablePositions[i - 1], availablePositions[j]] = [
      availablePositions[j],
      availablePositions[i - 1],
    ];
  }

  const selectedMinePositions = availablePositions.slice(0, howManyMines);

  // 지뢰 할당
  selectedMinePositions.forEach((pos) => {
    // console.log("assign", pos);
    set(cellPresetInfoAtomFamily(pos), {
      isMine: true,
      howManyAdjoiningMines: 0,
      y: pos.y,
      x: pos.x,
    });
  });

  // 각 셀의 인접지뢰갯수를 계산하여 반영
  allPositions.forEach((pos) => {
    const { isMine } = get(cellPresetInfoAtomFamily(pos));
    let howManyAdjoiningMines = 0;

    AdjOffset[unit].forEach(({ dx, dy }) => {
      const newY = pos.y + dy;
      const newX = pos.x + dx;

      if (allPositions.find((p) => p.y === newY && p.x === newX)) {
        if (get(cellPresetInfoAtomFamily({ y: newY, x: newX })).isMine) {
          howManyAdjoiningMines++;
        }
      }
    });

    set(cellPresetInfoAtomFamily(pos), {
      isMine,
      howManyAdjoiningMines,
      y: pos.y,
      x: pos.x,
    });
  });
});

const isTouchedAtom = atom(false);

export const useOpen = () => {
  const [isTouched, setIsTouched] = useAtom(isTouchedAtom);
  const assignMines = useSetAtom(assignMinesAtom);
  const applyAdjOpen = useSetAtom(adjOpenAtom);

  if (!isTouched)
    return ({ y, x }: LogicalPosition) => {
      // console.log({ y, x });
      assignMines({ y, x });
      applyAdjOpen({ y, x });
      setIsTouched(true);
    };
  else
    return ({ y, x }: LogicalPosition) => {
      applyAdjOpen({ y, x });
    };
};

const flagToggleAtom = atom(null, (get, set, { y, x }: LogicalPosition) => {
  const status = get(cellStatusAtomFamily({ y, x }));
  if (status === "INITIAL") {
    set(cellStatusAtomFamily({ y, x }), "FLAGGED");
  } else if (status === "FLAGGED") {
    set(cellStatusAtomFamily({ y, x }), "INITIAL");
  }
});

export const useFlag = () => {
  const flagToggle = useSetAtom(flagToggleAtom);

  return ({ y, x }: LogicalPosition) => {
    flagToggle({ y, x });
  };
};
