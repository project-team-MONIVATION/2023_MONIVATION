import React, { useEffect, useState } from 'react'
import { db,auth } from '../../database/firebase'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc, addDoc, collection, getDocs, query, deleteDoc, where } from 'firebase/firestore'
import { useNavigate, useParams } from 'react-router'
import CommentComp from '../components/CommentComp'
import { Link } from 'react-router-dom'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ProgressBar from '../../member_LJC/components/ProgressBar';
import styled from 'styled-components'
import '../css/challengeslide.css';


function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black", height : "20px",
      width : "20px", right:"10px"}}
        onClick={onClick}
      />
    );
  }
  
  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", background: "black", height : "20px",
      width:"20px", zIndex:"9", left:"10px" }}
        onClick={onClick}
      />
    );
  }


export default function MyChallengeSlideComp() {
    const user = useSelector((state)=>state.user.user);
    // 화면에 출력하기 위한 state
    const [challengeBoard, setChallengeBoard] = useState([]);
    const [taList , setTaList] = useState([]);
    
    const getDateDiffHDpercent = (d1, d2) => {
      const date1 = d1;
      const date2 = d2;
      
      const diffDate = date1.getTime() - date2.getTime();
      
      const result = Math.abs(diffDate / (1000 * 60 * 60 * 24)); // 밀리세컨 * 초 * 분 * 시 = 일
      console.log("백퍼샌트값",result)
      return result
    }

    // 오늘 날짜, 시작날짜 , 끝나는 날짜
    const getDateDiffNOWpercent = (d1, d2, d3) => {
      const date1 = d1;
      const date2 = d2;
      const date3 = d3;
      console.log("무슨형식", date1,date2,date3)
      
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
            badge : doc.data().badge ? doc.data().badge : false
          }
          if(data.uid == user.uid) {
            dataArray.push(data);
          }
          console.log(doc.id, " => ", doc.data());
        });
        setChallengeBoard(dataArray);
      }
    };
      getChallenge();
    },[user])

    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows : false,
        autoplay: true,
        speed: 2000,
        autoplaySpeed: 5000,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
      };
    return (
      <div id='my-ch-slide'>
        <div className='my-ch-slide-wrap'>
            <Slider {...settings}>
                {challengeBoard.length > 0 && !challengeBoard.done &&
                    challengeBoard.map((board) => (
                    <Link to={board.badge ? `/challenge/${board.challengeId}/defaultview`:`/challenge/${board.challengeId}/view`} key={board.id}
                    >
                        <div>
                          <div className='my-ch-slide-content'
                            style={{backgroundImage : board?.img && (board.img.length < 20 ? require(`../../assets/img/${board.img}`) : board.img),
                          backgroundPosition:"center"}}
                          >
                            <br />
                            <ul>
                              <li>챌린지 : {board.challengeName}</li>
                              <li>기간 : {board.period}</li>
                            </ul>
                          </div>
                            <div style={{width:"20px", height:"15px", backgroundColor:"transparent", margin : "5px"}}>
                            </div>
                            <ProgressBar num={getDateDiffNOWpercent(new Date(), board.startDate, board.endDate)} 
                            maxNum={getDateDiffHDpercent(board.endDate, board.startDate)}/>
                            {console.log("왜안나옴",board.startDate, board.endDate)}
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>
      </div>
    )
  }


