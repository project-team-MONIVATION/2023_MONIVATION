import React from 'react'
import styled from 'styled-components'

const Btns = styled.div `
  & a {
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
    text-decoration: none;
    margin: 0;
    margin-top: 13px;
    line-height: 50px;
  }

  & p {
    font-family: 'SUITE-Regular';
    color: #8E8E8E;
    font-size: 0.8rem;
    margin-top: 20px;
  }
  & p::after {
    content: "------ ";
  }
  & p::before {
    content: " ------";
  }

  & div {
    display: flex;
    justify-content: center;
    margin-top: 10px;
  }

  & button {
    display: inline-block;
    border: none;
    background-color: transparent;
    cursor: pointer;
    padding: 0 10px;
  }
  & img {
    width: 30px;
  }

`

export default function WithEmailBtn({children, ...rest}) {
  return (
    <Btns {...rest}>{children}</Btns>
  )
}
