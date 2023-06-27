// 챌린지 상세보기 페이지
import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc, addDoc, collection, getDocs, query, deleteDoc, where, updateDoc } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import CommentComp from '../components/CommentComp'
import '../css/challengeview.css'

export default function DefaultChallengeView() {
    const user = useSelector((state)=>state.user.user);
    // 주소창의 params 값 가져온다.
    const params = useParams();
    // 화면에 출력하기 위한 state
    const [challengeBoard, setChallengeBoard] = useState();
    // 챌린지 문서 id
    const [challengeId, setChallengeId] = useState();

    const [isToggled, setIsToggled] = useState();
    // 완료된 챌린지 상태 반영 값 (완료 : true, 미완료 : false)
    const [done, setDone] = useState();

    const navigate = useNavigate();

    useEffect(()=>{
        getDefaultChallenge();
        getInvolve();
        updateDocFieldDone();
    }, [params.id])

    const getDefaultChallenge = async()=>{
        const docSnap = await getDoc(doc(db, "default_challenge", params.id));
        // 가져온 문서의 id값을 할당
        if (docSnap.exists()){
            setChallengeId(docSnap.id);
            setChallengeBoard({
            ...docSnap.data()
        });
        } else {
            console.log("문서가 존재하지 않습니다.");
        }
        
    }

    const getInvolve = async()=>{
        // 참여상태를 갱신과 동시에 버튼 상태를 변경하는 involve도 갱신
        const docSnap = await getDoc(doc(db, "default_challenge", params.id));
        if(docSnap.exists()){
            const challengeData = docSnap.id;
            console.log(challengeData);
            if(challengeData){
                const challengeId = challengeData;
                const q = query(collection(db, "my_challenge"), 
                where("challengeId", "==", challengeId), where("uid", "==", user.uid));
                getDocs(q)
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        console.log("아직 참여하지 않았습니다.");
                        // 애초에 involve는 필요가 없었다...
                        //setInvolve(true);
                        setIsToggled(true);
                    } else {
                        console.log("참여중입니다.");
                        //setInvolve(false);
                        setIsToggled(false);
                    }
                })
                .catch((error) => {
                    console.error('쿼리 실행 중 에러 발생:', error);
                });
            } else {
                console.log("challengeId 값이 유효하지 않습니다.");
                // 유효하지 않은 경우에 대한 처리  
            } 
        } else {
                console.log("문서가 존재하지 않습니다.");
                // 문서가 존재하지 않는 경우에 대한 처리
        }
    }

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
        } else if(challengeBoard.time == "one-minutes") {
        // 확인용
        time = "1분"
        futureDate.setMinutes(currentDate.getMinutes() + 1);
        }
        else {
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
            uid : user.uid,
            badge : challengeBoard.badge
        });
    
    };

    // 등록한 챌린지 취소 함수
    const cancleChallenge = async()=>{
        try{
            const q = query(collection(db, "my_challenge"), where("challengeId", "==", params.id), where("uid", "==", user.uid));
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
    const updateDocFieldDone = async()=>{
        // query를 변수명으로 쓰면안됨
        const q = query(collection(db, "my_challenge"), where("challengeId", "==", params.id), 
        where("uid", "==", user.uid));
        const querySnapshot = await getDocs(q);
        const now = new Date()
        querySnapshot.forEach((doc) => {
          const documentRef = doc.ref;
          const endDate = doc.data().endDate;
          const timeDifference = endDate.toDate() - now;
  
          if(timeDifference <= 0){
            setTimeout(()=>{
              updateDoc(documentRef, {done : true})
              .then(() => {
                console.log('완료된 챌린지입니다.');
                setDone(true);
                //console.log(done);
              })
              .catch((error) => {
                console.error('Error updating field:', error);
              });
            }, timeDifference);
          } else {
            console.log('지정된 시간이 아직 남았습니다.');
            setDone(false);
            //console.log(done);
          }
        });
      };

    // 이미지를 넣을 떼 height를 설정해주지 않으면 디폴트로 height : 0이 들어가있기 때문에
    // 설정해줘야한다!
    return (
        <div id='layout'>
            <h1>디폴트 챌린지 상세보기</h1>
            <div className='challenge-wrap'>
            {/** 업로드해서 넣은 이미지 url과 그냥 imgId만 넣은 파일을 구분해서 들고와야함 */}
            <img src={challengeBoard?.img && (challengeBoard.img.length < 10 ? require(`../img/${challengeBoard.img}`) : challengeBoard.img)}
                style={{width : "300px", height : "200px", borderRadius : "20px", display : 'inline-block', border : "solid black 1px"}}
            alt="" />
            <div className='challenge-info-wrap'>
                <p>챌린지명 : {challengeBoard && challengeBoard.name}</p>
                <p> 기간 : {time}</p>
                {/** challenge 데이터에 user.nickname도 넣을 예정 */}
                {/** 뱃지는 디폴트 챌린지만 할당 */}
                <p>등록자명 : {challengeBoard && challengeBoard.uid}</p>
            </div>
            <div className='badge-button-wrap'>
            <div style={{width : "100px", display : "inline-block", height : "100px",
            backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
            backgroundImage : `url(/img/${challengeBoard && challengeBoard.badge})`}}></div>
            <br />
            {
                user && user.uid ? <button onClick={handleToggled}
                disabled={done === true}
                >
                    {isToggled ? '참여하기' : '참여중'}
                </button> 
                : <button>로그인 해주세요</button>
            }
            {
                user && challengeBoard && challengeBoard.uid === user.uid ? 
                <button>챌린지 삭제</button> : null
            }
            </div>
            {
                user && challengeBoard && challengeBoard.uid === user.uid ? <button>챌린지 수정</button> : null
            }
            
        </div>
        <div className='content-comment-wrap'>
            <div style={{display : 'inline-block', backgroundColor : "gray", width : "500px", height : "500px"}}>
                <p>챌린지 상세 설명</p>
                <p>{challengeBoard && challengeBoard.content}</p>
            </div>
            <CommentComp />
        </div>
        </div>
    )
}
