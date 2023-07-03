import React from 'react'
import styled from 'styled-components'

const DateDetailBoxStyled = styled.div `
  display: flex;
`;

export default function DateDetailBox({ children, ...rest }) {
  return <DateDetailBoxStyled {...rest}>{children}</DateDetailBoxStyled>;
}