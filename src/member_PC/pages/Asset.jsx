// 자산관리(메인) 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function Asset() {
  return (
    <div>
      <div>
        <h2>Best 자산관리사</h2>
        <Link to='/asset/managerlist'>더보기</Link>
      </div>
    </div>
  )
}
