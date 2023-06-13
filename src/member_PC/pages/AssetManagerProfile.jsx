// 자산관리사 프로필 페이지
import { db } from '../../database/firebase';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { doc , getDoc, getDocs, updateDoc, collection, query, where } from 'firebase/firestore';
import Calendar from 'react-calendar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons"; 


export default function AssetManagerProfile() {
  const user = useSelector((state) => state.user.user);

  const [profile, setProfile] = useState();
  const params = useParams();

  const [date, setDate] = useState(new Date());

  const handleLike = async () => {
  };
  

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
  }
  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`
    return valueDate;
  }

  useEffect(()=>{
    const getProfile = async() => {
      const docSnap = await getDoc( doc(db, "financial_managers", params.id));
      setProfile({
        ...docSnap.data()
      })
    }
    getProfile();

  }, [])

  return (
    <div>
      <h1>자산관리사 프로필</h1>
      {
        profile &&
        <div style={{float: "left"}}>
          <div style={{width: "250px", height: "300px", backgroundColor: "gray", margin: "auto"}}>
            {profile.photo}
          </div>
          <div style={{display: "flex", alignItems: "center"}}>
            <div>
              <p>{profile.name}</p>
              <p>좋아요 수: {profile.likeNum}</p>
              {profile.intro.map((intro, i)=>(
                <p key={i}>{intro}</p>
              ))}
            </div>
            <div>
              <FontAwesomeIcon
                icon={faHeart}
                fontSize={20}
                style={{ color: "black" }}
                onClick={() => handleLike()}
              />
            </div>
          </div>
        </div> 
      }
      {/* 캘린더 */}
        <div>
          <span>{date && changeDate(date)}</span>
        </div>

        <div>
          <Calendar onChange={ onClickDate } value={date}/>
        </div>

      <Link to='/asset/managerID/profile/reservation'>상담예약(useParams 사용)</Link>
    </div>
  )
}
