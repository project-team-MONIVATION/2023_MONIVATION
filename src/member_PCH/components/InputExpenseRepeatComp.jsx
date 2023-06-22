// 고정수입 입력 모달

import React, { useState } from 'react';

import Calendar from 'react-calendar';
import moment, { locale } from 'moment';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';
import { SelectDate, SelectPeriod } from '../features/IconInModal';

export default function InputExpenseRepeatComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // 기간 입력하는 모달 state
  const [showPeriod, setShowPeriod] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState(null);
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("현금");
  const [selectedCategory, setSelectedCategory] = useState("");
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

  // 기간 입력하는 모달 on
  const onClickPeriod = (e) => {
    e.preventDefault();
    setShowPeriod(true);
  };

  // endDate 값 입력
  const onClickEndDate = (newDate) => {
    setEndDate(newDate);
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
  const inputExpenseRepeat = async(e) => {
    e.preventDefault();
    // 작성된 값을 firestore의 money_expense_repeat 컬렉션에 추가
    await addDoc(collection(db, "money_expense_repeat"), {
      uid : user.uid,
      date : date,
      startDate : date,
      endDate : endDate,
      cycle : cycle,
      price : price,
      payment : payment,
      category : selectedCategory,
      memo : memo
    });
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  };


  return (
    <div id='input_form'>
      <form action="" onSubmit={inputExpenseRepeat}>

        <div className='input_content expense'>
          <div className='date'>
            <p>지출예정일</p>
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

          <div className='period'>
            <p>기간</p>
            <div className='input_box'>
              <span>{date && changeDate(date)} ~ {endDate ? changeDate(endDate) : "0000-00-00"} {cycle ? `/ ${cycle}` : null}</span>
              <button onClick={ onClickPeriod }>
                <SelectPeriod showPeriod={showPeriod}/>
              </button>
            </div>
            <div className='period_modal'>
              {
                showPeriod && (
                  <div className='input_period'>
                    <button 
                      type='button' 
                      onClick={()=>{setShowPeriod(false)}}
                      className='close_btn'
                    >
                      X
                    </button>
                    <div className='flex'>
                      <div className='input_endDate'>
                        <p>종료일</p>
                        <Calendar 
                          formatDay={(locale, date) => moment(date).format('D')}
                          onChange={ onClickEndDate } 
                          value={endDate} 
                          minDate={date}
                          className='modal_calendar period'
                        />
                      </div>
                      <div className='input_cycle'>
                        <p>반복주기</p>
                        <div className='select'>
                          <select 
                            name="cycle"
                            onChange={(e)=>{setCycle(e.target.value)}}
                            className={ cycle !== null ? "active" : ""}
                          >
                            <option value="value" selected disabled>
                            필수선택
                            </option>
                            <option value="매일">매일</option>
                            <option value="매주">매주</option>
                            <option value="매월">매월</option>
                            <option value="매년">매년</option>
                          </select>
                        </div>
                        <button
                          type='button' 
                          onClick={()=>{setShowPeriod(false)}}
                          disabled={!endDate || !cycle}
                          className= {!endDate || !cycle ? "disabled" : ""}
                        >
                          입력
                        </button>
                      </div>
                    </div>
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

          <div>
            <p>결제수단</p>
            <div className='input_box'>
              <select 
                name="payment" 
                id="" 
                value={payment}
                onChange={(e)=>{setPayment(e.target.value)}}
              >
                <option value="현금">현금</option>
                <option value="카드">카드</option>
                <option value="이체">이체</option>
              </select>
            </div>
          </div>

          <div className='category'>
            <p>카테고리</p>
            <div className='category_box'>
              <CategoryBtn
                name="반복지출"
                value="관리비"
                checked={selectedCategory === "관리비"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                관리비
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="통신"
                checked={selectedCategory === "통신"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                통신
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="교통"
                checked={selectedCategory === "교통"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                교통
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="교육"
                checked={selectedCategory === "교육"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                교육
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="보험"
                checked={selectedCategory === "보험"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                보험
              </CategoryBtn>
              <CategoryBtn
                name="반복지출"
                value="기타"
                checked={selectedCategory === "기타"} 
                onChange={onClickCategory}
                selectedCategory ={selectedCategory}
              >
                기타
              </CategoryBtn>
            </div>
          </div>

          <div className='memo'>
            <p>메모</p>
            <div>
              <textarea cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}}/>
            </div>
          </div>
        </div>

        <input 
          className='submit_btn'
          type="submit" 
          value="입력" 
          disabled={!date || !endDate || !cycle || !price || !selectedCategory}
        />
      </form>
    </div>
  )
}
