import React, { useEffect, useState } from 'react'
import { db, auth } from '../../database/firebase'
import { useSelector } from 'react-redux'
import { collection, getDocs, query } from 'firebase/firestore'
import { Link } from 'react-router-dom';


import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProgressBar from '../../member_LJC/components/ProgressBar'

import ChallengeBox from '../styleComponent/Challenge/ChallengeBox';
import ChallengeList from '../styleComponent/Challenge/ChallengeList';
import EmptyColumn from '../styleComponent/Challenge/EmptyColumn';
import ChallengeAdd from '../styleComponent/Challenge/ChallengeAdd';

const settings = {
  dots: true,
  fade: true,
  infinite: true,
  speed: 1000,
  slidesToShow: 3,
  slidesToScroll: 1,
  rows: 1,
  slidesPerRow: 3,
};

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
        if(data.uid == user.uid && data.done == true  ) {
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






      
  return (
  <div>
    {activeChallenge.length > 0 ? (
      <Slider {...settings}>
        {activeChallenge.reduce((accumulator, item, index) => {
          if (index % 3 === 0) {
            accumulator.push(
              <div key={index}>
                <ChallengeList>
                  <li>
                    <img src="challengeImg" alt="challengeImg" />
                  </li>
                  <li># {item.challengeName}</li>
                  <li>
                    <ProgressBar
                      num={getDateDiffNOWpercent(new Date(), item.startDate, item.endDate)}
                      maxNum={getDateDiffHDpercent(item.endDate, item.startDate)}
                    />
                    {console.log(getDateDiffNOWpercent(new Date(), item.startDate, item.endDate))}
                  </li>
                </ChallengeList>
              </div>
            );
          } else {
            accumulator[accumulator.length - 1].props.children.push(
              <ChallengeList key={index}>
                <li>
                  <img src="challengeImg" alt="challengeImg" />
                </li>
                <li># {item.challengeName}</li>
                <li>
                  <ProgressBar
                    num={getDateDiffNOWpercent(new Date(), item.startDate, item.endDate)}
                    maxNum={getDateDiffHDpercent(item.endDate, item.startDate)}
                  />
                  {console.log(getDateDiffNOWpercent(new Date(), item.startDate, item.endDate))}
                </li>
              </ChallengeList>
            );
          }
          return accumulator;
        }, [])}
        {activeChallenge.length < 3 && (
          <div>
            {activeChallenge.length === 0 && (
              <ChallengeList>
                <ChallengeAdd>
                  <li>챌린지를 추가해보세요</li>
                </ChallengeAdd>
              </ChallengeList>
            )}
            {activeChallenge.length === 1 && <EmptyColumn />}
            <ChallengeList>
              <ChallengeAdd>
                <li>챌린지를 추가해보세요</li>
              </ChallengeAdd>
            </ChallengeList>
          </div>
        )}
      </Slider>
    ) : (
      <ChallengeBox>
        <ChallengeList>
          <ChallengeAdd>
            <li>챌린지를 추가해보세요</li>
          </ChallengeAdd>
        </ChallengeList>
        <EmptyColumn />
        <EmptyColumn />
      </ChallengeBox>
    )}
  </div>
);

}
