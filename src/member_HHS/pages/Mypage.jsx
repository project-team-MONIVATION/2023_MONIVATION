// 개인회원 마이페이지

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Mypage() {
  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])

  return (
    <div>
      <h1>마이페이지</h1>
      <Link to ='/mypage/edit'>수정</Link>
      <Link to='/mypage/reservation'>상담예약내역</Link>
    </div>
  )
}