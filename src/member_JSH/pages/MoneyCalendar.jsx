// 가계부 - 캘린더 페이지

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'
import DateDetail from '../../member_HHS/components/DateDetail';


export default function MoneyCalendar() {

  // HHS
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림/닫힘 상태를 관리하는 상태 변수

  // 모달을 열기 위한 이벤트 핸들러 함수
  const openModal = () => {
    setIsModalOpen(true);
  };

  // 모달을 닫기 위한 이벤트 핸들러 함수
  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  return (
    <div>
      <h1>가계부 캘린더</h1>
      <TotalStatComp />
      <CalendarComp />
      <Link to='/calendar/chart'>통계</Link>

      {/* HHS 추가 부분 모달 컴포넌트 */}
      <hr />
      <button onClick={openModal}>모달 열기</button>

      {isModalOpen && (
        <div style={{
          position: "fixed",
          top: "0",
          left: "0",
          right: "0",
          bottom: "0",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{
              width:"600px",
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "5px"
          }}>
            <DateDetail closeModal={closeModal} />
          </div>
        </div>
      )}
    </div>
  )
}
