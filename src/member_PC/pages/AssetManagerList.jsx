// 자산관리사 전체보기 페이지
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function AssetManagerList() {
  const field = ["#경제기초", "#기본세무", "#부동산", "#저축", "#연말정산", "#노후계획", "#주식", "#코인", "#사업자", "#프리랜서", "#상속/증여", "보험"];
  const [datalist, setDatalist] = useState();


  return (
    <div>

      {/* 탭 바 */}
      <div>
        <h1>자산관리사 목록</h1>
        <input type="text" />
        <button>검색</button>
      </div>
      
      {/* 분야 필터 */}
      <div>
        {field.map((f, i)=>(
          <button key={i}>{f}</button>
        ))}
      </div>
      
      {/* 모든 자산관리사 리스트 */}
      <div>
          {}
      </div>
      <Link to='/asset/managerID/profile'>자산관리사1(useParams 사용)</Link>
    </div>
  )
}
