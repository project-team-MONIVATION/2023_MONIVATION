import React from "react";
import styled from "styled-components";

const StyledLink = styled.span`
  width: 300px;
  z-index: 5;
  border-radius: 50px 50px 0px 0px;
  cursor: pointer;

  & > a {
    display: inline-block;
    font-family: 'Cafe24Ssurround';
    font-size: 23px;
    text-decoration-line: none;
    width: 300px;
  }
`;

export default function CreateBtn({ children,...rest }) {
  return (
    <StyledLink {...rest}>{children}</StyledLink>
  );
}