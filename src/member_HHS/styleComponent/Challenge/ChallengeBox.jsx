import React from 'react'
import styled from 'styled-components'

const ChallengeBoxStyled = styled.div `
    /* position: relative;
    width: 710px;
    height: 318px;
    top: 85px;
    left: 50%;
    transform: translateX(-50%); */
    display: grid;

`

export default function ChallengeBox({ children, ...rest }) {
  return (
    <ChallengeBoxStyled {...rest}>{children}</ChallengeBoxStyled>
  )
}
