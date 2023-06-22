// 개인회원 회원정보 수정 및 탈퇴 페이지
import { db } from '../../database/firebase';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

export default function MypageEditFm() {
  const [profile, setProfile] = useState();
  const params = useParams();
  const [selectedButtons, setSelectedButtons] = useState([]);

  /* 전문분야 버튼 3개 입력 */
  const handleButtonClick = (buttonName) => {
    const isButtonSelected = selectedButtons.includes(buttonName);

    if (isButtonSelected) {
      const updatedButtons = selectedButtons.filter((name) => name !== buttonName);
      setSelectedButtons(updatedButtons);
    } else {
      if (selectedButtons.length < 3) {
        const updatedButtons = [...selectedButtons, buttonName];
        setSelectedButtons(updatedButtons);
      }
    }
  };
  const isButtonSelected = (buttonName) => selectedButtons.includes(buttonName);

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
      <div style={{display: "flex", alignItems: "center", justifyContent: "center"}}>
        <img src={profile.photo} width={100} height={100} alt="프로필" style={{borderRadius: "50%"}}/>
        <div>
          <p>이메일 {profile.email}</p>
          <p>회원구분 <span>자산관리사</span></p>
          <p>가입일은 타임스탬프라 위의 함수에서 변형시켜서 써야함</p>
        </div>
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
          <button type='button'>인증번호 확인</button>
        </div>

        <label htmlFor="">Professional Field(최대 3개)</label>
        <div>
          {['#경제기초', '#기본세무', '#부동산', '#저축'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleButtonClick(category)}
              className={isButtonSelected(category) ? 'selected' : ''}
              style={{ backgroundColor: isButtonSelected(category) ? 'gray' : '' }}
            >
              {category}
            </button>
          ))}
        </div>
        <div>
          {['#연말정산', '#노후계획', '#주식', '#코인'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleButtonClick(category)}
              className={isButtonSelected(category) ? 'selected' : ''}
              style={{ backgroundColor: isButtonSelected(category) ? 'gray' : '' }}
            >
              {category}
            </button>
          ))}
        </div>
        <div>
          {['#사업자', '#프리랜서', '#상속/증여', '#보험'].map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => handleButtonClick(category)}
              className={isButtonSelected(category) ? 'selected' : ''}
              style={{ backgroundColor: isButtonSelected(category) ? 'gray' : '' }}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 자산관리사 자기소개 */}
        <div>
          <p>Self - introduction</p>
          <textarea
            style={{backgroundColor: "#E6E6E6", borderRadius: "20px", border: "none"}}
            name="" 
            id="" 
            cols="48" 
            rows="5"
            placeholder='자산관리 페이지에서 보여지는 내용입니다'
            ></textarea>
          <br />
        </div>

        <input type="submit" />
      </form>
    </div>
  )
}