// 일반수입 입력 모달

import React, { useState } from 'react';

import Calendar from 'react-calendar';
import moment, { locale } from 'moment';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';
import { SelectDate } from '../features/IconInModal';


export default function InputIncomeComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [memo, setMemo] = useState("");

  // 날짜 입력하는 캘린더 모달 on
  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  };

  // 날짜 입력하는 캘린더 모달에서 날짜 클릭 시 date 값 입력
  const onClickDate = (newDate) => {
    setDate(newDate);
    setShowCal(false);
  };
  
  // 금액 ,표시 ex1,000,000
  const handleHyphen = (event) => {
    const value = event.target.value.replace(/[^\d]/g, ''); // 숫자 이외의 문자 제거
    const formattedValue = new Intl.NumberFormat().format(value); // 숫자 형식으로 변환
    event.target.value = formattedValue;
  };

  // selectedCategory 값 입력
  const onClickCategory = (e) => {
    const curChecked = e.target.value;
    setSelectedCategory(curChecked);
  };

  // 캘린더 모달에서 입력한 값을 form에 보여주기 위한 변환 함수
  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear());
    const MM = String(newDate.getMonth()+1).padStart(2,"0");
    const DD = String(newDate.getDate()).padStart(2,"0");
    const valueDate = `${YYYY}-${MM}-${DD}`;
    return valueDate;
  };

  // submit 이벤트
  const inputIncome = async(e) => {
    e.preventDefault();
    // 작성된 값을 firestore의 money_income 컬렉션에 추가
    await addDoc(collection(db, "money_income"), {
      uid : user.uid,
      date : date,
      price : price,
      category : selectedCategory,
      memo : memo
    });
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  };

  return (
    <div id='input_form'>
      <form action="" onSubmit={ inputIncome }>

        <div className='input_content'>
          <div className='date'>
            <p>날짜</p>
            <div className='input_box'>
              <span>{date && changeDate(date)}</span>
              <button onClick={ onClickCal }>
                <SelectDate showCal={showCal}/>
              </button>
            </div>
            <div className='date_modal'>
              {
                showCal && (
                  <div className='input_date'>
                    <button 
                      type='button' 
                      onClick={()=>{setShowCal(false)}}
                      className='close_btn'
                    >
                      X
                    </button>
                    <Calendar 
                      formatDay={(locale, date) => moment(date).format('D')}
                      onChange={ onClickDate } 
                      value={date} 
                      className='modal_calendar'
                    />
                  </div>
                )
              }
            </div>
          </div>

          <div className='price'>
            <p>금액</p>
            <div className='input_box'>
              <input 
                className='input_price'
                type="text"
                onInput={handleHyphen}
                onChange={(e) => {setPrice(Number(e.target.value.replace(/[^0-9]/g, '')))}}
                required
              />
              <span className='won'>₩</span>
            </div>
          </div>

          <div className='category'>
            <p>카테고리</p>
            <div className='category_box'>
              <CategoryBtn
                name="일반수입"
                value="보너스"
                checked={selectedCategory === "보너스"}
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                보너스
              </CategoryBtn>
              <CategoryBtn
                name="일반수입"
                value="용돈"
                checked={selectedCategory === "용돈"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                용돈
              </CategoryBtn>
              <CategoryBtn
                name="일반수입"
                value="재테크"
                checked={selectedCategory === "재테크"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                재테크
              </CategoryBtn>
              <CategoryBtn
                name="일반수입"
                value="기타"
                checked={selectedCategory === "기타"} 
                onChange={onClickCategory}
                selectedCategory = {selectedCategory}
              >
                기타
              </CategoryBtn>
            </div>
          </div>

          <div className='memo'>
            <p>메모</p>
            <div>
              <textarea cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}} />
            </div>
          </div>
        </div>

        <input 
          className='submit_btn'
          type="submit" 
          value="입력" 
          disabled={!date || !price || !selectedCategory}
        />
      </form>
    </div>
  )
}
