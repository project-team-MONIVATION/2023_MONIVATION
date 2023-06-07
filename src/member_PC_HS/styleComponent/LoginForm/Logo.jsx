import React from "react";
import styled from 'styled-components';

const LogoImg = styled.h1`
  color: white;
  /* 글자 간격 */
  letter-spacing: 5px;
  position: absolute;
  top: 0px;
  left: 25px;
  z-index: 100;
`

export default function Logo({ children,...rest }) {
  return (
      <LogoImg {...rest}>{children}</LogoImg>
  );
}