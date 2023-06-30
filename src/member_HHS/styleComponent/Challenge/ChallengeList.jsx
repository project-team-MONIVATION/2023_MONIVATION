import React from 'react'
import styled from 'styled-components'

const ChallengeListStyled = styled.div `
    width: 230px;
    height: 310px;
    top: 85px;
margin: auto;
    display: flex;
    border: 1px red solid;
    border-radius: 50px;
    position: relative;
`

export default function ChallengeList({ children, ...rest }) {
  return (
    <ChallengeListStyled {...rest}>{children}</ChallengeListStyled>
  )
}
