import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom'
import { db } from '../../database/firebase'
import { getDoc, doc, query, collection, getDocs, orderBy } from 'firebase/firestore';
import '../css/challengelist.css'
import {} from '@fortawesome/fontawesome-svg-core'
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SampleNextArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "transparent", height : "20px",
    width:"20px", zIndex:"9", left:"1px", alignItems : "center", cursor:"pointer"}}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faAngleRight} style={{color:"black"}}/>
    </div>
  );
}

function SamplePrevArrow(props) {
  const { className, style, onClick } = props;
  return (
    <div
      className={className}
      style={{ ...style, display: "block", background: "transparent", height : "20px",
    width:"20px", zIndex:"9", left:"1px", alignItems : "center", cursor:"pointer"}}
      onClick={onClick}
    >
      <FontAwesomeIcon icon={faAngleLeft} style={{color:"black"}}/>
    </div>
  );
}

// 디폴트 챌린지 슬라이드
  
export default function ChallengeSlick() {
  const user = useSelector((state)=>state.user.user);
  const [challengeBoard, setChallengeBoard] = useState();
  const settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows : false,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000
  }

  useEffect(()=>{
    getDefaultChallenge();
  },[user])

  // default_challenge 컬렉션의 값을 가져와서 사용
  const getDefaultChallenge = async()=>{
    const q = query(collection(db, "default_challenge"), orderBy("writetime", "desc"));
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
      console.log(doc.id, " => ", doc.data());
    });
    setChallengeBoard(dataArray)
  }
      
  return (
    <div className="default-challenge-list">
      <br />
    <Slider {...settings}>
        {
              challengeBoard && challengeBoard.map((board)=>(
              <Link to={`/challenge/${board.id}/defaultview`} key={challengeBoard.id}>
                <Card
                  style={{
                    border : "solid 1px black",
                    width : "70%",
                    height: "200px",
                    backgroundSize : "cover",
                    padding : "20px",
                    margin : "auto",
                    backgroundImage : board.img && `url(${require(`../../assets/img/${board.img}`)})`,
                    
                  }}
                >
                  <Card.Body className="camp-slide-bar">
                    
                  </Card.Body>
                </Card>
                <br />
                <Card.Text style={{marginBottom : "0"}}>{board.name}</Card.Text>
              </Link>
              ))
        }
      </Slider>
    </div>
  )
}
