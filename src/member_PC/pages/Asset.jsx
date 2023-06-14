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
  const [liked, setLiked] = useState(false);
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

  const handleLike = async (fmId) => {
    // 클릭 상태 변경
    setLiked(!liked);
  
    // Firestore에서 해당 문서의 likeNum 업데이트
    const fmDocRef = doc(db, "financial_managers", fmId);
    const fmDocSnap = await getDoc(fmDocRef);
    
    if (fmDocSnap.exists()) {
      const currentLikeNum = fmDocSnap.data().likeNum || 0;
      const newLikeNum = liked ? currentLikeNum - 1 : currentLikeNum + 1;
      await updateDoc(fmDocRef, { likeNum: newLikeNum });
    }

    // personal_users의 배열에 추가
    const q = query(collection(db, "personal_users"), where('uid', '==', user.uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocRef = querySnapshot.docs[0].ref;
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const fmArray = userData.likeFm || [];

        const fmIndex = fmArray.findIndex(fm => fm.fmUid === fmId); // fmUid가 현재 프로필의 id와 일치하는 인덱스 찾기

        if (fmIndex !== -1) {
          // 이미 좋아요한 자산관리사인 경우, 배열에서 해당 인덱스를 삭제
          fmArray.splice(fmIndex, 1);
        } else {
          // 좋아요하지 않은 자산관리사인 경우, 배열에 새로운 자산관리사 추가
          const newFm = {
            fmUid: fmId,
          };
          fmArray.push(newFm);
        }

        await updateDoc(userDocRef, {
          likeFm: [...fmArray] // 변경된 부분
        });
      }
    }
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
  
  const checkLiked = useCallback(async (bestFmList) => {
    if (user && user.uid) {
      // personal_users에서 현재 사용자의 좋아요 상태 확인
      const q = query(collection(db, "personal_users"), where('uid', '==', user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDocRef = querySnapshot.docs[0].ref;
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data();
          const fmArray = userData.likeFm || [];

          bestFmList.forEach((fm) => {
            const fmIndex = fmArray.findIndex((item) => item.fmUid === fm.id); // fmUid가 현재 프로필의 id와 일치하는 인덱스 찾기

            if (fmIndex !== -1) {
              fm.liked = true;
            } else {
              fm.liked = false;
            }
          });

          setBestFmList([...bestFmList]);
        }
      }
    }
  }, [user]);

  useEffect(()=>{  
    checkLiked(bestFmList);
  }, [bestFmList])

  return (
    <div>
      {/* 탭 바 */}
      <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", width: "800px", margin: "auto"}}>
        <h2>Best 자산관리사</h2>
        <Link to='/asset/managerlist'>더보기</Link>
      </div>

      {/* 탑 자문사 리스트 */}
      <Slider {...settings}>
      {
        bestFmList && bestFmList.map((fm)=>(
          <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
            <div style={{backgroundColor: "gray", width: "250px", height: "300px", margin: "10px 40px", display: "inline-block", borderRadius: "10px"}}>
              <div style={{backgroundColor: "white", width: "200px", height: "200px", margin: "auto", borderRadius: "10px", backgroundImage: `url(${fm.photo})`, backgroundSize: "cover" }}></div>
              <div>      
                <FontAwesomeIcon 
                  icon={faHeart}
                  fontSize={20}
                  style={{ color: fm.liked ? "red" : "black" }}
                  onClick={()=>{handleLike(fm.id)}}
                />
              </div>
              <h3>{fm.name}</h3>
              <div style={{display: "flex"}}> 
                <p>{fm.field && fm.field[0]}</p>
                <p>{fm.field && fm.field[1]}</p>
                <p>{fm.field && fm.field[2]}</p>
                <p>
                  👩‍❤️‍💋‍👩:{fm.likeNum}
                </p>
              </div>
            </div>
          </Link>
        ))
      }
      </Slider>

      {/* 관련 정보 */}
      <h2>관련정보</h2>
      <div>
        {/* 관련서적 */}
        
      </div>
      <div style={{width: "100%", margin: "0"}}>
        <table>
          <tbody>
          <tr>
            <td>
              <p>관련서적</p>
            </td>
            <td><img src="/img/coin.jpg" width={300} height={180} alt="사진" /></td>
            <td><img src="/img/chart.jpg" width={300} height={180} alt="사진" /></td>
            <td><img src="/img/money.jpg" width={300} height={180} alt="사진" /></td>
            <td><img src="/img/man.jpg" width={300} height={180} alt="사진" /></td>
          </tr>
          <tr>
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
              <td>
                <p>꿀팁영상</p>
              </td>
              <td>
                <iframe width="300" height="180" src="https://www.youtube.com/embed/hikmv2mSVxo" title="3분30초만에 알아보는 자산관리방법 PICK 6" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe width="300" height="180" src="https://www.youtube.com/embed/EnZpz8SgM4U" title="평범한 직장인으로 20억 자산까지 딱 10년!!! 누구의 도움없이도 가능한 돈에 대한 예의를 갖추자! (자산관리 1편)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe width="300" height="180" src="https://www.youtube.com/embed/kQZSeJXq7lE" title="월급의 몇%를 저축하고 있나요? 사회 초년생 월급관리 10분 정리!" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
              <td>
                <iframe width="300" height="180" src="https://www.youtube.com/embed/GJorguPKRTk" title="삼성전자 말고 &#39;이 주식&#39;을 사모으세요. 정말 유일합니다 (이종우)" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
              </td>
          </tr>
          <tr>
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
