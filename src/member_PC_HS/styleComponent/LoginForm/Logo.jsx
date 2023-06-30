import React from "react";
import styled from 'styled-components';

const LogoImg = styled.div`
  background-image: url('img/logo_onlytext_white.png');
  position: absolute;
  top: 28px;
  left: 36px;
  width: 185.171px;
  height: 26px;
  flex-shrink: 0;
  background-size: cover;
  z-index: 100;
`

export default function Logo({ ...rest }) {
  return (
      <LogoImg {...rest}></LogoImg>
  );
}