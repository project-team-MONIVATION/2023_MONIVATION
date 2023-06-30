import React from 'react'
import styled from 'styled-components'

const MoneyListStyled = styled.div `
    padding: 0 16px;
    background-color: #ffffff;
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.2s ease-out;
    border-bottom: 1px solid #eeeeee;

`;

export default function MoneyList({ children, ...rest }) {
  return <MoneyListStyled {...rest}>{children}</MoneyListStyled>;
}