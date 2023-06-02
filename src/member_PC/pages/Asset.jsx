// 자산관리(메인) 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function Asset() {
  return (
    <div>
      <h1>자산관리</h1>
      <Link to='/asset/managerlist'>더보기</Link>
    </div>
  )
}
