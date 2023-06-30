import React from 'react'
import styled from 'styled-components'

const LoginForm = styled.form `
  & > input[type="text"],
  & > input[type="password"] {
    display: inline-block;
    border-radius: 26px;
    background-color: #E6E6E6;
    font-family: 'SUITE-Regular';
    width: 330px;
    height: 44px;
    border: none;
    margin-bottom: 15px;
    font-size: 1rem;
    padding: 0 30px;
    margin-bottom: 7px;
}
  & > input[type="submit"] {
    border-radius: 26px;
    width: 200px;
    height: 48px;
    margin-top: 10px;
    background-image: linear-gradient(to right, #21D6CC, #7D21CF);
    border: none;
    color: #fff;
    font-family: 'Cafe24Ssurround';
    font-size: 1.2rem;
    cursor: pointer;
  }
`

export default function EmailWithPassword({ children, ...rest }) {
  return (
    <LoginForm {...rest}>{children}</LoginForm>
  )
}
