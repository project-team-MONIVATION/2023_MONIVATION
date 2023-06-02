// 자산관리사 전체보기 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function AssetManagerList() {
  return (
    <div>
      <h1>자산관리사 목록</h1>
      <Link to='/asset/managerID/profile'>자산관리사1(useParams 사용)</Link>
    </div>
  )
}
