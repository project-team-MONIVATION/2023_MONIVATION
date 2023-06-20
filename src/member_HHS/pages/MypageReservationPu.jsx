import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { db } from '../../database/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default function MypageReservationFm() {
  const [reserv, setReserv] = useState();
  const params = useParams();
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(()=>{
    const getReserv = async() => {
      const docSnap = await getDoc( doc(db, "personal_users", params.id) );
      setReserv({
        ...docSnap.data()
      })
    }
    getReserv();
  }, [])

  // 모달 창 열기
  const openModal = (reservation) => {
    setSelectedReservation(reservation);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setSelectedReservation(null);
  };

  return (
    <div>
      <h1>나의 예약 내역</h1>
      <table style={{width: "500px", minHeight: "300px", margin: "auto"}}>
        <tbody>
          <tr>
            <td>접수된 예약</td>
          </tr>
          <tr>
            <td>상담자명</td>
            <td>연락처</td>
            <td>제목</td>
            <td>상담일자</td>
            <td>처리상태</td>
          </tr>
          {reserv == null ? 
          (
            <tr>
              <td></td>
              <td></td>
              <td>접수된 내역이 없습니다</td>
              <td></td>
              <td></td>
            </tr>
          )
          : 
          (reserv.reservation.map((r, i)=> {
            const reserveDate = new Date(r.submitdate.toDate());

            // 원하는 형식으로 날짜를 출력
            const year = reserveDate.getFullYear();
            const month = reserveDate.getMonth() + 1; 
            const day = reserveDate.getDate();
            
            return (
              <tr key={i} onClick={() => openModal(r)}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.title}</td>
                <td>{`${year}.${month}.${day}`}</td>
                <td>
                  {r.done === false ? "예약중" : 
                    (<div>
                      <p>상담완료</p> 
                      <button>리뷰작성</button>
                    </div>)
                  }
                </td>
              </tr>
            )
          }))
          }
        </tbody>
      </table>

      {selectedReservation && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{
            backgroundColor: "white"
          }}>
            <div>
              <input type='text' value={selectedReservation.name}></input>
            </div>
            <div>
              <input type='text' value={selectedReservation.content}></input>
            </div>
            <div>
              <textarea value={selectedReservation.content} cols="30" rows="10"></textarea>
            </div>
            <button onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}