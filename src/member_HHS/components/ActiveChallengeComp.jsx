import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { db, auth } from '../../database/firebase';
import { collection, getDocs, query } from 'firebase/firestore';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import ChallengeList from '../styleComponent/Challenge/ChallengeList';
import ChallengeAdd from '../styleComponent/Challenge/ChallengeAdd';
import ChallengeProgressBar from './ChallengeProgressBar';

export default function ActiveChallengeComp() {
  const user = useSelector((state) => state.user.user);

  const [activeChallenge, setActiveChallenge] = useState([]);

  useEffect(() => {
    const getChallenge = async () => {
      if (user && user.uid) {
        const q = query(collection(db, "my_challenge"));
        const querySnapshot = await getDocs(q);
        let dataArray = [];
        querySnapshot.forEach((doc) => {
          let data = {
            id: doc.id,
            challengeId: doc.data().challengeId,
            done: doc.data().done,
            endDate: doc.data().endDate.toDate(),
            startDate: doc.data().startDate.toDate(),
            period: doc.data().period,
            involve: doc.data().involve,
            challengeName: doc.data().challengeName,
            uid: doc.data().uid,
            badge: doc.data().badge,
            img: doc.data().img
          }
          if (data.uid === user.uid && data.done === false) {
            dataArray.push(data);
          }
        });
        setActiveChallenge(dataArray);
      }
    };
    getChallenge();
  }, [user]);

  const getDateDiffHDpercent = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);

    const diffDate = date1.getTime() - date2.getTime();

    const result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    return result;
  }

  const getDateDiffNOWpercent = (d1, d2, d3) => {
    const date1 = d1;
    const date2 = new Date(d2);
    const date3 = new Date(d3);

    const diffDate = date1.getTime() - date2.getTime();
    const hdpercent = date3.getTime() - date2.getTime();

    let result = "";

    if (diffDate < 0) {
      const diffDate = 0;
      result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    } else if (hdpercent < diffDate) {
      const diffDate = hdpercent;
      result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    } else {
      result = Math.abs(diffDate / (1000 * 60 * 60 * 24));
    }

    return result;
  }

  const settings = {
    dots: true,
    infinite: false,
    slidesToShow: 3,
    slidesToScroll: 3,
    speed: 1000,
  };
  
  return (

    <Slider {...settings}>

    { activeChallenge.map((item, index) => (
      <div key = { index } style = {{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: "16px" }}>
        <ChallengeList>
          { item.img.startsWith("http") ? ( // 이미지 URL인 경우
            <img src = { item.img } alt = { item.challengeName } />
            ) : ( // 파일 경로/이름인 경우
            <img src = { require(`../../assets/img/${item.img}`)} alt = { item.challengeName } />
          )}
          <p># { item.challengeName }</p>
          <div>
            <ChallengeProgressBar
              num = { getDateDiffNOWpercent(new Date(), item.startDate, item.endDate) }
              maxNum = { getDateDiffHDpercent(item.endDate, item.startDate) }
            />
          </div>
        </ChallengeList>
      </div>
    ))}
    <div>
      <ChallengeAdd>
        <Link to = { "/challenge" }>
          <p>+</p>
          <p><span>챌린지</span>를<br />추가해보세요!</p>
        </Link>         
      </ChallengeAdd>
    </div>
        
    </Slider>
  )
}
