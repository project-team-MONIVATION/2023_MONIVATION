import React from 'react'
import styled from 'styled-components'

const Btn = styled.button`
  width : 110px;
  padding : 8px 0 9px 0;
  border: none;
  border-radius : 20px;
  background-color : #2CA0C6;
  color : white;
  margin-left : 10px;
  font-family: 'SUITE-Regular';
`

export default function InputBtn({children, ...rest}) {
  return (
    <Btn {...rest}>{children}</Btn>
  )
}
