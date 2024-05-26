import Board from "./components/board/Board";
import useGame from "./hooks/useGame";

const COLS = 10;
const ROWS = 10;
const MINES = 25;

const App = () => {
  const { board, onClickCell, flagHandler } = useGame({
    colCount: COLS,
    rowCount: ROWS,
    mineCount: MINES,
    firstTurnOpening: true,
  });

  return (
    <Board
      flagHandler={flagHandler}
      board={board}
      onClickCell={onClickCell}
      colCount={COLS}
      rowCount={ROWS}
    />
  );
};

export default App;
