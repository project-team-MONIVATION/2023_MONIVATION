import React from 'react'
import styled from 'styled-components'

const WelcomeBox = styled.div `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  width: 600px;
  height: 556px;
  padding: 60px;
  & h2 {
    font-family: 'SUITE-Regular';
    font-weight: 300;
    margin: 17px 0 39px 0;
    font-size: 1.7rem;
  }
`

export default function InputBox({ children,...rest }) {
    return (
      <WelcomeBox {...rest}>{children}</WelcomeBox>
    )
  }
