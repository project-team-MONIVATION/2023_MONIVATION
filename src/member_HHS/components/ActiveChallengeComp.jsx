import React, { useEffect, useState } from 'react';
import { db, auth } from '../../database/firebase';
import { useSelector } from 'react-redux';
import { collection, getDocs, query } from 'firebase/firestore';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProgressBar from '../../member_LJC/components/ProgressBar';

import ChallengeBox from '../styleComponent/Challenge/ChallengeBox';
import ChallengeList from '../styleComponent/Challenge/ChallengeList';

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
            badge: doc.data().badge
          }
          if (data.uid === user.uid && data.done === false) {
            dataArray.push(data);
          }
          console.log(doc.id, " => ", doc.data());
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
    console.log("백퍼샌트값", result);
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
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 500,
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridGap: "16px" }}>
      {
        Array.from({ length: 3 }).map((_, index) => {
          const item = activeChallenge[index];

          return (
            <div key={index} style={{ marginTop: "100px", border: "1px solid black", padding: "16px" }}>
              {item ? (
                <>
                  <li>{item.challengeName}</li>
                  <li>
                    <ProgressBar
                      num={getDateDiffNOWpercent(new Date(), item.startDate, item.endDate)}
                      maxNum={getDateDiffHDpercent(item.endDate, item.startDate)}
                    />
                    {console.log(getDateDiffNOWpercent(new Date(), item.startDate, item.endDate))}
                  </li>
                </>
              ) : (
                <a href="http://localhost:3000/2023_MONIVATION/challenge">이동</a>
              )}
            </div>
          );
        })
      }
    </div>
  )
}
