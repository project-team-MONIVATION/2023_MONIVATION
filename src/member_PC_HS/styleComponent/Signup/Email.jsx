import React from 'react'
import styled from 'styled-components'

const EmailBox = styled.div `
  width: 100%;
`

export default function Email({ children,...rest }) {
  return (
    <EmailBox {...rest}>{children}</EmailBox>
  )
}
