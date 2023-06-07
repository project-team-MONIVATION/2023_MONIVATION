import React from 'react'
import styled from 'styled-components'

const FieldBtn = styled.button`
    background-color: #D9D9D9;
    padding : 4px 14px;
    border: none;
    border-radius : 15px;
    margin : 4px 6px;
`

export default function FieldBtns({children, ...rest}) {
  return (
    <FieldBtn {...rest}>{children}</FieldBtn>
  )
}
