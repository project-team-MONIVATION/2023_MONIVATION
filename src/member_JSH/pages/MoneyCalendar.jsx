// 가계부 - 캘린더 페이지

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'

export default function MoneyCalendar() {
  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  return (
    <div>
      <h1>가계부 캘린더</h1>
      <TotalStatComp />
      <CalendarComp />
      <Link to='/calendar/chart/income'>통계</Link>
      <div>할부금</div>
      <div>첼린지</div>
      <div>목표금액</div>
    </div>
  )
}
