import React from 'react'
import styled from 'styled-components'

const InputSubmitBtn = styled.input`
    display: block;
    margin : 0 auto;
`

export default function InputSubmit({...rest}) {
  return (
    <InputSubmitBtn {...rest}></InputSubmitBtn>
  )
}
