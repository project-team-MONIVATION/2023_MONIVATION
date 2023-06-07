import React from 'react'
import styled from 'styled-components'

const FormBox = styled.form`
    width : 80%;
    margin : auto;
    text-align : left;
`

export default function Form({children, ...rest}) {
  return (
    <FormBox {...rest}>{children}</FormBox>
  )
}
