import React, { useEffect, useState } from 'react'
import { db, auth } from '../../database/firebase'
import { useSelector } from 'react-redux'
import { collection, getDocs, query } from 'firebase/firestore'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProgressBar from '../../member_LJC/components/ProgressBar'

import ChallengeBox from '../styleComponent/Challenge/ChallengeBox'
import ChallengeList from '../styleComponent/Challenge/ChallengeList'



export default function ActiveChallengeComp() {
  const user = useSelector((state) => state.user.user);

  const [ activeChallenge, setActiveChallenge ] = useState([]);

  useEffect(()=>{
    // window.scrollTo({top: 0});
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
        if(data.uid == user.uid && data.done == false) {
          dataArray.push(data);
        }
        console.log(doc.id, " => ", doc.data());
      });
      setActiveChallenge(dataArray);
    }
  };
    getChallenge();
  },[user])

      // 화면에 출력하기 위한 state
      const [challengeBoard, setChallengeBoard] = useState([]);
      const [taList , setTaList] = useState([]);
      
      const getDateDiffHDpercent = (d1, d2) => {
        const date1 = new Date(d1);
        const date2 = new Date(d2);
        
        const diffDate = date1.getTime() - date2.getTime();
        
        const result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        console.log("백퍼샌트값",result)
        return result
      }
  
      // 오늘 날짜, 시작날짜 , 끝나는 날짜
      const getDateDiffNOWpercent = (d1, d2, d3) => {
        const date1 = d1
        const date2 = new Date(d2);
        const date3 = new Date(d3);
        
        const diffDate = date1.getTime() - date2.getTime();
        const hdpercent = date3.getTime() - date2.getTime();
  
        let result = "";
  
        if(diffDate < 0){
            const diffDate = 0
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
            
        } else if (hdpercent < diffDate){
            const diffDate = hdpercent
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
  
        } else {
            result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
        }
        
        return result
      }

      const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows : false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
      };

  return (
    <div>
      {
        activeChallenge.length > 0 &&
        <ChallengeBox>
          {  
          activeChallenge.map((item) => (
            <ChallengeList key = {item.id}>
              <li></li>
              <li>{item.challengeName}</li>
              <li>
                <ProgressBar num={getDateDiffNOWpercent(new Date(), item.startDate, item.endDate)} 
                              maxNum={getDateDiffHDpercent(item.endDate, item.startDate)}/>
                              {console.log(getDateDiffNOWpercent(new Date(), item.startDate, item.endDate))}
              </li>
            </ChallengeList>
          ))
          }
        </ChallengeBox>
      }
    </div>
  )
}
