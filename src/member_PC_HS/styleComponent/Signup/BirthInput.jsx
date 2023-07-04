import React from 'react'
import styled from 'styled-components'

const BirthBtn = styled.select`
    width : 32%;
    padding : 10px;
    border: none;
    border-radius : 20px;
    background-color : #E6E6E6;
`

export default function BirthInput({children, ...rest}) {
  return (
    <BirthBtn {...rest}>{children}</BirthBtn>
  )
}
