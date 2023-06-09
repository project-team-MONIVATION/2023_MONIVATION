// 상담예약 페이지
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { db } from '../../database/firebase';
import { doc , getDoc, getDocs, query, updateDoc, collection, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import './css/assetReservation.css'
import './css/reservationCalendar.css'

export default function AssetReservation() {
  const user = useSelector((state) => state.user.user);
  const params = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [date, setDate] = useState(new Date());
  const [confirmDate, setConfirmDate] = useState('');

  const minDate = new Date();

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
    setConfirmDate(newDate);
    setShow(true);
  }
  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}년 ${MM}월 ${DD}일`

    return valueDate;
  }

  const submitForm = async(e) => {
    e.preventDefault();

    const q = query(collection(db, "personal_users"), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const reservationArray = userData.reservation || [];

        const newReservation = {
          submitdate: new Date(),
          reservedate: confirmDate,
          name,
          email,
          phone,
          title,
          content,
          fmUid: params.id,
          done: false,
        };

        reservationArray.push(newReservation);

        await updateDoc(userDocRef, {
          reservation: reservationArray // 변경된 부분
        });
      }
    }

    const fmDocRef = doc(db, "financial_managers", params.id);
    const fmDocSnapshot = await getDoc(fmDocRef);
  
    if (fmDocSnapshot.exists()) {
      const fmData = fmDocSnapshot.data();
      const reservationArray = fmData.reservation || [];
  
      const newReservation = {
        reservedate: confirmDate,
        name,
        email,
        phone,
        title,
        content,
        userUid: user.uid,
        done : false,
      };
  
      reservationArray.push(newReservation);
  
      await updateDoc(fmDocRef, { 
        reservation: reservationArray
      });
  
      alert("예약이 접수됐습니다");
      navigate('/mypage');
    }
  }  

  return (
    <div id='layout' style={{overflow: 'hidden'}}>
      <div id='asset-reservation'>
        <h1 className='reservation-header'>상담예약</h1>
        <div className='reservation-box'>
          {/* 캘린더 */}
          <div className='reservation-calendar-box'>
            <div className='reservation-day'>
              <FontAwesomeIcon icon={faCalendarDays} color='black' fontSize={20}/>
              <span style={{fontWeight: 'bold', marginLeft: "5px"}}>{date && changeDate(date)}</span>
            </div>
            <div>
              <Calendar className='reservation-calendar' minDate={minDate} onChange={ onClickDate } value={date}/>
            </div>
          </div>

          {show && (
          <div className={`reservation-div`}>
            <form className='reservation-form' onSubmit={submitForm}>
              <h1 className='reservation-form-header'>상담신청</h1>
              <hr />
              <div>
                <label>이름</label>
                <input type="text" value={name} size={30} required onChange={(e)=>{setName(e.target.value)}}/>
              </div>
              <div>
                <label>이메일 주소</label>
                <input type="email" value={email} size={30} required onChange={(e)=>{setEmail(e.target.value)}}/>
              </div>
              <div>
                <label>휴대폰 번호</label>
                <input type="number" value={phone} size={30} required onChange={(e)=>{setPhone(e.target.value)}}/>
              </div>
              <hr />
              <div>
                <label>상담 제목</label>
                <input type="text" value={title} size={50} required onChange={(e)=>{setTitle(e.target.value)}}/>
              </div>
              <div>
                <label className='last-label'>상담 내용</label>
                <textarea cols={50} rows={10} value={content} required onChange={(e)=>{setContent(e.target.value)}}></textarea>
              </div>
              <hr />
              <div className='notification'>
                <h1>개인정보 수집 이용 동의에 대한 안내</h1>
                <p>MONIVATION은 사용자 문의를 처리하기 위해 다음과 같이 개인정보를 수집 및 이용할 것입니다</p>
                <div>
                  <input type="checkbox" required/>
                  <label>위 내용에 동의합니다</label>
                </div>
              </div>
              <input type="submit" className='reservation-submit-btn' value= "예약 확정하기" />
            </form>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
