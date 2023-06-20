// 가계부 - 캘린더 페이지

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'
//import DateDetail from '../../member_HHS/components/DateDetail';
import SEcomp from '../../member_LJC/components/SEcomp';
import SIcomp from '../../member_LJC/components/SIcomp';

export default function MoneyCalendar() {

  // HHS
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달의 열림/닫힘 상태를 관리하는 상태 변수
  
  // 수입 지출 컴프 바꾸기위한 버튼
  const [open, setOpen] = useState(false);


  // 모달을 열기 위한 이벤트 핸들러 함수
  // const openModal = () => {
  //   setIsModalOpen(true);
  // };

  // 모달을 닫기 위한 이벤트 핸들러 함수
  // const closeModal = () => {
  //   setIsModalOpen(false);
  // };




  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  return (
    <div>
      <h1>가계부 캘린더</h1>
      <TotalStatComp />
      <CalendarComp />
      {/* 통계컴프 */}
        <div style={{border: "1px solid brown"}}>
          <Link to='/calendar/chart'>통계</Link>
          <br />
          <button
            onClick={() => {setOpen((e) => !e);}}
          >지출
          </button>

          <button
            onClick={() => {setOpen((e) => !e);}}
          >수입
          </button>
            {open && (
            <div>
              <SEcomp/>
            </div>
            )}
            {! open && (
            <div>
              <SIcomp/>
            </div>
            )}
        </div>

      <br />
      {/* 할부금 컴프 */}
        <div style={{border: "1px solid red"}}>
          할부금
        </div>












      <div>챌린지</div>
      <div>목표금액</div>
      

      {/* HHS 추가 부분 모달 컴포넌트 */}
      <hr />
      {/* <button onClick={openModal}>모달 열기</button> */}

      {/* {isModalOpen && (
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
          </div> */}
        {/* </div> */}
      {/* )} */}

    </div>
  )
}
