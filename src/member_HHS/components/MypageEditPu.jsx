// 개인회원 회원정보 수정 및 탈퇴 페이지

import { db } from '../../database/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function MypageEditPu() {
  const [profile, setProfile] = useState();
  const params = useParams();


  const [nickname, setNickname] = useState(''); // 닉네임 상태변수 설정


  useEffect(()=>{
    const getProfile = async() => {
      const docSnap = await getDoc( doc(db, "personal_users", params.id) );
      setProfile({
        ...docSnap.data()
      })
    }
    getProfile();
  }, [])

console.log(nickname)

  return (
    <div>
      {profile && 
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src={profile.photo} width={100} height={100} alt="프로필" style={{borderRadius: "50%"}} />
        <div>
          <p>이메일 {profile.email}</p>
          <p>회원구분 <span>개인회원</span></p>
          <p>가입일은 타임스탬프라 위의 함수에서 변형시켜서 써야함</p>
        </div>
      </div>
      }

      <form>
        <h2>회원정보 수정</h2>
        <div>
          <label>닉네임</label>
          <input type="text" value={nickname} onChange={(e) => setNickname(e.target.value)}/>
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
          <button type='button'>인증번호 확인</button>
        </div>
        
        <input type="submit" />
      </form>
    </div>
  )
}