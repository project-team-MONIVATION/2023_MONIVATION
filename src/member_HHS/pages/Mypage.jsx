// 마이페이지

import React, { useState, useEffect } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { db } from '../../database/firebase';
import { getDocs, where, query, collection } from 'firebase/firestore';

import BadgeBoxComp from '../../member_JSH/components/BadgeBoxComp';
import GorlBoxComp from '../components/GoalBoxComp';
import ActiveChallengeComp from '../components/ActiveChallengeComp';
import CompleteChallengeComp from '../components/CompleteChallengeComp';

import '../css/mypage.css'

export default function Mypage() {
    const user = useSelector((state) => state.user.user);
    const [datalist, setDatalist] = useState([]);
    const navigate = useNavigate();
    const [fmQuerySnapshot, setFmQuerySnapshot] = useState(null);
    const [puQuerySnapshot, setPuQuerySnapshot] = useState(null);

    useEffect(() => {
      const getData = async () => {
        try {
          const fmCollectionRef = collection(db, "financial_managers");
          const puCollectionRef = collection(db, "personal_users");
          const fmQuery = query(fmCollectionRef, where("uid", "==", user.uid));
          const puQuery = query(puCollectionRef, where("uid", "==", user.uid));

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
    }, [])
    
    if (fmQuerySnapshot === null || puQuerySnapshot === null) {
      // 데이터 로딩 중인 상태를 표시할 수 있습니다.
      return <div>Loading...</div>;
    }

    return (
      <div id='layout' className='mypage-wrap'>
        {/* 개인정보수정 */}
        <div
          className='grid-item'
        >
          { datalist.map((data)=>(
            <div key = { data.id }>
              
              {/* 개인유저 */}
              { puQuerySnapshot.empty ? null : (
                <div className='edit-btn-reservation'>
                  <Link to = {`/mypage/editpu/${data.id}`}>
                    <img src = "/img/edit.png" alt = "edit-icon" />
                  </Link>
                  <Link to = {`/mypage/reservationpu/${data.id}`}>상담예약 내역</Link>
                </div>
              )}
              {/* 자산관리사 */}
              { fmQuerySnapshot.empty ? null : (
                <div className='edit-btn-reservation'>
                  <Link to = {`/mypage/editfm/${data.id}`}>
                    <img src = "/img/edit.png" alt = "edit-icon" />
                  </Link>
                  <Link to = {`/mypage/reservationfm/${data.id}`}>상담예약 내역</Link>
                </div>
              ) }
                <div
                className='profile'
                >
                  <img
                    src = { data.photo }
                    width = { 80 }
                    height = { 80 }
                    alt = "프로필"
                    style = {{ borderRadius: "50%" , top : "17px", position:"absolute", left:"40px", border:"2px solid black"}}
                  />
                  <div>
                    <p>{ data.nickname }</p>
                    <p>{ data.email }</p>
                  </div>
                </div>
            </div>
          )) }
        </div>

        <div
          className = 'grid-item'
        >
          <div
            className='grid-item-row-two'
          >
            {/** JSH 챌린지 완료 뱃지 리스트 추가 */}
            <BadgeBoxComp />
          </div>
        </div>


        <div
          className='grid-item'
        >
          <h2
            className = 'div-short'
          >
            목표금액
          </h2>
          <div className='gorl-box'>
            <GorlBoxComp />
          </div>
        </div>

    <div
      className = 'grid-item'
    >
        <div
          className = 'active-challenge'
        >
          <h2
            className = 'div-long'
          >
            참여중인 챌린지</h2>
          <div>
            <ActiveChallengeComp />
          </div>
        </div>

        <div
          className = 'complete-challenge'
        >
          <h2
            className = 'div-long'
          
          >완료한 챌린지</h2>
          <div>
            <CompleteChallengeComp />
          </div>
        </div>
</div>

      </div>
    )
}