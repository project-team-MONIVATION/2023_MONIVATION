// 상담예약 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function AssetReservation() {
  return (
    <div>
      <h1>상담예약</h1>
      <Link to='/mypage/reservation'>예약</Link>
    </div>
  )
}
