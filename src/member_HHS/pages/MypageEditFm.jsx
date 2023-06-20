// 개인회원 회원정보 수정 및 탈퇴 페이지
import { db } from '../../database/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function MypageEditFm() {
  const [profile, setProfile] = useState();
  const params = useParams();

  useEffect(()=>{
    const getProfile = async() => {
      const docSnap = await getDoc( doc(db, "financial_managers", params.id) );
      setProfile({
        ...docSnap.data()
      })
    }
    getProfile();
  }, [])

  return (
    <div>
      {profile && 
      <div>
        <img src={profile.photo} width={100} height={100} alt="프로필" />
        <p>이메일 {profile.email}</p>
        <p>회원구분 <span>자산관리사</span></p>
        <p>가입일은 타임스탬프라 위의 함수에서 변형시켜서 써야함</p>
      </div>
      }

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