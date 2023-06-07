import React from 'react'
import styled from 'styled-components'

const InputMini = styled.input`
  padding : 10px 90px 10px 20px;
  border: none;
  border-radius : 20px;
  background-color : #E6E6E6;
  font-family: 'SUITE-Regular';
`

export default function InputSmall({children, ...rest}) {
  return (
    <InputMini {...rest}>{children}</InputMini>
  )
}
