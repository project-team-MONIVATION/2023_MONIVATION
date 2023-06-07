import React from "react";
import styled from "styled-components";

const StyledLink = styled.span`
  width: 275px;
  height: 60px;
  z-index: 5;
  background-color: #fff;
  border-radius: 26px 26px 0px 0px;

  & > a {
    display: inline-block;
    color: #fff;
    font-size: 20px;
    text-decoration-line: none;
    width: 275px;
    height: 60px;
    background-image: linear-gradient(to right, #21D6CC, #7D21CF);
    border-radius: 26px 26px 0px 0px;
    /* 수직정렬 */
    line-height: 63px;
    z-index: 10;
  }

  & > a:hover { color: #7D21CF; }

  & > a:active {
    background-color: #fff;
    width: 275px;
    height: 60px;
    border-radius: 26px 26px 0px 0px;
    z-index: 20;

  }

  & > a:focus {
    background-color: #fff;
    width: 275px;
    height: 60px;
    border-radius: 26px 26px 0px 0px;
    z-index: 20;
  }
`;

export default function LoginBtn({ children,...rest }) {
  return (
    <StyledLink {...rest}>{children}</StyledLink>
  );
}