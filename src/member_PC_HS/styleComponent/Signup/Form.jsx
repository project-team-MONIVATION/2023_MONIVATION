import React from 'react'
import styled from 'styled-components'

const FormBox = styled.form`
    width : 378px;
    margin : auto;
    text-align : left;
    display: flex;
    flex-direction: column;
    align-items: center;
`

export default function Form({children, ...rest}) {
  return (
    <FormBox {...rest}>{children}</FormBox>
  )
}
