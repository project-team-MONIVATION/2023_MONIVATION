// 챌린지 상세보기 페이지
import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc, addDoc, collection, getDocs, query, deleteDoc, where } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import CommentComp from '../components/CommentComp'

export default function ChallengeView() {
  const user = useSelector((state)=>state.user.user);
  //const user = useSelector((state)=>state.user);
  //const [challenge, setChallenge] = useState();
  // 주소창의 params 값 가져온다.
  const params = useParams();
  // 화면에 출력하기 위한 state
  const [challengeBoard, setChallengeBoard] = useState();
  // 챌린지 문서 id
  const [challengeId, setChallengeId] = useState();
  // 토글 버튼 boolean값
  const [isToggled, setIsToggled] = useState(false);

  const navigate = useNavigate();
  // params.id가 바뀔때마다(챌린지 뷰 페이지 종류에 따라) 실행
  // 해당 챌린지를 challengeBoard에 push
  useEffect (()=>{
    const getChallenge = async()=> {
      const docSnap = await getDoc(doc(db, "user_challenge", params.id));
      // 가져온 문서의 id값을 할당
      setChallengeId(docSnap.id);
      setChallengeBoard({
        ...docSnap.data()
      });
    }
    getChallenge();
  },[params.id]);


  // 현재 날짜 생성. 이 변수는 addChallenge에만 쓰여야한다! 반드시!
  const currentDate = new Date();
  // 특정 기간(일)을 더할 날짜 생성
  const futureDate = new Date();
  let time="";

  if (challengeBoard) {
    if(challengeBoard.time == "week"){
      time = "1주"
      // 7일 후의 날짜
      futureDate.setDate(currentDate.getDate() + 7);
    } else if(challengeBoard.time == "one-month"){
      time = "1개월"
      // 1개월 후의 날짜
      futureDate.setMonth(currentDate.getMonth() + 1);
    } else if(challengeBoard.time == "three-month"){
      time = "3개월"
      futureDate.setMonth(currentDate.getMonth() + 3);
    } else if (challengeBoard.time == "six-month"){
      time = "6개월"
      futureDate.setMonth(currentDate.getMonth() + 6);
    } else {
      time = "미정"
    }
  }

  // 참여하기 활성화 함수
  // 해당 챌린지의 정보를 my_challenge에 업로드한다.
  const addChallenge = async() =>{
    
    await addDoc(collection(db, "my_challenge"), {
      challengeId : challengeId,
      startDate : currentDate,
      period : challengeBoard.time,
      done : false,
      endDate : futureDate,
      challengeName : challengeBoard.name,
      involve : true
    })
  }

  // 만든 챌린지 삭제 함수
  const deleteChallege = async(e)=>{
    e.preventDefault();
    const docRef = doc(db, "user_challenge", params.id);
    await deleteDoc(docRef);
    navigate('/challenge');
  }

  // 등록한 챌린지 취소 함수
  const cancleChallenge = async()=>{
    try{
      const q = query(collection(db, "my_challenge"), where("challengeId", "==", params.id));

      // 쿼리 실행하여 문서 가져오기
      const querySnapshot = await getDocs(q);

      // 문서를 순회하며 삭제
      querySnapshot.forEach(async(doc)=>{
        // doc.id를 써서 계속 오류가 나고 리스트에서 데이터삭제가
        // 되지않았음.
        const documentRef = doc.ref;
        await deleteDoc(documentRef);
      });

      console.log('챌린지가 성공적으로 취소되었습니다.');
    } catch(error){
      console.error('취소 중 오류가 발생', error);
    }
  };

  // 토글 버튼에 따라 기능 변경
  // e.preventDefault();쓸 경우 event(e)는 hadleToggled에만 작성.
  // 만약 addChallenge, cancleChallenge에도 e.preventDefault();를 쓰고싶다면
  // 두개의 메소드에도 e를 전달해주어야한다.(번거로움)
  // : 그냥 handleToggled에만 e를 작성하고 e.preventDefault();쓰는게 편하다~
  const handleToggled = (e) =>{
    e.preventDefault();
    setIsToggled(!isToggled);
    if(isToggled){
      //On상태(참여하기 버튼 상태)에서 클릭한 경우
      console.log("챌린지에 참여했습니다.");
      addChallenge();
    } else {
      //off상태(참여취소하기 버튼 상태)에서 클릭한 경우
      console.log("챌린지를 취소하였습니다.");
      cancleChallenge();
    }
  }
  
  return (
    <div>
      <h1>챌린지 상세보기</h1>
      <div>
        <img src="" alt="" />
        <p>챌린지명 : {challengeBoard && challengeBoard.name}</p>
        <p>기간 : {time}</p>
        {/** challenge 데이터에 user.nickname도 넣을 예정 */}
        {/** 뱃지는 디폴트 챌린지만 할당 */}
        <p>등록자명 : {challengeBoard && challengeBoard.uid}</p>
        {
          user && user.uid ? <button onClick={handleToggled}>{isToggled ? '참여하기' : '참여취소'}</button> : <button>로그인 해주세요</button>
        }
        {
          user && challengeBoard && challengeBoard.uid === user.uid ? <button onClick={deleteChallege}>챌린지 삭제</button> : null
        }
        {
          user && challengeBoard && challengeBoard.uid === user.uid ? <button>챌린지 수정</button> : null
        }
      </div>
      <div>
        <div style={{display : 'inline-block', backgroundColor : "gray", width : "300px", height : "500px"}}>
          <p>챌린지 상세 설명</p>
          <p>{challengeBoard && challengeBoard.content}</p>
        </div>
        <CommentComp />
      </div>
    </div>
  )
}
