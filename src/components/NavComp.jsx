import React from 'react'
import { NavLink } from 'react-router-dom'

export default function NavComp() {
  return (
    <div>
      <NavLink to='/'>로고</NavLink>
      <NavLink to='/calendar'>가계부</NavLink>
      <NavLink to='/challenge'>챌린지</NavLink>
      <NavLink to='/asset'>자산관리</NavLink>
      <NavLink to='/mypage'>마이페이지</NavLink>
      <NavLink to='/'>로그아웃</NavLink>
    </div>
  )
}
