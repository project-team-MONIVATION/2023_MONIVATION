// 가계부 - 캘린더 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function MoneyCalendar() {
  return (
    <div>
      <h1>가계부 캘린더</h1>
      <Link to='/calendar/chart'>통계</Link>
    </div>
  )
}
