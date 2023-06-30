import React from 'react'
import styled from 'styled-components'

const ChallengeAddStyled = styled.div `
    width: 230px;
    height: 310px;
    top: 85px;
    margin: auto;
    display: flex;
    border: 1px red solid;
    border-radius: 50px;
    position: relative;
    & p {
      text-align: center;
    }
`

export default function ChallengeAdd({ children, ...rest }) {
  return (
    <ChallengeAddStyled {...rest}>{children}</ChallengeAddStyled>
  )
}
