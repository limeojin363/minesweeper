import styled from "@emotion/styled";
import Board from "./Board";

const GamePage = () => {
  return (
    <BoardWrapper>
      <Board />
    </BoardWrapper>
  );
};

export default GamePage;
const BoardWrapper = styled.div`
  overscroll-behavior: none;

  position: fixed;
  height: 100dvh;
  width: 100dvw;

  background-color: pink;

  /* 텍스트 선택 방지 */
  user-select: none;
  -webkit-user-select: none;

  /* 줌인/줌아웃 방지 */
  touch-action: pan-x pan-y;

  display: flex;
  justify-content: center;
  align-items: center;
`;
