import React from 'react'
import styled from 'styled-components'

const BirthBtn = styled.select`
    width : 115px;
    padding : 10px;
    margin : 5px;
    border: none;
    border-radius : 20px;
    background-color : #E6E6E6;
`

export default function BirthInput({children, ...rest}) {
  return (
    <BirthBtn {...rest}>{children}</BirthBtn>
  )
}
