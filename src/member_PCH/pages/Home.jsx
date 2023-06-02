// 메인페이지 

import React from 'react'
import { Link } from 'react-router-dom'
import IncomeModalComp from '../components/IncomeModalComp'

export default function Home() {
  return (
    <div>
      <h1>Home</h1>
      <div>
        로그인 안 하면 보임
        <br />
        <Link to='/login'>로그인</Link>
        <Link to='/createaccount'>회원가입</Link>
      </div>
      <br />
      <div>
        로그인 하면 보임
        <br />
        <Link to='/calendar'>가계부</Link>
        <Link to='/challenge'>챌린지</Link>
        <Link to='/asset'>자산관리</Link>
        <Link to='/mypage'>마이페이지</Link>
        <Link to='/'>로그아웃</Link>
      </div>
      <hr />
      <IncomeModalComp/>
    </div>
  )
}
