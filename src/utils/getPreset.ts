import { PreconfiguredCellInfo } from "./generate";

type Pos = { x: number; y: number };

const getPreset = ({
  vtSize,
  hztSize,
  howManyMines,
  firstY,
  firstX,
}: {
  vtSize: number;
  hztSize: number;
  howManyMines: number;
  firstY: number;
  firstX: number;
}) => {
  // 랜덤으로 지뢰 위치 뽑기
  const minePositions = (() => {
    const allPositions: Pos[] = [];
    for (let y = 0; y < vtSize; y++) {
      for (let x = 0; x < hztSize; x++) {
        allPositions.push({
          y,
          x,
        });
      }
    }

    // firstY, firstX 주변 3x3 영역을 제외
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = firstY + dy;
        const newX = firstX + dx;
        if (newY >= 0 && newY < vtSize && newX >= 0 && newX < hztSize) {
          const index = allPositions.findIndex(
            (pos) => pos.y === newY && pos.x === newX
          );
          if (index !== -1) {
            allPositions.splice(index, 1);
          }
        }
      }
    }

    // 배열 셔플
    for (let i = allPositions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [allPositions[i], allPositions[j]] = [allPositions[j], allPositions[i]];
    }

    // 셔플된 배열에서 맨 앞 howManyMines개 가져오기
    const _ = allPositions.slice(0, howManyMines);
    return _;
  })();

  // 지뢰 여부를 2차원 배열로
  const isMine = (() => {
    const _: boolean[][] = [];
    for (let y = 0; y < vtSize; y++) {
      _[y] = [];
      for (let x = 0; x < hztSize; x++) {
        _[y][x] = false;
      }
    }

    minePositions.forEach((pos) => {
      _[pos.y][pos.x] = true;
    });

    return _;
  })();

  // 인접한 지뢰 개수를 2차원 배열로
  const howManyAdjoiningMines = (() => {
    const _: number[][] = [];
    for (let y = 0; y < vtSize; y++) {
      _[y] = [];
      for (let x = 0; x < hztSize; x++) {
        _[y][x] = 0;
      }
    }

    minePositions.forEach((pos) => {
      const { x, y } = pos;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dy === 0 && dx === 0) continue;
          const newY = y + dy;
          const newX = x + dx;
          if (newY >= 0 && newY < vtSize && newX >= 0 && newX < hztSize) {
            _[newY][newX]++;
          }
        }
      }
    });

    return _;
  })();

  // isMine과 howManyAdjoiningMines를 조합하여 필요한 형태로 변환
  return (() => {
    const _: PreconfiguredCellInfo[][] = [];
    for (let y = 0; y < vtSize; y++) {
      _[y] = [];
      for (let x = 0; x < hztSize; x++) {
        _[y][x] = {
          isMine: isMine[y][x],
          howManyAdjoiningMines: howManyAdjoiningMines[y][x],
        };
      }
    }
    return _;
  })();
};

export default getPreset;
