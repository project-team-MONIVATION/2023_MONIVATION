import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { collection, getDocs, query, where, } from 'firebase/firestore';
import { db } from '../../database/firebase'

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { CircularProgressbar  } from 'react-circular-progressbar';
import '../css/mypage.css'

import 'react-circular-progressbar/dist/styles.css';
import GorlProgressBar from './GorlProgressBar';


export default function GoalBoxComp() {
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.user);
    const [taList , setTaList] = useState([]);

    const settings = {
      dots: true,
      fade: true,
      infinite: true,
      speed: 1000,
      slidesToShow: 1,
      slidesToScroll: 1,
    };

    useEffect(() => {
      getTargetAmountData();
    }, [user]);

    // 불러오기
    const getTargetAmountData = async () => {
      try {
        const fmCollectionRef = collection(db, "money_target_amount");
        const fmQuery = query(fmCollectionRef, where('user', '==', user.uid));
        const fmQuerySnapshot = await getDocs(fmQuery);
        
        if (!user.uid) {
          navigate('/account/login');
        } else {
          let dataArray = [];
          fmQuerySnapshot.forEach((doc) => {
            dataArray.push({
              ...doc.data(),
              id: doc.id,
            });
          });  
          setTaList(dataArray);
        }
      } catch (error) {
        console.log("데이터를 불러오지 못했습니다.", error);
      }
    };

    const getDateDiffHDpercent = (d1, d2) => {
      const date1 = new Date(d1);
      const date2 = new Date(d2);
      
      const diffDate = date1.getTime() - date2.getTime();
      
      const result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일

      return result
    }

    // 오늘 날짜, 시작날짜 , 끝나는 날짜에 따른 진행률 계산
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
    

    const Dday = (d1, d2) => {
      const date1 = new Date(d1);
      const date2 = d2;
      
      const diffDate = date1.getTime() - date2.getTime();
      
      let reasult = "";
      if(diffDate < 0) {
        const diffDate = 0
        reasult = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
      } else {
        reasult = Math.abs(diffDate / (1000 * 60 * 60 * 24)).toFixed(0); // 밀리세컨 * 초 * 분 * 시 = 일
      }
      return reasult
    }

    const getProgressColor = () => {
          return '#e74c3c'; // 빨간색
    };

    return (
      <div id = 'goal-box'>
        <Slider {...settings}>
          {taList.map((tmp) => {
            const startDate = new Date(tmp.startday);
            const endDate = new Date(tmp.endday);
            const currentDate = new Date();

            const progress = Math.round(((currentDate - startDate) / (endDate - startDate)) * 100);
            const progressOffset = ((100 - progress) / 100) * (2 * Math.PI * 70); // 게이지의 반지름을 나타내는 값인 70을 조정

            return (
              <div>
                <div
                  style = {{
                    display: "flex",
                    width: "90%",
                    height: "200px",
                    margin: "auto",
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  {/* D-day 관련 텍스트 출력 */}
                  <div className = 'd-day-box'>
                    <h3>{tmp.title.length > 6 ? `${tmp.title.slice(0, 6)}...` : tmp.title}</h3>
                    <h3>D-{Dday(tmp.endday, new Date())}<span>까지</span></h3>
                    <h3>{tmp.amount}<span>&#8361;</span><p>모으면 돼요!</p> </h3>
                  </div>

                  {/* 원형 진행바 */}
                  <div style = {{width:"140px", height:"140px"}} className = 'circular-bar-box'>
                    <CircularProgressbar
                      counterClockwise
                      value = {progress}
                      text = {`${progress}%`}
                      styles = {{
                        path: {
                          stroke: getProgressColor(progress),
                          strokeDasharray: `${2 * Math.PI * 70}`, // 게이지의 반지름을 나타내는 값인 70을 조정
                          strokeDashoffset: progressOffset,
                          transformOrigin: "center center",
                          transition: "stroke-dashoffset 0.5s ease-in-out", // 애니메이션 효과를 위한 속성
                        },
                        trail: {
                          stroke: "#f2f2f2", // 게이지 뒷배경 색상
                        },
                        text: {
                          fill: "#333",
                          fontSize: "24px",
                          fontWeight: "bold",
                        },
                      }}
                    />
                  </div>
                </div>

                {/* 선형 진행바 */}
                <div className='bar-box'>
                  <GorlProgressBar
                    num = {getDateDiffNOWpercent(new Date(), tmp.startday, tmp.endday)}
                    maxNum = {getDateDiffHDpercent(tmp.endday, tmp.startday)}
                  />
                  <p>{tmp.endday}</p>
                </div>    
              </div>
            );
          })}
        </Slider>
      </div>
    )
}
