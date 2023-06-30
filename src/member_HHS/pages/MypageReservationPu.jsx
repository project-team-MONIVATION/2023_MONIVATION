import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db } from '../../database/firebase';
import { doc, getDoc, addDoc, collection } from 'firebase/firestore';
import "../../member_PC/pages/css/mypageRes.css"

export default function MypageReservationPu() {
  const user = useSelector((state) => state.user.user);
  const params = useParams();
  const [text, setText] = useState();
  const [fm, setFm] = useState();

  const [reserv, setReserv] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);

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
  const openModal = (r) => {
    setModalData(r);
  };

  // 모달 창 닫기
  const closeModal = () => {
    setModalData(null);
  };

  const openModalReview = (e, id) => {
    e.stopPropagation();
    setFm(id);
    setReviewModal(true);
  }
  const closeModalReview = () => {
    setReviewModal(false);
  }

  const writeReview = () => {
    addDoc(collection(db, "financial_review"), {
      uid : user.uid,
      fmDocid : fm,
      nickname : user.nickname,
      photo : user.photo,
      text : text,
      date : new Date(),
    });
    setReviewModal(false);
    alert('리뷰작성이 완료되었습니다!')
  }

  return (
    <div id='layout'>
      <h1 style={{fontSize: "1.8rem", margin: "20px"}}>나의 예약 내역</h1>
      <table className='mypage-table'>
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
          {!reserv || !reserv.reservation ? 
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
          (
            reserv.reservation.map((r, i)=> {
            const reserveDate = new Date(r.reservedate.toDate());

            // 원하는 형식으로 날짜를 출력
            const year = reserveDate.getFullYear();
            const month = reserveDate.getMonth() + 1; 
            const day = reserveDate.getDate();
            
            return (
              <tr key={i} onClick={() => {openModal(r);}}>
                <td>{r.name}</td>
                <td>{r.phone}</td>
                <td>{r.title}</td>
                <td>{`${year}.${month}.${day}`}</td>
                <td>
                  {r.done === false ? <span style={{color: "red"}}>예약중</span> : 
                    (<div>
                      <p style={{color: "green"}}>상담완료</p> 
                      <button onClick={(e)=>{openModalReview(e, r.fmUid)}}>리뷰작성</button>
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
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div style={{backgroundColor: "white", padding: "30px", borderRadius: "20px"}}>
            <h1 style={{fontSize: "1.5rem", marginBottom: "30px"}}>예약내역</h1>
            <div style={{textAlign: "left", margin: "10px"}}>
              <label style={{display: "inline-block", textAlign: "left", width: "80px", fontWeight: "bold"}}>이름</label>
              <input type='text' defaultValue={modalData.name} disabled/>
            </div>
            <div style={{textAlign: "left", margin: "10px"}}>
              <label style={{display: "inline-block", textAlign: "left", width: "80px", fontWeight: "bold"}}>이메일</label>
              <input type="email" defaultValue={modalData.email} disabled/>
            </div>
            <div style={{textAlign: "left", margin: "10px"}}>
              <label style={{display: "inline-block", textAlign: "left", width: "80px", fontWeight: "bold"}}>상담제목</label>
              <input type='text' defaultValue={modalData.title} disabled/>
            </div>
            <div style={{textAlign: "left", margin: "10px"}}>
              <label style={{display: "inline-block", textAlign: "left", width: "80px", verticalAlign: "top", fontWeight: "bold"}}>상담내용</label>
              <textarea defaultValue={modalData.content} cols="30" rows="10" disabled></textarea>
            </div>
            <button style={{backgroundColor: "#735BF3", color: "white", borderRadius: "10px", border: "none", padding: "5px 40px", fontSize: "1.2rem"}} onClick={closeModal}>닫기</button>
          </div>
        </div>
      )}
      { reviewModal && 
        (
          <div 
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(0, 0, 0, 0.6)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{backgroundColor: "white", padding: "30px", borderRadius: "20px"}}>
              <h1 style={{fontSize: "1.5rem", marginBottom: "30px"}}>리뷰 작성</h1>

              <textarea cols="50" rows="13" placeholder='리뷰를 남겨주세요' onChange={(e)=>{setText(e.target.value)}}></textarea>
              <br />
              <div style={{display: "flex", alignItems: "center", justifyContent: "center", marginTop: "20px"}}>
                <button style={{backgroundColor: "#735BF3", color: "white", margin: "0 10px", borderRadius: "10px", border: "none", padding: "5px 40px", fontSize: "1.2rem"}} onClick={writeReview}>작성완료</button>
                <button style={{backgroundColor: "#735BF3", color: "white", margin: "0 10px", borderRadius: "10px", border: "none", padding: "5px 40px", fontSize: "1.2rem"}} onClick={closeModalReview}>닫기</button>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}