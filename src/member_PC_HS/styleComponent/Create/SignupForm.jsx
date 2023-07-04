import React from 'react'
import styled from 'styled-components'

const SignupBtn = styled.button`
    display: inline-block;
    border-radius: 50px;
    background-image: linear-gradient(170deg, #21D6CC 10%, #7D21CF 90%);
    width: 350px;
    height: 60px;
    border: none;
    color: #fff;
    font-family: 'Cafe24Ssurround';
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
`

export default function SignupForm({ children,...rest }) {
  return (
    <SignupBtn {...rest}>{children}</SignupBtn>
  )
}
