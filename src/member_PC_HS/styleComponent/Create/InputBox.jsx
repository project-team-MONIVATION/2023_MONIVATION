import React from 'react'
import styled from 'styled-components'

const WelcomeBox = styled.div `
  display: inline-block;
  text-align: center;
  width: 550px;
  padding-top: 80px;
  & h2 {
    font-family: 'SUITE-Regular';
    font-weight: 300;
    margin: 5px 0 30px 0;
    font-size: 1.7rem;
  }
`

export default function InputBox({ children,...rest }) {
    return (
      <WelcomeBox {...rest}>{children}</WelcomeBox>
    )
  }
