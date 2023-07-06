import React from 'react'
import styled from 'styled-components'

const ChallengeListStyled = styled.div `
    margin-top: 100px;
    margin-bottom: 10px;
    margin-left: 30px;
    height: 280px;
    width: 220px;
    background-color: #fff;
    border-radius: 40px;
    box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.20); /* 초기 그림자 설정 */
    position: relative;
    & img {
      width: 140px;
      height: 140px;
      border-radius: 40px;
      object-fit: cover; /* 이미지 비율을 유지하면서 컨테이너에 맞게 조정 */
      position: absolute;
      top: 30px;
      left: 50%;
      transform: translateX(-50%);
    }
    & p {
      position: absolute;
      top: 190px;
      left: 50%;
      transform: translateX(-50%);
      display: inline-block;
      width: 140px;
    }
    & > div {
      width: 170px;
      position: absolute;
      top: 240px;
      left: 50%;
      transform: translateX(-50%);
    }
`

export default function ChallengeList({ children, ...rest }) {
  return (
    <ChallengeListStyled {...rest}>{children}</ChallengeListStyled>
  )
}
