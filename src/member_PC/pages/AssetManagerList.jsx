// 자산관리사 전체보기 페이지
import React, { useState, useEffect, useCallback } from 'react'
import {db} from '../../database/firebase'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { doc, updateDoc, query, getDoc, getDocs, collection, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons";


export default function AssetManagerList() {
  const [liked, setLiked] = useState(false);
  const user = useSelector((state) => state.user.user);

  const field = ["#경제기초", "#기본세무", "#부동산", "#저축", "#연말정산", "#노후계획", "#주식", "#코인", "#사업자", "#프리랜서", "#상속/증여", "#보험"];
  const [fmList, setFmList] = useState([]);
  const [filter, setFilter] = useState([]);

  useEffect(()=>{
    const getList = async () => {
        const q = query(collection(db, "financial_managers"));
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
        setFmList(dataArray)
    }
    getList();
  },[])

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

  const checkLiked = useCallback( async (fmList) => {
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

          fmList.forEach((fm) => {
            const fmIndex = fmArray.findIndex((item) => item.fmUid === fm.id); // fmUid가 현재 프로필의 id와 일치하는 인덱스 찾기

            if (fmIndex !== -1) {
              fm.liked = true;
            } else {
              fm.liked = false;
            }
          });

          setFmList([...fmList]);
        }
      }
    }
  }, [user]);

  useEffect(()=>{  
    checkLiked(fmList);
  }, [fmList])

  // 해시태그 필터 기능
  const handleFilter = (value) => {
    if (filter.includes(value)) {
      // 이미 선택된 필터인 경우 제거
      setFilter(filter.filter((item) => item !== value));
    } else {
      // 선택되지 않은 필터인 경우 추가
      if (filter.length < 3) {
        setFilter([...filter, value]);
      }
    }
  };

  const filteredFmList = fmList && filter.length > 0 ? fmList.filter((fm) => {
    return filter.every((item) => fm.field && fm.field.includes(item));
  }) : fmList;
  
  return (
    <div>

      {/* 탭 바 */}
      <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
        <h1>자산관리사 목록</h1>
        <div>
          <input type="text" />
          <button>검색</button>
        </div>
      </div>
      
      {/* 분야 필터 */}
      <div style={{width: "600px", margin: "auto"}}>
        {field.map((f, i)=>(
          <button key={i} style={{margin: "5px 10px", backgroundColor: filter.includes(f) ? "gray" : "white"}} onClick={()=>handleFilter(f)}>{f}</button>
        ))}
      </div>
      
      {/* 모든 자산관리사 리스트 */}
      <div>
        { 
          filteredFmList && filteredFmList.map((fm)=>(
            <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
            <div style={{backgroundColor: "gray", width: "250px", height: "300px", margin: "20px 40px", display: "inline-block", borderRadius: "10px", position: "relative"}}>
              <div style={{backgroundColor: "white", width: "200px", height: "200px", margin: "auto", borderRadius: "10px", backgroundImage: `url(${fm.photo})`, backgroundSize: "cover"}}></div>
              <div style={{position: "absolute", top: "0"}} onClick={()=>{handleLike(fm.id)}}>
                <FontAwesomeIcon
                  icon={faHeart}
                  fontSize={20}
                  style={{ color: fm.liked ? "red" : "black" }}
                />
              </div>
              <h3>{fm.name}</h3>
              <div style={{display: "flex"}}> 
                <p>{fm.field && fm.field[0]}</p>
                <p>{fm.field && fm.field[1]}</p>
                <p>{fm.field && fm.field[2]}</p>
              </div>
              <p style={{fontSize: "0.8rem"}}>
                👩‍❤️‍👩
                :{fm.likeNum}
              </p>
            </div>
            </Link>
          ))
        }
      </div>
  
    </div>
  )
}
