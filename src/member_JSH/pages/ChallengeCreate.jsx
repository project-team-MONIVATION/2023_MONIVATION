// 챌린지 생성하기 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function ChallengeCreate() {
  return (
    <div>
      <h1>챌린지 생성</h1>
      <Link to='/challenge/challengeID/view'>완료(useParam 사용해서 만든 챌린지 상세보기로 이동)</Link>
    </div>
  )
}
