// 자산관리사 전체보기 페이지
import React, { useState, useEffect, useCallback } from 'react'
import {db} from '../../database/firebase'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { doc, updateDoc, query, getDoc, getDocs, collection, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons";


export default function AssetManagerList() {
  const user = useSelector((state) => state.user.user);

  const field = ["#경제기초", "#기본세무", "#부동산", "#저축", "#연말정산", "#노후계획", "#주식", "#코인", "#사업자", "#프리랜서", "#상속/증여", "#보험"];
  const [fmList, setFmList] = useState([]);
  const [filter, setFilter] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);

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

    // 검색 기능
    const handleSearch = () => {
      const results = fmList.filter((fm) =>
        fm.name && fm.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
    };
  
    const handleInputChange = (e) => {
      setSearchTerm(e.target.value);
    };

    const filteredFmList = fmList.filter((fm) => {
      return (
        fm.name && fm.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (searchResults.length === 0 || searchResults.includes(fm)) &&
        filter.every((item) => fm.field && fm.field.includes(item))
      );
    });
  
  return (
    <div>

      {/* 탭 바 */}
      <div style={{display: "flex", justifyContent: "space-around", alignItems: "center"}}>
        <h1>자산관리사 목록</h1>
        <div>
          <input type="text" value={searchTerm} onChange={handleInputChange}/>
          <button onClick={handleSearch}>검색</button>
        </div>
      </div>
      
      {/* 분야 필터 */}
      <div style={{width: "600px", margin: "auto"}}>
        {field.map((f, i)=>(
          <button key={i} style={{margin: "5px 10px", backgroundColor: filter.includes(f) ? "gray" : "white"}} onClick={()=>handleFilter(f)}>{f}</button>
        ))}
      </div>
      
      {/* 모든 자산관리사 리스트 */}
      <div className='container-box'>
        { 
          filteredFmList && filteredFmList.map((fm)=>(
            <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
            <div style={{backgroundColor: "#735BF3", width: "250px", height: "300px", margin: "20px 40px", display: "inline-block", borderRadius: "20px"}}>
              <div style={{backgroundColor: "white", width: "200px", height: "200px", margin: "auto", marginTop: "20px", borderRadius: "40px", backgroundImage: `url(${fm.photo})`, backgroundSize: "cover"}}></div>
              <h3 style={{margin: "10px 0"}}>{fm.name}</h3>
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
      </div>
  
    </div>
  )
}
