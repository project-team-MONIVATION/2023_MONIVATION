// 상담예약 페이지
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Calendar from 'react-calendar';

export default function AssetReservation() {

  const [date, setDate] = useState(new Date());

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
  }
  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`
    return valueDate;
  }

  return (
    <div>
      <h1>상담예약</h1>
      {/* 캘린더 */}
      <div style={{float: "left"}}>
        <div>
          <span>{date && changeDate(date)}</span>
        </div>

        <div>
          <Calendar onChange={ onClickDate } value={date}/>
        </div>
      </div>
      
      <div>
        <h2>상담신청</h2>
        <hr />
        <p>이름</p>
        <p>이메일 주소</p>
        <p>휴대폰 번호</p>
      </div>
      <Link to='/mypage/reservation'>예약</Link>
    </div>
  )
}
