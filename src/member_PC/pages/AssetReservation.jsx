// 상담예약 페이지
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Calendar from 'react-calendar';
import { db } from '../../database/firebase';
import { doc , getDoc, getDocs, query, updateDoc, collection, where } from 'firebase/firestore';
import { useSelector } from 'react-redux';

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
    const valueDate = `${YYYY}-${MM}-${DD}`

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
      navigate('/mypage/reservation');
    }
  }  

  return (
    <div>
      <h1>상담예약</h1>
      {/* 캘린더 */}
      <div style={{float: "left"}}>
        <div>
          <span>{date && changeDate(date)}</span>
        </div>

        <div>
          <Calendar onChange={ onClickDate } value={date}/>
        </div>
      </div>

      <div style={{ display: show === true ? "block" : "none" }}>
        <form onSubmit={submitForm}>
          <h2>상담신청</h2>
          <hr />
          <div>
            <label>이름</label>
            <input type="text" value={name} onChange={(e)=>{setName(e.target.value)}}/>
          </div>
          <div>
            <label>이메일 주소</label>
            <input type="email" value={email} onChange={(e)=>{setEmail(e.target.value)}}/>
          </div>
          <div>
            <label>휴대폰 번호</label>
            <input type="number" value={phone} onChange={(e)=>{setPhone(e.target.value)}}/>
          </div>
          <hr />
          <div>
            <label>상담 제목</label>
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}}/>
          </div>
          <div>
            <label>상담 내용</label>
            <textarea cols={20} rows={5} value={content} onChange={(e)=>{setContent(e.target.value)}}></textarea>
          </div>
          <hr />
          <p>개인정보 수집 이용 동의에 대한 안내</p>
          <p>MONIVATION은 사용자 문의를 처리하기 위해 다음과 같이 개인정보를 수집 및 이용할 것입니다</p>
          <input type="checkbox" required/>
          <label>위 내용에 동의합니다</label>
          
          <input type="submit" value= "예약확정하기" />
        </form>
      </div>
    </div>
  )
}
