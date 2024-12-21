import { css, Global } from "@emotion/react";
import emotionNormalize from "emotion-normalize";

const baseStyle = css`
  html {
    height: 100%;
    overflow: hidden;
  }
  ${emotionNormalize}
`;

const GlobalStyle = () => <Global styles={baseStyle} />;

export default GlobalStyle;
