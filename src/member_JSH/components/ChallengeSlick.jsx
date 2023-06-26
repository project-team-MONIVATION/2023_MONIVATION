import React, {useState, useEffect} from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import Card from 'react-bootstrap/Card';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useParams } from 'react-router-dom'
import { db } from '../../database/firebase'
import { getDoc, doc, query, collection, getDocs } from 'firebase/firestore';

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

// 디폴트 챌린지 슬라이드
  
export default function ChallengeSlick() {
  const user = useSelector((state)=>state.user.user);
  const [challengeBoard, setChallengeBoard] = useState();
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows : true,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  }

  useEffect(()=>{
    getDefaultChallenge();
  },[user])

  // default_challenge 컬렉션의 값을 가져와서 사용
  const getDefaultChallenge = async()=>{
    const q = query(collection(db, "default_challenge"));
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
    <div>
    <h2>도전 챌린지</h2>
    <Slider {...settings}>
        {
              challengeBoard && challengeBoard.map((board)=>(
              <Link to={`/challenge/${board.id}/defaultview`} key={challengeBoard.id}>
                <Card
                  style={{
                    backgroundColor : "gray",
                    width : "80%",
                    height: "200px",
                    backgroundSize : "cover",
                    backgroundPosition : "center",
                    padding : "10px"
                  }}
                >
                  <Card.Body className="camp-slide-bar">
                    <Card.Text style={{marginBottom : "0"}}>{board.name}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
              ))
        }
      </Slider>
    </div>
  )
}
