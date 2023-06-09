import React, { useState } from 'react'

import Calendar from 'react-calendar';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';


export default function InputIncomeComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState("");

  // 날짜 입력하는 캘린더 모달 on
  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  }

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
    setShowCal(false);
  }

  // selectedCategory 값 입력
  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
  }

  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`
    return valueDate;
  }

  // submit 이벤트
  const inputIncome = async(e) => {
    e.preventDefault();
    // 작성된 값을 firestore의 money_income 컬렉션에 추가
    const docRef = await addDoc(collection(db, "money_income"), {
      uid : user.uid,
      date : date,
      price : price,
      category : selectedCategory,
      memo : memo
    });
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  }

  return (
    <div>
      <form action="" onSubmit={ inputIncome }>

        <label>날짜</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        {
          showCal && (
            <div>
              <button type='button' onClick={()=>{setShowCal(false)}}>X</button>
              <Calendar onChange={ onClickDate } value={date}/>
            </div>
          )
        }

        <label>금액</label>
        <div>
          <input 
            type="number" 
            min="0"
            onChange={(e)=>{setPrice(Number(e.target.value))}}
            required
          />
          <span>₩</span>
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="일반수입"
            value="보너스"
            checked={selectedCategory === "보너스"}
            onChange={onClickCategory}
          >
            보너스
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="용돈"
            checked={selectedCategory === "용돈"} 
            onChange={onClickCategory}
          >
            용돈
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="재테크"
            checked={selectedCategory === "재테크"} 
            onChange={onClickCategory}
          >
            재테크
          </CategoryBtn>
          <CategoryBtn
            name="일반수입"
            value="기타"
            checked={selectedCategory === "기타"} 
            onChange={onClickCategory}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}}/>
        </div>

        <input 
          type="submit" 
          value="입력" 
          disabled={!date || !price || !selectedCategory}
        />
      </form>
    </div>
  )
}
