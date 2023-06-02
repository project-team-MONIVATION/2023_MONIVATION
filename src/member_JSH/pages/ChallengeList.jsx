// 챌린지 목록 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function ChallengeList() {
  return (
    <div>
      <h1>챌린지 목록</h1>
      <Link to='/challenge/challengeID/view'>챌린지1(useParams 설정)</Link>
      <br />
      <Link to='/challenge/create'>생성</Link>
    </div>
  )
}
