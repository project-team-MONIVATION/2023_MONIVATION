// 자산관리사 프로필 페이지
import { db } from '../../database/firebase';
import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { doc , getDoc, getDocs, updateDoc, collection, query, where, QuerySnapshot } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons"; 

import Calendar from 'react-calendar';
import './css/calendarMini.css'

export default function AssetManagerProfile() {
  const [liked, setLiked] = useState(false);
  const user = useSelector((state) => state.user.user);

  const [comment, setComment] = useState();
  const [profile, setProfile] = useState('');
  const params = useParams();

  const [date, setDate] = useState(new Date());

  const handleLike = async () => {
    // 클릭 상태 변경
    setLiked(!liked);
  
    // Firestore에서 해당 문서의 likeNum 업데이트
    const fmDocRef = doc(db, "financial_managers", params.id);
    const fmDocSnap = await getDoc(fmDocRef);
    
    if (fmDocSnap.exists()) {
      const currentLikeNum = fmDocSnap.data().likeNum || 0;
      const newLikeNum = liked ? currentLikeNum - 1 : currentLikeNum + 1;
      await updateDoc(fmDocRef, { likeNum: newLikeNum });
    }

    // personal_users의 배열에 추가
    const q = query(collection(db, "personal_users"), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const fmArray = userData.likeFm || [];

        const fmIndex = fmArray.findIndex(fm => fm.fmUid === params.id); // fmUid가 현재 프로필의 id와 일치하는 인덱스 찾기

        if (fmIndex !== -1) {
          // 이미 좋아요한 자산관리사인 경우, 배열에서 해당 인덱스를 삭제
          fmArray.splice(fmIndex, 1);
        } else {
          // 좋아요하지 않은 자산관리사인 경우, 배열에 새로운 자산관리사 추가
          const newFm = {
            fmUid: params.id,
          };
          fmArray.push(newFm);
        }

        await updateDoc(userDocRef, {
          likeFm: [...fmArray] // 변경된 부분
        });
      }
    }
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

    const checkLiked = async () => {
      if (user && user.uid) {
      // personal_users에서 현재 사용자의 좋아요 상태 확인
      const q = query(collection(db, "personal_users"), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const fmArray = userData.likeFm || [];

          const fmIndex = fmArray.findIndex(fm => fm.fmUid === params.id); // fmUid가 현재 프로필의 id와 일치하는 인덱스 찾기

          if (fmIndex !== -1) {
            setLiked(true);
          }
        }
      }
    }
  }
  checkLiked();
  }, [params.id, user])

  useEffect(()=>{
    const getComments = async () => {
      const q = query(collection(db, "financial_review"), where('fmDocid', '==', params.id));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const dataArray = querySnapshot.docs.map((doc) => doc.data());
        setComment(dataArray);
      }
    }
    getComments();
  }, [])

  return (
    <div style={{backgroundColor: "#735BF3"}}>
      <div style={{backgroundColor: "white", width: "90%", margin: "auto", borderRadius: "50px"}}>
        <h1>자산관리사 프로필</h1>
        <div style={{margin:"auto", width: "80%", display: "flex", justifyContent: "space-evenly"}}>
        {
          profile &&
          <div>
            <div style={{width: "350px", height: "300px", backgroundColor: "gray", margin: "auto", backgroundImage: `url(${profile.photo})`, backgroundSize: "cover", backgroundPosition: "center"}}>
            </div>
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "10px"}}>
              <div>
                <p>{profile.name}</p>
                {profile.intro.map((intro, i)=>(
                  <p key={i}>{intro}</p>
                ))}
              </div>
              <div style={{border: "1px solid black", padding: "10px 5px"}}>
                <FontAwesomeIcon
                  icon={faHeart}
                  fontSize={20}
                  style={{ color: liked ? "red" : "black" }}
                  onClick={() => handleLike()}
                />
                <p style={{paddingTop: "5px"}}>좋아요</p>
              </div>
            </div>
          </div> 
        }
        {/* 캘린더 */}

          <div>
            <Calendar onChange={ onClickDate } value={date}/>
            <div style={{backgroundColor: "#735BF3", borderRadius: "20px", display: "inline-block", margin: "20px", padding: "10px 20px"}}>
              <Link style={{color: "white", fontWeight: "bold"}} to={`/asset/managerID/profile/reservation/${params.id}`}>상담예약</Link>
            </div>
          </div>
        </div>


        <h1 style={{textAlign: "left", margin: "10px 160px", fontSize: "1.5rem"}}>자문사 평가</h1>
        <div>
        {
          comment ? comment.map((c, i)=>{
            
            const upDate = new Date(c.date.toDate());

            // 원하는 형식으로 날짜를 출력
            const year = upDate.getFullYear();
            const month = upDate.getMonth() + 1; 
            const day = upDate.getDate();
            const hour = upDate.getHours();
            const minutes = upDate.getMinutes();
            const seconds = upDate.getSeconds();

            return (
            <div key={i} style={{textAlign: "left", borderTop: "solid 1px black", width: "80%",   margin: "auto", display: "flex", alignItems: "center"}}> 
              <div style={{margin: "10px"}}>
                <img src={c.photo} alt="프로필사진" width={50} height={50} style={{borderRadius: "50%"}} />
              </div>
              <div style={{marginLeft: "10px"}}>
                <p style={{margin: "10px"}}>{c.nickname}</p>
                <p style={{margin: "10px", fontSize: "0.8rem", fontWeight: "bold"}}>{year}.{month}.{day}.{hour}:{minutes}:{seconds}</p>
                <p style={{margin: "10px"}}>{c.text}</p>
              </div>
            </div>
            )
          })
          :
          (  
            <div style={{borderTop : "1px solid black", borderBottom: "1px solid black", width: "80%", margin: "auto"}}>
              <p style={{margin: "50px"}}>등록된 평가가 없습니다.</p>
            </div>
          )
        }
        </div>
      </div>
    </div>
  )
}
