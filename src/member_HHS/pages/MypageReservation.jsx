// 개인회원 예약내역 페이지

import React from 'react'

export default function MypageReservation() {
  return (
    <div>
      <h1>나의 예약 내역</h1>
      <table style={{width: "500px", minHeight: "300px", margin: "auto"}}>
        <tbody>
          <tr>
            <td>접수된 예약</td>
          </tr>
          <tr>
            <td>상담자명</td>
            <td>연락처</td>
            <td>제목</td>
            <td>상담일자</td>
            <td>처리상태</td>
          </tr>
          <tr>
            <td>박찬</td>
            <td>010-0000-0000</td>
            <td>상담하고싶어</td>
            <td>2023-06-06</td>
            <td>예약중</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}