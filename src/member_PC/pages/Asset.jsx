// 자산관리(메인) 페이지
import { db } from '../../database/firebase';
import React, {useCallback, useEffect, useState} from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'
import { doc, updateDoc, query, getDoc, getDocs, collection, orderBy, where, limit } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import AssetBox from './styledComponent/AssetBox';
import AssetImage from './styledComponent/AssetImage';
import AssetField from './styledComponent/AssetField';
import FieldSpan from './styledComponent/FieldSpan';
import HeaderBox from './styledComponent/HeaderBox';

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import './css/asset.css'

export default function Asset() {
  const user = useSelector((state) => state.user.user);

  const [bestFmList, setBestFmList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const settings = {
    autoplay: true,
    autoplaySpeed: 5000,
    dots: true,
    infinite: true,
    speed: 1000,
    slidesToShow: 4,
    slidesToScroll: 4,
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
        setIsLoaded(true);
    }
    getList();
  },[])
  
  return (
    <div id='layout' style={{overflowY: 'hidden'}}>
      {isLoaded &&
      <div id='asset'>
        {/* 탭 바 */}
        <HeaderBox>
          <h1 className='asset-header animated'>Best 자산관리사</h1>
          <Link to='/asset/managerlist'><p style={{backgroundColor: "#D9D9D9", padding: "5px 10px", borderRadius: "20px"}}>전체보기</p></Link>
        </HeaderBox>

        {/* 탑 자문사 리스트 */}
        <Slider {...settings}>
          {
            bestFmList && bestFmList.map((fm)=>(
              <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
                <AssetBox>
                  <AssetImage style={{backgroundImage: `url(${fm.photo})`}}></AssetImage>
                  <p style={{margin: "10px 0", fontWeight: "bold"}}>{fm.name}</p>
                  <AssetField> 
                    <div>
                      <FieldSpan>{fm.field && fm.field[0]}</FieldSpan>
                      <FieldSpan>{fm.field && fm.field[1]}</FieldSpan>
                      <FieldSpan>{fm.field && fm.field[2]}</FieldSpan>
                    </div>
                  </AssetField>
                  <FontAwesomeIcon 
                    icon={faHeart}
                    fontSize={15}
                    style={{ color: "red" }}
                  />
                  <FieldSpan>:{fm.likeNum}</FieldSpan>
                </AssetBox>
              </Link>
            ))
          }
        </Slider>
      
        {/* 관련 정보 */}
        <div className='asset'>
          <h1 className='animated' style={{textAlign: "left", margin: "60px 0 30px 80px", fontSize: "1.8rem"}}>관련정보</h1>
          <table>
            <tbody>
              <tr>
                <td>
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
                  <p>코인시장에서 하면 안될 3가지 행동</p>
                </td>
                <td>
                  <p>주식에서 중요한 10가지 법칙</p>
                </td>
                <td>
                  <p>돈의 흐름</p>
                </td>
                <td>
                  <p>멀리 내다보는 시야를 가지는게 중요한 이유</p>
                </td>
              </tr>
              <tr>
                  <td>
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
                  <td>3분30초만에 알아보는 자산관리방법 PICK 6</td>
                  <td>평범한 직장인으로 20억 자산까지 딱 10년!!!</td>
                  <td>월급의 몇%를 저축하고 있나요? 사회 초년생 월급관리 10분 정리!</td>
                  <td>삼성전자 말고 '이 주식'을 사모으세요</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    }
    </div>
  )
}
