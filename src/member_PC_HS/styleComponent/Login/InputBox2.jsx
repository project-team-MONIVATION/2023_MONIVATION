import React from 'react'
import styled from 'styled-components'

const WelcomeBackBox = styled.div `
  display: inline-block;
  text-align: center;
  width: 550px;
  padding-top: 50px;
  & h2 {
    font-family: 'SUITE-Regular';
    margin: 5px 0 10px 0;
    font-size: 1.7rem;
    font-weight: 300;
  }
`

export default function InputBox2({ children,...rest }) {
  return (
    <WelcomeBackBox {...rest}>{children}</WelcomeBackBox>
  )
}
