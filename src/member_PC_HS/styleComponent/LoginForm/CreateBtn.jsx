import React from "react";
import styled from "styled-components";

const StyledLink = styled.span`
  width: 300px;
    line-height: 82px;
  height: 82px;
  z-index: 5;
  border-radius: 50px 50px 0px 0px;
  cursor: pointer;

  & > a {
    display: inline-block;
    /* color: #fff; */
    font-family: 'Cafe24Ssurround';
    font-size: 23px;
    text-decoration-line: none;
    width: 300px;
    height: 82px;
    border-radius: 50px 50px 35px 0;
    /* 수직정렬 */
    line-height: 82px;
    color: #fff;
    /* background-image: linear-gradient(to right, #21D6CC, #7D21CF); */
  }

  & > a:hover { color: #7D21CF; }

  & > a:active {
    background-color: #fff;
    color: #8E8E8E;
    width: 300px;
    height: 82px;
    border-radius: 50px 50px 0px 0px;
    z-index: 20;

  }

  & > a:focus {
    background-color: #fff;
    color: #8E8E8E;
    width: 300px;
    height: 82px;
    border-radius: 50px 50px 0px 0px;
    z-index: 20;
  }
`;

export default function CreateBtn({ children,...rest }) {
  return (
    <StyledLink {...rest}>{children}</StyledLink>
  );
}