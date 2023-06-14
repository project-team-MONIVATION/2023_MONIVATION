// 챌린지 생성하기 페이지
import React from 'react'
import { Link } from 'react-router-dom'
import { addDoc, collection, doc, getDocs } from 'firebase/firestore';
import { useRef } from 'react';
import { useEffect, useState } from 'react'
import {useSelector, useDispatch} from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ImgDivBox from '../styled-component/ImgDivBox';

export default function ChallengeCreate() {
  // useRef를 이용해 input태그에 접근한다.
  const imageInput = useRef();
  // 이미지 업로드 확인 함수
  const onFileChanges = (event) => {
    console.log(event.target.files);
  }
  // 챌린지 명
  const [challengeName, setChallengeName] = useState("");
  // 챌린지 기간
  const [challengeTime, setChallengeTime] = useState();
  // 챌린지 내용
  const [challengeContent, setChallengeContent] = useState();
  const challengeData = [
    {
      challenge : {
        name : challengeName,
        time : challengeTime,
        content : challengeContent
      }
    }
  ]
 
  // 버튼클릭시 input태그에 클릭이벤트를 걸어준다. 
  const onCickImageUpload = () => {
    imageInput.current.click();
  };
  return (
    <div>
      <h1>챌린지 생성</h1>
      <form action="">
        {/** 디폴트 이미지 선택은 눌렀을 때 기존에 데이터에 있는 이미지를
           * 끌어와서 선택되게하기
           */}
          <p>이미지 선택</p>
          <hr />
          <ImgDivBox>예시 이미지1</ImgDivBox>
          <ImgDivBox>예시 이미지2</ImgDivBox>
          <ImgDivBox>예시 이미지3</ImgDivBox>
          {/** + 버튼에 이미지불러오기/불러온이미지를 데이터에 할당하는 작업필요 */}
          {/** input태그는 display:"none" 을 이용해 안보이게 숨겨준다. */}
          <input type="file" style={{ display: "none" }} ref={imageInput} 
            accept=".jpeg, .jpg, .png" onChange={(e)=>{onFileChanges(e)}}
          />
          <div style={{display : "inline-block", width : "120px", 
          background : "white", height : "150px", borderRadius : "10px",
          margin : "10px", border : "solid 1px black", cursor : "pointer"}}
          onClick={onCickImageUpload}>
            +
          </div>
          <p>챌린지 정보</p>
          <hr />
          <label htmlFor="" >챌린지명</label>
          <input type="text" value={challengeName} onChange={(e)=>setChallengeName(e.target.value)} /><br />
          <label htmlFor="">기간</label>
          <select name="" id="" onChange={(e)=>setChallengeTime(e.target.value)}>
            <option value="" selected>기간을 선택하세요</option>
            <option value="week">일주일</option>
            <option value="one-month">1개월</option>
            <option value="three-month">3개월</option>
            <option value="six-month">6개월</option>
          </select>
          <p>내용 작성</p>
          <hr />
          <textarea name="" id="" cols="60" rows="10" onChange={(e)=>setChallengeContent(e.target.value)}></textarea>
          <br />
          <button type='submit' onClick={(e)=>{
            e.preventDefault();
            console.log(challengeName);
            console.log(challengeTime);
            console.log(challengeContent);
            console.log(challengeData);
          }}>등록</button>
      </form>
      <Link to='/challenge/challengeID/view'>완료(useParam 사용해서 만든 챌린지 상세보기로 이동)</Link>
    </div>
  )
}
