import React from 'react'
import styled from 'styled-components'

const DateDetailBoxStyled = styled.div `
    position: relative;
`;

export default function DateDetailBox({ children, ...rest }) {
  return <DateDetailBoxStyled {...rest}>{children}</DateDetailBoxStyled>;
}