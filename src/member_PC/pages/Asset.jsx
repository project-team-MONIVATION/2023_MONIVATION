// 자산관리(메인) 페이지
import { db } from '../../database/firebase';
import React, {useCallback, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { doc, updateDoc, query, getDoc, getDocs, collection, orderBy, where, limit } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './css/asset.css'

// 화살표 컴퍼넌트
const NextArrow = ({ onClick, style }) => { 
  return (
    <FontAwesomeIcon
      icon={faChevronRight}
      onClick={onClick}
      type='button'
      style={{ ...style, position: "absolute", display: "inline-block", color: "darkgray", zIndex: "10", cursor: "pointer", width:"40px", height:"40px", top: "180", right:"0%"}}
    />
  );
};

const PrevArrow = ({ onClick, style }) => {
  return (
    <FontAwesomeIcon
      icon={faChevronLeft}
      onClick={onClick}
      type='button'
      style={{ ...style, position: "absolute", display: "inline-block", color: "darkgray", zIndex: "10", cursor: "pointer", width:"40px", height:"40px", top: "180", left:"0%"}}
    />
  );
};

export default function Asset() {
  const user = useSelector((state) => state.user.user);

  const [bestFmList, setBestFmList] = useState([]);

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  useEffect(()=>{
    const getList = async () => {
        const q = query(collection(db, "financial_managers"), orderBy("likeNum", "desc"), limit(8));
        const querySnapshot = await getDocs(q);

        let dataArray = [];
        querySnapshot.forEach((doc) => {
            let data = {
                id : doc.id,
                name : doc.data().name,
                likeNum : doc.data().likeNum,
                field : doc.data().field,
                photo : doc.data().photo,
            }
            dataArray.push(data)
        });
        setBestFmList(dataArray);
    }
    getList();
  },[])
  
  return (
    <div>
      {/* 탭 바 */}
      <div style={{display: "flex", justifyContent: "space-between", width: "1500px", margin: "auto", alignItems: "center"}}>
        <h1 style={{fontSize: "1.8rem"}}>Best 자산관리사</h1>
        <Link to='/asset/managerlist'>더보기</Link>
      </div>

      {/* 탑 자문사 리스트 */}
      <Slider {...settings}>
      {
        bestFmList && bestFmList.map((fm)=>(
          <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
            <div style={{backgroundColor: "#735BF3", width: "250px", height: "300px", margin: "50px", display: "inline-block", borderRadius: "20px"}}>
              <div style={{backgroundColor: "white", width: "200px", height: "200px", margin: "auto", marginTop: "20px", borderRadius: "40px", backgroundImage: `url(${fm.photo})`, backgroundSize: "cover" }}></div>
              <h1 style={{margin: "10px 0"}}>{fm.name}</h1>
              <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}> 
                <div>
                  <span style={{padding: "0 5px"}}>{fm.field && fm.field[0]}</span>
                  <span style={{padding: "0 5px"}}>{fm.field && fm.field[1]}</span>
                  <span style={{padding: "0 5px"}}>{fm.field && fm.field[2]}</span>
                </div>
              </div>
              <div>
                <FontAwesomeIcon 
                  icon={faHeart}
                  fontSize={20}
                  style={{ color: "red" }}
                />:{fm.likeNum}
              </div>
            </div>
          </Link>
        ))
      }
      </Slider>
      
      {/* 관련 정보 */}
      <div className='asset'>
      <h1 style={{textAlign: "left", margin: "30px 0 20px 30px", fontSize: "1.8rem"}}>관련정보</h1>
        <table>
          <tbody>
          <tr>
            <td style={{verticalAlign: "top"}}>
              <h1>관련서적</h1>
            </td>
            <td><img src="/img/coin.jpg" alt="사진" /></td>
            <td><img src="/img/chart.jpg" alt="사진" /></td>
            <td><img src="/img/money.jpg" alt="사진" /></td>
            <td><img src="/img/man.jpg" alt="사진" /></td>
          </tr>
          <tr className='btm'>
            <td></td>
            <td>
              <p>부자되고싶나</p>
            </td>
            <td>
              <p>차트의 왕이 되고싶나</p>
            </td>
            <td>
              <p>돈 많이 벌고싶나</p>
            </td>
            <td>
              <p>천리안을 갖고싶나</p>
            </td>
          </tr>
          <tr>
              <td style={{verticalAlign: "top"}}>
                <h1>꿀팁영상</h1>
              </td>
              <td>
                <iframe src="https://www.youtube.com/embed/hikmv2mSVxo" title="3분30초만에 알아보는 자산관리방법 PICK 6" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe src="https://www.youtube.com/embed/EnZpz8SgM4U" title="평범한 직장인으로 20억 자산까지 딱 10년!!! 누구의 도움없이도 가능한 돈에 대한 예의를 갖추자! (자산관리 1편)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe src="https://www.youtube.com/embed/kQZSeJXq7lE" title="월급의 몇%를 저축하고 있나요? 사회 초년생 월급관리 10분 정리!" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe src="https://www.youtube.com/embed/GJorguPKRTk" title="삼성전자 말고 &#39;이 주식&#39;을 사모으세요. 정말 유일합니다 (이종우)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
          </tr>
          <tr className='btm'>
              <td></td>
              <td>"3분30초만에 알아보는 자산관리방법 PICK 6"</td>
              <td>"평범한 직장인으로 20억 자산까지 딱 10년!!!"</td>
              <td>"월급의 몇%를 저축하고 있나요? 사회 초년생 월급관리 10분 정리!"</td>
              <td>"삼성전자 말고 '이 주식'을 사모으세요."</td>
          </tr>
          </tbody>
        </table>
        </div>
    </div>
  )
}
