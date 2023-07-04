import React from 'react'
import styled from 'styled-components'

const ChallengeBoxStyled = styled.div `
  border: 1px solid black;
  width: 500px;
  height: 500px;
display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

`

export default function ChallengeBox({ children, ...rest }) {
  return (
    <ChallengeBoxStyled {...rest}>{children}</ChallengeBoxStyled>
  )
}
