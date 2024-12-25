import { useEffect, useState } from "react";
import { CellType, Dimension2, convert1dTo2d } from "../utils/generate";
import { pickMinePos } from "../utils/combination";
import _ from "lodash";

const dx = [-1, 0, 1];
const dy = [-1, 0, 1];

const useGame = ({
  colCount,
  rowCount,
  mineCount,
  firstTurnOpening,
}: {
  colCount: number;
  rowCount: number;
  mineCount: number;
  firstTurnOpening?: boolean;
}) => {
  const [isStarted, setIsStarted] = useState(false);
  const [board, setBoard] = useState(getEmptyBoard({ colCount, rowCount }));

  const out = (y: number, x: number) =>
    y < 0 || x < 0 || y >= rowCount || x >= colCount;

  const getAdjoiningCellPositions = (y: number, x: number) => {
    return dy
      .map((dyi) => dx.map((dxi) => [y + dyi, x + dxi] as Dimension2))
      .reduce((acc, curr) => [...acc, ...curr], [])
      .filter((item) => !out(...item) && !(item[0] === y && item[1] === x));
  };

  const gameOver = (y: number, x: number) => {
    const boardNext = _.cloneDeep(board);

    boardNext[y][x].viewStatus = "BOOMED";

    setBoard(boardNext);
  };

  const openCellHandler = (y: number, x: number) => {
    if (board[y][x].viewStatus === "FLAGGED") return;

    const boardNext = _.cloneDeep(board);

    const assignMines = () => {
      let candidateList: Dimension2[] = Array.from(
        { length: colCount * rowCount },
        (_, i) => convert1dTo2d(i, colCount)
      );

      if (firstTurnOpening) {
        const toRemoveList: Dimension2[] = [
          [y, x],
          ...getAdjoiningCellPositions(y, x),
        ];

        const areEqual = (a: Dimension2, b: Dimension2) =>
          a[0] === b[0] && a[1] === b[1];

        candidateList = candidateList.filter(
          (candidateItem) =>
            toRemoveList.findIndex((toRemoveItem) =>
              areEqual(candidateItem, toRemoveItem)
            ) === -1
        );
      }

      const minePosList = pickMinePos(candidateList, mineCount);

      minePosList.forEach(([yy, xx]) => {
        boardNext[yy][xx].isMine = true;
      });
    };

    if (!isStarted) {
      assignMines();
      setIsStarted(true);
    }

    if (boardNext[y][x].isMine) {
      gameOver(y, x);
    } else {
      const visited = getEmptyVisited({ colCount, rowCount });

      const positionsToReveal: Dimension2[] = [];

      const recursivelyPush = (yy: number, xx: number) => {
        visited[yy][xx] = true;
        positionsToReveal.push([yy, xx]);

        visitedLog(visited);

        const adjoiningCellPositions = getAdjoiningCellPositions(yy, xx);

        if (
          adjoiningCellPositions.every(([ny, nx]) => !boardNext[ny][nx].isMine)
        ) {
          adjoiningCellPositions.forEach(([ny, nx]) => {
            if (!visited[ny][nx]) recursivelyPush(ny, nx);
          });
        }
      };

      recursivelyPush(y, x);

      positionsToReveal.forEach(([yy, xx]) => {
        boardNext[yy][xx].viewStatus = getAdjoiningCellPositions(yy, xx)
          .map(([yyy, xxx]) => boardNext[yyy][xxx])
          .reduce((acc, curr) => (curr.isMine ? ++acc : acc), 0);
      });

      setBoard(boardNext);
    }
  };

  const flagToggleHandler = (y: number, x: number) => {
    const boardNext = _.cloneDeep(board);

    if (board[y][x].viewStatus === "INITIAL") {
      boardNext[y][x].viewStatus = "FLAGGED";
    }
    if (board[y][x].viewStatus === "FLAGGED") {
      boardNext[y][x].viewStatus = "INITIAL";
    }

    setBoard(boardNext);
  };

  useEffect(() => {
    console.log({ board });
  }, [board]);

  return { board, openCellHandler, flagToggleHandler, colCount, rowCount };
};

export default useGame;

const visitedLog = (visited: boolean[][]) => {
  let ret = "";
  for (let i = 0; i < visited.length; i++) {
    let row = "";
    for (let j = 0; j < visited[i].length; j++)
      row += visited[i][j] ? "O" : "X";
    ret += row;
    ret += "\n";
  }

  console.log(ret);
};

const getEmptyBoard = ({
  colCount,
  rowCount,
}: {
  rowCount: number;
  colCount: number;
}) => {
  const ret: CellType[][] = [];

  for (let i = 0; i < rowCount; i++) {
    ret[i] = [];
    for (let j = 0; j < colCount; j++)
      ret[i][j] = {
        isMine: false,
        viewStatus: "INITIAL",
      };
  }

  return ret;
};

const getEmptyVisited = ({
  colCount,
  rowCount,
}: {
  rowCount: number;
  colCount: number;
}) => {
  const ret: boolean[][] = [];

  for (let i = 0; i < rowCount; i++) {
    ret[i] = [];
    for (let j = 0; j < colCount; j++) ret[i][j] = false;
  }

  return ret;
};
