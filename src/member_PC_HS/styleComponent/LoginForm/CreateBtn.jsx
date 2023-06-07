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
    /* color: #fff; */
    font-size: 20px;
    text-decoration-line: none;
    width: 275px;
    height: 60px;
    border-radius: 26px 26px 35px 0;
    /* 수직정렬 */
    line-height: 63px;
    background-color: #fff;
    color: #8E8E8E;
    /* background-image: linear-gradient(to right, #21D6CC, #7D21CF); */
  }

  & > a:hover { color: #7D21CF; }

  /* & > a:active {

  } */
  /* & > a:active {
    background-color: #7D21CF;
    width: 275px;
    height: 60px;
    border-radius: 26px 26px 0px 0px;
    z-index: 20;

  } */
  
  /* & > a:focus {
    display: inline-block;
    color: #8E8E8E;
    border-radius: 26px 26px 26px 0px;
    background-color: #fff;
    width: 275px;
    height: 60px;
    z-index: 90;
  }
  & > a:visited{

  } */
`;

export default function CreateBtn({ children,...rest }) {
  return (
    <StyledLink {...rest}>{children}</StyledLink>
  );
}