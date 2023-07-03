import React from 'react'
import styled from 'styled-components'

const InputMini = styled.input`
  box-sizing: border-box;
  width: 65%;
  padding : 10px 20px;
  border: none;
  border-radius : 20px;
  background-color : #E6E6E6;
  font-family: 'SUITE-Regular';
  margin-top: 10px;
`

export default function InputSmall({children, ...rest}) {
  return (
    <InputMini {...rest}>{children}</InputMini>
  )
}
