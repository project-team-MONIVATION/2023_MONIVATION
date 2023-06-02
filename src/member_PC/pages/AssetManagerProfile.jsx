// 자산관리사 프로필 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function AssetManagerProfile() {
  return (
    <div>
      <h1>자산관리사 프로필</h1>
      <Link to='/asset/managerID/profile/reservation'>상담예약(useParams 사용)</Link>
    </div>
  )
}
