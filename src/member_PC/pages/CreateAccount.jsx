// 회원가입 - 회원 종류 선택 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function CreateAccount() {
  return (
    <div>
      <Link to='/'>로고</Link>
      <h1>CreateAccount</h1>
      <Link to='/createaccount/personaluser'>개인회원 회원가입</Link>
      <br />
      <Link to='/createaccount/financialmanager'>자산관리사 회원가입</Link>
    </div>
  )
}
