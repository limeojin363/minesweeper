import styled from "@emotion/styled";
import Board from "./components/board/Board";

const App = () => {
  return (
    <BoardWrapper>
      <Board />
    </BoardWrapper>
  );
};

export default App;

const BoardWrapper = styled.div`
  user-select: none;
  -webkit-user-select: none;
`;
