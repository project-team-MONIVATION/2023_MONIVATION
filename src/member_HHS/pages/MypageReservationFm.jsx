import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db } from '../../database/firebase';
import { doc, getDoc, getDocs, updateDoc, where, query, collection } from 'firebase/firestore';

export default function MypageReservationFm() {
  const user = useSelector((state) => state.user.user);

  const [reserv, setReserv] = useState();
  const params = useParams();
  const [modalData, setModalData] = useState(null);

  useEffect(()=>{
    const getReserv = async() => {
      const docSnap = await getDoc( doc(db, "financial_managers", params.id) );
      setReserv({
        ...docSnap.data()
      })
    }
    getReserv();
  }, [])

  // 모달 창 열기
  const openModal = (r) => {
    setModalData(r);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setModalData(null);
  };

  const handleData = async () => {
    // Get the user UID
    const userUid = modalData.userUid;

    // Access the 'personal_users' collection and query for the user with the matching UID
    const q = query(collection(db, 'personal_users'), where('uid', '==', userUid));
    const querySnapshot = await getDocs(q);

    // Update the 'done' value in the reservation array for the matching user
    querySnapshot.forEach((doc) => {
      const userRef = doc.ref;
      const reservations = doc.data().reservation;

      const updatedReservations = reservations.map((r) => {
        if (r.fmUid === user.uid) {
          return { ...r, done: true };
        }
        return r;
      });
      console.log(updatedReservations)
      updateDoc(userRef, { reservation: updatedReservations });
    });

    // Close the modal after updating
    closeModal();
  }

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
              <td>접수된 예약이 없습니다</td>
              <td></td>
              <td></td>
            </tr>
          )
          : 
          (reserv.reservation.map((r, i)=> {
            const reserveDate = new Date(r.reservedate.toDate());

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

      {modalData && (
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
              <input type='text' value={modalData.name}></input>
            </div>
            <div>
              <input type='text' value={modalData.title}></input>
            </div>
            <div>
              <textarea value={modalData.content} cols="30" rows="10"></textarea>
            </div>
            <button onClick={closeModal}>닫기</button>
            <button onClick={handleData}>상담완료</button>
          </div>
        </div>
      )}
    </div>
  )
}