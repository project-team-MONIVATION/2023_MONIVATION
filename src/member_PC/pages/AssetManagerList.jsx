// 자산관리사 전체보기 페이지
import React, { useState, useEffect, useCallback } from 'react'
import {db} from '../../database/firebase'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { doc, updateDoc, query, getDoc, getDocs, collection, where } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import './css/assetManager.css'
import AssetBox from './styledComponent/AssetBox';
import AssetImage from './styledComponent/AssetImage';
import AssetField from './styledComponent/AssetField';
import FieldSpan from './styledComponent/FieldSpan';
import HeaderBox from './styledComponent/HeaderBox';


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
    <div id='layout'>
      <div id='layout-in'>
      <div id='managerlist'>
        {/* 탭 바 */}
        <HeaderBox>
          <h1 style={{fontSize: "1.8rem"}}>자산관리사 목록</h1>
          <div className='search-bar'>
            <input type="text" value={searchTerm} onChange={handleInputChange}/>
            <button onClick={handleSearch}>검색</button>
          </div>
        </HeaderBox>
        
        {/* 분야 필터 */}
        <div className='field-btn'>
          {field.map((f, i)=>(
            <button key={i} style={{backgroundColor: filter.includes(f) ? "#735BF3" : "#D9D9D9" }} onClick={()=>handleFilter(f)}>{f}</button>
          ))}
        </div>
        
        {/* 모든 자산관리사 리스트 */}
        <div className='container-box'>
          { 
            filteredFmList && filteredFmList.map((fm)=>(
              <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
              <AssetBox>
                <AssetImage style={{backgroundImage: `url(${fm.photo})`}}></AssetImage>
                <h3 style={{margin: "10px 0"}}>{fm.name}</h3>
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
        </div>
      </div>
      </div>
    </div>
  )
}