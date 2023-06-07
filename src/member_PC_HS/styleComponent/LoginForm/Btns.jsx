import React from "react";
import styled from "styled-components";

const StyledBtns = styled.div`
    position: absolute;
    width: 550px;
    height: 60px;
    top: 100px;
    left: 50%;
    transform: translateX(-50%);
    border-radius: 26px 26px 0 0;
    background-image: linear-gradient(to right bottom, #21D6CC, #7D21CF);
    display: flex;
    /* filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25)); */
    /* box-shadow: 0px -15px 5px -2px gray; */
    z-index: 1;
    text-align: center;
`;

export default function Btns({ children,...rest }) {
  return (
      <StyledBtns {...rest}>{children}</StyledBtns>
  );
}