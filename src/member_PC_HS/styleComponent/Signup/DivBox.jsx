import React from 'react'
import styled from 'styled-components'

const Box = styled.div `
    margin: 5px 0;
`

export default function DivBox({ children,...rest }) {
  return (
    <Box {...rest}>{children}</Box>
  )
}
