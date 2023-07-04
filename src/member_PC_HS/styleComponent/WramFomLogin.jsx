import React from 'react'
import styled from 'styled-components'

const FormBox = styled.div `
    position: absolute;
    background-image: ${`url(${require('../../assets/img/LoginBox.png')})`};
    width: 600px;
    height: 638px;
    top: 0;
    left: 0;
    box-shadow: 0px 10px 20px 5px rgba(0, 0, 0, 0.15);
    border-radius: 50px;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 1;
`

export default function WrapFormLogin({ children,...rest }) {
  return (
    <FormBox {...rest}>{children}</FormBox>
  )
}
