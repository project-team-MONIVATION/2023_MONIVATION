import React from 'react'
import styled from 'styled-components'

const LoginForm = styled.form `
  & > input[type="text"],
  & > input[type="password"] {
    display: inline-block;
    border-radius: 26px;
    background-color: #E6E6E6;
    font-family: 'SUITE-Regular';
    box-sizing: border-box;
    width: 350px;
    height: 50px;
    border: none;
    margin-bottom: 15px;
    font-size: 1rem;
    padding: 0 30px;
    margin-bottom: 10px;
}
  & > input[type="submit"] {
    border-radius: 50px;
    width: 350px;
    height: 60px;
    margin-top: 13px;
    margin-bottom: 5px;
    background-image: linear-gradient(170deg, #21D6CC 10%, #7D21CF 90%);
    border: none;
    color: #fff;
    font-family: 'Cafe24Ssurround';
    font-size: 18px;
    cursor: pointer;
  }
`

export default function EmailWithPassword({ children, ...rest }) {
  return (
    <LoginForm {...rest}>{children}</LoginForm>
  )
}
