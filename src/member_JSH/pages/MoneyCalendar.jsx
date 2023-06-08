// 가계부 - 캘린더 페이지

import React from 'react'
import { Link } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'

export default function MoneyCalendar() {
  return (
    <div>
      <h1>가계부 캘린더</h1>
      <TotalStatComp />
      <CalendarComp />
      <Link to='/calendar/chart'>통계</Link>
    </div>
  )
}
