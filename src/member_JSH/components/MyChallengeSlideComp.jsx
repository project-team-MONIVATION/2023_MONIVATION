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
import ProgressBar from 'react-progressbar';
import styled from 'styled-components'



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
            uid : doc.data().uid
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
      <div>
        <h2>챌린지</h2>
        <div style={{width : "300px", height : "100px"}}>
            <Slider {...settings}>
                {challengeBoard.length > 0 && !challengeBoard.done &&
                    challengeBoard.map((board) => (
                    <Link to={`/challenge/${board.challengeId}/view`} key={board.id}
                        style={{textDecoration : "none"}}
                    >
                        <div>
                            <p>{board.challengeName}</p>
                            <p>{board.period}</p>
                        </div>
                    </Link>
                ))}
            </Slider>
        </div>
      </div>
    )
  }


