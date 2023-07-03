import React from 'react'
import styled from 'styled-components'

const Btns = styled.div `
  & a {
    display: inline-block;
    border-radius: 50px;
    background-image: linear-gradient(170deg, #21D6CC 10%, #7D21CF 90%);
    width: 350px;
    height: 60px;
    border: none;
    color: #fff;
    margin-bottom: 15px;
    font-family: 'Cafe24Ssurround';
    font-size: 18px;
    text-decoration: none;
    margin: 0;
    margin-top: 24px;
    margin-bottom: 14px;
    line-height: 60px;
  }

  & p {
    font-family: 'SUITE-Regular';
    color: #8E8E8E;
    font-size: 0.8rem;
    margin-top: 15px;
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
    margin-top: 17px;
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
