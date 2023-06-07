import React from 'react'
import styled from 'styled-components'

const EmailBox = styled.div `
    margin-top: 40px;
`

export default function Email({ children,...rest }) {
  return (
    <EmailBox {...rest}>{children}</EmailBox>
  )
}
