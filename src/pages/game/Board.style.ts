import styled from "@emotion/styled";

export const S = {
  GridContainer: styled.div<{ vtSize: number; hztSize: number }>`
    display: grid;

    aspect-ratio: ${({ hztSize, vtSize }) => `${hztSize} / ${vtSize}`};

    grid-template-columns: repeat(${({ hztSize: hztSize }) => hztSize}, 1fr);
    grid-template-rows: repeat(${({ vtSize: vtSize }) => vtSize}, 1fr);
  `,
};
