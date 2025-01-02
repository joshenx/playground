import styled, { keyframes } from "styled-components";

import { useStyledThemeContext } from "@seaweb/coral/components/ThemeProvider";

import LoadingIcon from "./LoadingIcon";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const FadeInWrapper = styled.div`
  width: fit-content;
  margin: 10em auto;
  opacity: 0;
  animation: 1s ${fadeIn} ease 0.4s forwards;
`;

function Loading(props: React.HTMLAttributes<HTMLDivElement>) {
  const { colors } = useStyledThemeContext();

  return (
    <FadeInWrapper {...props}>
      <LoadingIcon color={colors.accPri1st} size={40} />
    </FadeInWrapper>
  );
}

export default Loading;
