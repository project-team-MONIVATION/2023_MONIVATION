import React from 'react'
import styled from 'styled-components'

const SignupBtn = styled.button`
    display: inline-block;
    border-radius: 26px;
    background-image: linear-gradient(to right, #21D6CC, #7D21CF);
    width: 330px;
    height: 48px;
    border: none;
    color: #fff;
    margin-bottom: 15px;
    font-family: 'Cafe24Ssurround';
    font-size: 1rem;
    cursor: pointer;
`

export default function SignupForm({ children,...rest }) {
  return (
    <SignupBtn {...rest}>{children}</SignupBtn>
  )
}
