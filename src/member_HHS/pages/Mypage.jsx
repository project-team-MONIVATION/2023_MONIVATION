// 개인회원 마이페이지

import React, { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { db } from '../../database/firebase';
import { getDocs, where, query, collection } from 'firebase/firestore';
import BadgeBoxComp from '../../member_JSH/components/BadgeBoxComp';

export default function Mypage() {
  const user = useSelector((state) => state.user.user);
  const [datalist, setDatalist] = useState([]);
  const navigate = useNavigate();
  const [fmQuerySnapshot, setFmQuerySnapshot] = useState(null);
  const [puQuerySnapshot, setPuQuerySnapshot] = useState(null);

  useEffect(() => {
    const getData = async () => {
      try {
        const fmCollectionRef = collection(db, 'financial_managers');
        const puCollectionRef = collection(db, 'personal_users');
        const fmQuery = query(fmCollectionRef, where('uid', '==', user.uid));
        const puQuery = query(puCollectionRef, where('uid', '==', user.uid));

        const [fmSnapshot, puSnapshot] = await Promise.all([
          getDocs(fmQuery),
          getDocs(puQuery),
        ]);
        
        setFmQuerySnapshot(fmSnapshot);
        setPuQuerySnapshot(puSnapshot);

        const dataArray = [];
        
        
        if (!fmSnapshot.empty) {
          fmSnapshot.forEach((doc) => {
            dataArray.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        } else if (!puSnapshot.empty) {
          puSnapshot.forEach((doc) => {
            dataArray.push({
              id: doc.id,
              ...doc.data(),
            });
          });
        } else {
          // uid값을 찾을 수 없음
          navigate('/');
        }

        setDatalist(dataArray);
      } catch (error) {
        console.log("실패했습니다: ", error);
      }
    };

    getData();
  }, [user]);

  useEffect(()=>{
    window.scrollTo({top: 0})
  },[])
  
  if (fmQuerySnapshot === null || puQuerySnapshot === null) {
    // 데이터 로딩 중인 상태를 표시할 수 있습니다.
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>마이페이지</h1>
      
      {/* 개인정보수정 */}
      <div>
        {datalist.map((data)=>(
          <div key={data.id}>
            <img src={data.photo} width={100} height={100} alt="프로필" />
            <br />
            {/* 개인유저 */}
            {puQuerySnapshot.empty ? null : (
              <div>
                <Link to={`/mypage/editpu/${data.id}`}>수정</Link>
                <br />
                <Link to={`/mypage/reservationpu/${data.id}`}>상담예약 내역</Link>
              </div>
            )}
            {/* 자산관리사 */}
            {fmQuerySnapshot.empty ? null : (
              <div>
                <Link to={`/mypage/editfm/${data.id}`}>수정</Link>
                <br />
                <Link to={`/mypage/reservationfm/${data.id}`}>상담예약 내역</Link>
              </div>
            )}
            <p>{data.email}</p>
            <p>{data.nickname}</p>
            <p>{data.id}</p>
          </div>
        ))}
      </div>

      <div>
        <p>내가 모은 뱃지</p>
        {/** JSH 챌린지 완료 뱃지 리스트 추가 */}
        <BadgeBoxComp />
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