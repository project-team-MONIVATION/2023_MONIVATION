import React from 'react'
import styled from 'styled-components'

const InputSubmitBtn = styled.input`
    display: block;
    margin : 15px auto;
    border-radius: 26px;
    background-image: linear-gradient(to right, #21D6CC, #7D21CF);
    width: 300px;
    height: 48px;
    border: none;
    color: #fff;
    margin-bottom: 15px;
    font-size: 1rem;
    cursor: pointer;
`

export default function InputSubmit({...rest}) {
  return (
    <InputSubmitBtn {...rest}></InputSubmitBtn>
  )
}
