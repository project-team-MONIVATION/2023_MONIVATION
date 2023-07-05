import React from 'react'
import styled from 'styled-components'

const ChallengeAddStyled = styled.div `
    margin-top: 100px;
    margin-bottom: 10px;
    margin-left: 30px;
    height: 280px;
    width: 220px;
    background-color: #fff;
    border-radius: 40px;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.20); /* 초기 그림자 설정 */
    & > a {
      color: black;
      & p:nth-child(1) {
        font-size: 17rem;
        display: inline-block;
        margin-top: 10px;
        height: 100px;
        color: #8E8E8E;
        :hover {
          color: #F4D750;
          transition: 0.5s;
        }
      }
      p:nth-child(2) {
        line-height: 23px;
        letter-spacing: 1px;
        & span {
        color: red;
        }
      }
      
    }
`

export default function ChallengeAdd({ children, ...rest }) {
  return (
    <ChallengeAddStyled {...rest}>{children}</ChallengeAddStyled>
  )
}
