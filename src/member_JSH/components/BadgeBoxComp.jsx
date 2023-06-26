import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc, addDoc, collection, getDocs, query, deleteDoc, where } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import CommentComp from '../components/CommentComp'
import { Link } from 'react-router-dom'

export default function BadgeBoxComp() {
  const user = useSelector((state)=>state.user.user);
  // 화면에 출력하기 위한 state
  const [challengeBoard, setChallengeBoard] = useState([]);
  useEffect(()=>{
    window.scrollTo({top: 0});
    // user_challenge 컬렉션의 값을 가져와서 사용
    const getChallenge = async()=>{
      if(user && user.uid){
      const q = query(collection(db, "my_challenge"));
      const querySnapshot = await getDocs(q);
      let dataArray = [];
      querySnapshot.forEach((doc)=>{
        let data = {
          id : doc.id,
          // 생성된 챌린지의 문서id를 mychallenge에서는 챌린지Id로 할당했음.
          challengeId : doc.data().challengeId,
          done : doc.data().done,
          endDate : doc.data().endDate.toDate(),
          startDate : doc.data().startDate.toDate(),
          period : doc.data().period,
          involve : doc.data().involve,
          challengeName : doc.data().challengeName,
          uid : doc.data().uid,
          badge : doc.data().badge
        }
        // 완료된 챌린지 필터링
        if(data.uid == user.uid && data.done == true) {
          dataArray.push(data);
        }
        console.log(doc.id, " => ", doc.data());
      });
      setChallengeBoard(dataArray);
    }
  };
    getChallenge();
  },[user])
  return (
    <div>
        <h2>내가 모은 뱃지</h2>
        <div>
          <ul>
            {challengeBoard.length > 0 &&
                    challengeBoard.map((board) => (
                      <div style={{width : "100px", display : "inline-block", height : "100px",
                      backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
                      backgroundImage : `url(/img/${board.badge ? board.badge : null})`}}></div>
              ))}
          </ul>
        </div>
    </div>
  )
}
