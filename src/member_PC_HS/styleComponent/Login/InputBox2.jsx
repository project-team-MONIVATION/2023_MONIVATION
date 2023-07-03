import React from 'react'
import styled from 'styled-components'

const WelcomeBackBox = styled.div `
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 556px;
  padding: 59px;
  & h2 {
    font-family: 'SUITE-Regular';
    margin: 17px 0 23px 0;
    font-size: 1.7rem;
    font-weight: 300;
  }
`

export default function InputBox2({ children,...rest }) {
  return (
    <WelcomeBackBox {...rest}>{children}</WelcomeBackBox>
  )
}
