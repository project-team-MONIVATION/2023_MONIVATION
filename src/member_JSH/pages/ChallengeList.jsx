// 챌린지 목록 페이지

import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ChallengeSlick from '../components/ChallengeSlick'
import { useParams } from 'react-router-dom'
import { db } from '../../database/firebase'
import { getDoc, doc, query, collection, getDocs } from 'firebase/firestore';
import { useSelector } from 'react-redux'
import ActiveChallengeComp from '../components/ActiveChallengeComp'
//import MyChallengeSlideComp from '../components/MyChallengeSlideComp'

import '../css/challengelist.css';
import BadgeBoxComp from '../components/BadgeBoxComp'


export default function ChallengeList() {
  const user = useSelector((state)=>state.user.user);
  const [challengeBoard, setChallengeBoard] = useState();

  useEffect(()=>{
    window.scrollTo({top: 0});
    // user_challenge 컬렉션의 값을 가져와서 사용
    const getChallenge = async()=>{
      const q = query(collection(db, "user_challenge"));
      const querySnapshot = await getDocs(q);
      let dataArray = [];
      querySnapshot.forEach((doc)=>{
        let data = {
          id : doc.id,
          uid : doc.data().uid,
          name : doc.data().name,
          time : doc.data().time,
          content : doc.data().content,
          img : doc.data().img,
          writeTime : doc.data().writeTime,
        }
        dataArray.push(data)
        //console.log(doc.id, " => ", doc.data());
      });
      setChallengeBoard(dataArray)
    }
    getChallenge();
  },[])

  return (
    <div id='layout' style={{position: "relative"}}>
      <div id='layout-in'>
        <div id='challenge-list'>
        <h1 style={{width : "90%", margin : "auto", padding : "10px"}}>챌린지</h1>
        <ChallengeSlick />
        <br />
        <br />
        <h1 style={{width : "90%", margin : "auto", padding : "10px"}}>유저 챌린지</h1>
        <br />
        
        <ul style={{listStyle : 'none'}}
          className="card-grid"
        >
          {
            challengeBoard && challengeBoard.map((board)=>(
              <Link to={`/challenge/${board.id}/view`} key={challengeBoard.id}>
                <li>
                  <img style={{display : "inline-block", 
                  backgroundImage :`url(/img/${board.img})`,
                  backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}
                    className="challengeboard-card"
                    src={board?.img && (board.img.length < 10 ? require(`../../assets/img/${board.img}`): board.img)}
                  >
                  </img>
                  <br></br>
                  <p style={{display:'inline-block'}}>{board.name}</p>
                </li>
              </Link>
            ))
          }
        </ul>
        </div>
        <div id='challenge-create-btn'>
            <Link to='/challenge/create' style={{textDecoration : "none", fontSize : '4rem', color:"white"}}>
              <button />
            </Link>
        </div>
      </div>
    </div>
  )
}
