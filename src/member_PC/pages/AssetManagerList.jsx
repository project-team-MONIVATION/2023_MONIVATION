// 자산관리사 전체보기 페이지
import React, { useState, useEffect } from 'react'
import {db} from '../../database/firebase'
import { Link } from 'react-router-dom'
import {doc, updateDoc, query, getDocs, collection } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons";


export default function AssetManagerList() {
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
                field : doc.data().field
            }
            dataArray.push(data)
        });
        setFmList(dataArray)
    }
    getList();
  },[])

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
          <button key={i} style={{margin: "5px 15px", backgroundColor: filter.includes(f) ? "gray" : "white"}} onClick={()=>handleFilter(f)}>{f}</button>
        ))}
      </div>
      
      {/* 모든 자산관리사 리스트 */}
      <div>
        { 
          filteredFmList && filteredFmList.map((fm)=>(
            <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
            <div style={{backgroundColor: "gray", width: "250px", height: "300px", margin: "20px 40px", display: "inline-block", borderRadius: "10px"}}>
              <div style={{ position: "absolute", cursor: "pointer"}}>
                <FontAwesomeIcon
                  icon={faHeart}
                  fontSize={20}
                  style={{color: "white"}}
                />
              </div>
              <div style={{backgroundColor: "white", width: "200px", height: "200px", margin: "auto", borderRadius: "10px"}}></div>
              <h3>{fm.name}</h3>
              <div style={{display: "flex"}}> 
                <p>{fm.field && fm.field[0]}</p>
                <p>{fm.field && fm.field[1]}</p>
                <p>{fm.field && fm.field[2]}</p>
                <p>🤍:{fm.likeNum}</p>
              </div>
            </div>
            </Link>
          ))
        }
      </div>
  
    </div>
  )
}
