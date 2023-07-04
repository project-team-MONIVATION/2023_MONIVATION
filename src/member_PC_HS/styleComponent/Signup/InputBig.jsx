import React from 'react'
import styled from 'styled-components'

const InputLarge = styled.input`
  padding : 10px 210px 10px 20px;
  border: none;
  border-radius : 20px;
  background-color : #E6E6E6;
  margin-top: 10px;
`

export default function InputBig({children, ...rest}) {
  return (
    <InputLarge {...rest}>{children}</InputLarge>
  )
}
