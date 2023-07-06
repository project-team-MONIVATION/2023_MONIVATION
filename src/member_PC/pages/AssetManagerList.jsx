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
          <h1 className='managerlist-h1'>자산관리사 목록</h1>
          <div className='search-bar'>
            <input type="text" value={searchTerm} placeholder='이름을 입력하세요.' onChange={handleInputChange}/>
            <button onClick={handleSearch}>검색</button>
          </div>
        </HeaderBox>
        
        {/* 분야 필터 */}
        <div className='field-btn animated'>
          <p>*태그는 최대 3개까지 선택가능!</p>
          {field.map((f, i)=>(
            <button key={i} className='filter-button' style={{backgroundColor: filter.includes(f) ? "#735BF3" : "#D9D9D9", transition: "background-color 0.5s" }} onClick={()=>handleFilter(f)}>{f}</button>
          ))}
        </div>
        
        {/* 모든 자산관리사 리스트 */}
        <div className='container-box animated'>
          { 
            filteredFmList && filteredFmList.map((fm)=>(
              <Link key={fm.id} to={`/asset/managerlist/${fm.id}`}>
              <AssetBox>
                <AssetImage style={{backgroundImage: `url(${fm.photo})`}}></AssetImage>
                <p style={{margin: "10px 0 5px 0", fontWeight: "bold"}}>{fm.name}</p>
                <AssetField>
                  <div>
                    {fm.field && fm.field[0] && <FieldSpan>{fm.field[0]}</FieldSpan>}
                    {fm.field && fm.field[1] && <FieldSpan>{fm.field[1]}</FieldSpan>}
                    {fm.field && fm.field[2] && <FieldSpan>{fm.field[2]}</FieldSpan>}
                  </div> 
                </AssetField>
                <FontAwesomeIcon
                    icon={faHeart}
                    fontSize={10}
                    style={{ color: "red" }}
                />
                <FieldSpan style={{paddingLeft: "3px" }}>{fm.likeNum}</FieldSpan>
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