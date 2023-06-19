// 개인회원 회원정보 수정 및 탈퇴 페이지

import React from 'react'
import { Link } from 'react-router-dom'

export default function MypageEdit() {
  return (
    <div>
      <div>
        <img src="" alt="프로필" />
        <p>이메일 </p>
        <p>회원구분 </p>
        <p>가입일 </p>
      </div>

      <form>
        <h3>회원정보 수정</h3>
        <div>
          <label>닉네임</label>
          <input type="text" />
        </div>
        <div>
          <label>출생</label>
          <input type="text" />
        </div>
        <div>
          <label>비밀번호</label>
          <input type="text" />
        </div>
        <div>
          <label>비밀번호 확인</label>
          <input type="text" />
        </div>
        <div>
          <label>연락처</label>
          <input type="number" />
          <button type='button'>인증번호 발송</button>
        </div>
        <div>
          <label>인증코드</label>
          <input type="number" />
        </div>

        <input type="submit" />
      </form>
    </div>
  )
}