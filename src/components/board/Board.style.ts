import styled from "@emotion/styled";

export const S = {
  GridContainer: styled.div<{ rowCount: number; colCount: number }>`
    display: grid;

    max-width: calc(100% - 30px);
    width: 100%;
    height: auto;

    aspect-ratio: ${({ colCount, rowCount }) => `${colCount} / ${rowCount}`};

    grid-template-columns: repeat(${({ colCount }) => colCount}, 1fr);
    grid-template-rows: repeat(${({ rowCount }) => rowCount}, 1fr);
  `,
};
