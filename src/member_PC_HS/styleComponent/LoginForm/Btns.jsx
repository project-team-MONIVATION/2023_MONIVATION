import React from "react";
import styled from "styled-components";

const StyledBtns = styled.div`
    position: absolute;
    width: 600px;
    height: 82px;
    top: 193px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 50px 50px 0px 0px;
    background: linear-gradient(125deg, #21D6CC 0%, #7D21CF 100%);
    box-shadow: 0px 10px 20px 5px rgba(0, 0, 0, 0.15);
    display: flex;
    z-index: 1;
    text-align: center;
`;

export default function Btns({ children,...rest }) {
  return (
      <StyledBtns {...rest}>{children}</StyledBtns>
  );
}