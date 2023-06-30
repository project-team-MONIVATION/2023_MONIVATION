import React from 'react'
import styled from 'styled-components'

const CloseBtnStyled = styled.button.attrs(props => ({
    onClick: props.onClick,
})) `
    position: absolute;
    top: 1%;
    right: 1.5%;
    border: 0;
    background: none;
    color: #735BF3;
    font-weight: bold;
    font-size: 20px;
    font-family: 'Cafe24Ssurround';
    padding: 6px;
    transition: color 0.2s ease-in-out; /* transition 속성 추가 */


    :hover {
        color: #2CA0C6;
    }
`;

export default function CloseBtn({ children, ...rest }) {
  return <CloseBtnStyled {...rest}>{children}</CloseBtnStyled>;
}