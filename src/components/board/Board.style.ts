import styled from "@emotion/styled";

export const S = {
  GridContainer: styled.div<{ rowCount: number; colCount: number }>`
    display: grid;
    height: 300px;
    width: 300px;

    grid-template-columns: repeat(${({ colCount }) => colCount}, 1fr);
    grid-template-rows: repeat(${({ rowCount }) => rowCount}, 1fr);
  `,
};
