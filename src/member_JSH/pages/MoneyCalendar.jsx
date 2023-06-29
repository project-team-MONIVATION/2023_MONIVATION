// 가계부 - 캘린더 페이지

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TotalStatComp from '../components/TotalStatComp'
import CalendarComp from '../components/CalendarComp'
// 통계
import SEcomp from '../../member_LJC/components/SEcomp';
import SIcomp from '../../member_LJC/components/SIcomp';
// 할부금
import InstallmentsComp from '../../member_LJC/components/InstallmentsComp';
// 목표금액
import TargetAmountComp from '../../member_LJC/components/TargetAmountComp';

import MyChallengeSlideComp from '../components/MyChallengeSlideComp';

export default function MoneyCalendar() {

  // 수입 지출 컴프 바꾸기위한 버튼
  const [open, setOpen] = useState(false);

  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  return (
    <div id='layout'>
      <div
        style={{display: "flex", justifyContent: "center", alignItems:"flex-start",
      height:"75%",maxHeight:"75%", backgroundColor : "transparent", maxWidth:"80%"}}
      >
        <TotalStatComp />
        <CalendarComp />
      </div>

      <hr />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "85%"
        }}
      >
        {/* 통계 컴포넌트 */}
        <div style={{border: "1px solid brown", width: "25%", height: "150px", overflow:"hidden"}}>
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

        {/* 할부금 컴포넌트 */}
        <div style={{border: "1px solid red", width: "25%", height: "150px"}}>
          <InstallmentsComp/>
        </div>

        {/* JSH 챌린지 컴포넌트 */}
        <div style={{border: "1px solid red", width: "25%", height: "150px"}}>
          <MyChallengeSlideComp />
        </div>
        
        {/* 목표금액 컴포넌트 */}
        <div style={{border: "1px solid red", width: "25%", height: "150px"}}>
          <div>
            <TargetAmountComp/>
          </div>
          
        </div>
      </div>
    </div>
  )
}
