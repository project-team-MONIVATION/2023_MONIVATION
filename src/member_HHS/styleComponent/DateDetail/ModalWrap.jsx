import React from 'react'
import styled from 'styled-components'

const ModalWrapStyled = styled.div `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    & > div {
        position: relative;
    }
`;

export default function ModalWrap({ children, ...rest }) {
  return <ModalWrapStyled {...rest}>{children}</ModalWrapStyled>;
}