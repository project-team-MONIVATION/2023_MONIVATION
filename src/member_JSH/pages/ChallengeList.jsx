// 챌린지 목록 페이지

import React from 'react'
import { Link } from 'react-router-dom'
import ChallengeSlick from '../components/ChallengeSlick'

export default function ChallengeList() {
  return (
    <div>
      <h1>챌린지 목록</h1>
      <ChallengeSlick />
      <br />
      <Link to='/challenge/create'>생성</Link>
    </div>
  )
}
