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
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

`

export default function ChallengeBox({ children, ...rest }) {
  return (
    <ChallengeBoxStyled {...rest}>{children}</ChallengeBoxStyled>
  )
}
