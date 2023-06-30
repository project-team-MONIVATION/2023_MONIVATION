import React from 'react'
import styled from 'styled-components'

const ModalWrapStyled = styled.div `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    & > div {
        width: 580px;
        height: 790px;
        background: rgb(255, 255, 255);
        border-radius: 50px;
        padding: 20px;
        box-sizing: border-box;
    }
`;

export default function ModalWrap({ children, ...rest }) {
  return <ModalWrapStyled {...rest}>{children}</ModalWrapStyled>;
}