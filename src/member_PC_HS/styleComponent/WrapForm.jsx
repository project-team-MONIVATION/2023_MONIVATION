import React from 'react'
import styled from 'styled-components'

const FormBox = styled.div `
    position: absolute;
    width: 550px;
    height: 490px;
    top: 160px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #fff;
    border-radius: 0px 0px 26px 26px;
    display: flex;
    filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
    z-index: 1;
`

export default function WrapForm({ children,...rest }) {
  return (
    <FormBox {...rest}>{children}</FormBox>
  )
}
