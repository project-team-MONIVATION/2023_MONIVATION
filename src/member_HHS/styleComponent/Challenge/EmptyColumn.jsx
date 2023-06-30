import React from 'react'
import styled from 'styled-components'

const EmptyColumnStyled = styled.div `
    width: 230px;
    height: 310px;
    top: 85px;
    border: 1px red solid;
    border-radius: 50px;
    position: relative;
`;

export default function EmptyColumn({ children, ...rest }) {
  return <EmptyColumnStyled {...rest}>{children}</EmptyColumnStyled>;
}