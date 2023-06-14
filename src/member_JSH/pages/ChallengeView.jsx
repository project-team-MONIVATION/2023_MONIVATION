// 챌린지 상세보기 페이지

import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, addDoc, query, getDocs, where, updateDoc, collection, Timestamp,whereField } from 'firebase/firestore'
import { signInWithEmailAndPassword, getAuth, onAuthStateChanged } from 'firebase/auth'
import { async } from 'q';
import { useNavigate } from 'react-router'

export default function ChallengeView() {
  //const user = useSelector((state)=>state.user);
  const [challenge, setChallenge] = useState();
  const q = query(collection(db, "personal_users"));
  //const auth = getAuth();
  const user = useSelector((state)=>state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  useEffect (()=>{
    const getUser = async()=> {
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((doc)=>{
        console.log(doc.data());
      });
    }
    getUser();
  },[])
  // 참여하기 활성화 함수
  // 현재 로그인한 유저의 uid가 동일한 문서의
  // 필드의 값을 변경하는 함수.
  

  const hadleInvolve = () => {
    console.log(user);
  }

  
  return (
    <div>
      <h1>챌린지 상세보기</h1>
      <div>
        <img src="" alt="" />
        <p>챌린지명</p>
        <p>기간</p>
        <p>등록자명</p>
        <button onClick={hadleInvolve}>참여하기</button>
        <button>공유</button>
      </div>
      <div>
        <div>
          <p>챌린지 상세 설명란</p>
        </div>
        <div>
          <h1>인증 게시판</h1>
          <img src="" alt="프로필 사진" />
          <p>닉네임</p>
          <button>좋아요</button>
        </div>
      </div>
    </div>
  )
}
