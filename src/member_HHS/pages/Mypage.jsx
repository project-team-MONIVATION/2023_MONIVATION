// 개인회원 마이페이지

import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Mypage() {
  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])

  return (
    <div>
      <h1>마이페이지</h1>
      
      <div>
        <img src="" alt="프로필" />
        <p>닉네임</p>
        <p>abc123@gmail.com</p>
        <Link to ='/mypage/edit'>수정</Link>
        <div>
          <Link to='/mypage/reservation'>상담예약 내역</Link>
        </div>
      </div>

      <div>
        <p>내가 모은 뱃지</p>
        <span>식사는 거를수 없지</span>
        <span>세상엔 맛있는게 너무 많아</span>
        <span>오늘도 커피 수혈</span>
        <span>버스타자</span>
      </div>

      <div>
        <p>목표금액</p>
        <div>
          <p>노트북 D-4까지 10,000원 저금하면 돼요!</p>
        </div>
      </div>

      <div>
        <p>참여중인 챌린지</p>
        <div></div>
      </div>

      <div>
        <p>완료중인 챌린지</p>
        <div></div>
      </div>
    </div>
  )
}