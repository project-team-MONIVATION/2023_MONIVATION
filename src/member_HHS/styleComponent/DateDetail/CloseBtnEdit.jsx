import React from 'react'
import styled from 'styled-components'

const CloseBtnEditStyled = styled.button.attrs(props => ({
    onClick: props.onClick,
})) `
    border: 0;
    background: none;
    color: #735BF3;
    font-weight: bold;
    font-size: 20px;
    font-family: 'Cafe24Ssurround';
    padding: 6px;
    transition: color 0.2s ease-in-out; /* transition 속성 추가 */
    z-index: 10;
    padding-bottom: 5px;
    display: flex;
    padding-left: 280px;
    text-align: end;

    :hover {
        color: #2CA0C6;
    }
`;

export default function CloseBtnEdit({ children, ...rest }) {
  return <CloseBtnEditStyled {...rest}>{children}</CloseBtnEditStyled>;
}