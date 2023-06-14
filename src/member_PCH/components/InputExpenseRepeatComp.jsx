import React, { useState } from 'react';

import Calendar from 'react-calendar';

import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';

import { useSelector } from 'react-redux';

import CategoryBtn from '../features/CategoryBtn';

export default function InputExpenseRepeatComp({ handleSubmit }) {

  // uid 불러오기 위함
  const user = useSelector((state) => state.user.user);

  // 날짜 입력하는 캘린더 모달 state
  const [showCal, setShowCal] = useState(false);

  // 기간 입력하는 모달 state
  const [showPeriod, setShowPeriod] = useState(false);
  // 기간 입력하는 모달의 캘린더 모달 state
  const [showStartCal, setShowStartCal] = useState(true);
  const [showEndCal, setShowEndCal] = useState(false);

  // form의 입력 값 state
  const [date, setDate] = useState(new Date());
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState("매일");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("현금");
  const [installment, setInstallment] = useState();
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
    // console.log(newDate)
    setShowCal(false);
  };

  // 기간 입력하는 모달 on
  const onClickPeriod = (e) => {
    e.preventDefault();
    setShowPeriod(true);
  };

  // 기간 입력하는 모달의 startDate 입력하는 캘린더 모달 on 
  const onClickStartBtn = (e) => {
    setShowStartCal(true);
    setShowEndCal(false);
  };

  // startDate 값 입력
  const onClickStartDate = (newDate) => {
    setStartDate(newDate);
    onClickEndBtn()
  };

  // 기간 입력하는 모달의 endDate 입력하는 캘린더 모달 on
  const onClickEndBtn = (e) => {
    setShowEndCal(true);
    setShowStartCal(false);
  };

  // endDate 값 입력
  const onClickEndDate = (newDate) => {
    if (startDate >= newDate) {
      return alert('종료일은 시작일보다 작거나 같을 수 없습니다');
    } else {
      return setEndDate(newDate);
    };
  };

  // installment 값 입력
  const onInputInstallment = (e) => {
    if(payment === "카드") {
      return setInstallment(e.target.value);
    } else {
      return setInstallment(1);
    };
  };

  // selectedCategory 값 입력
  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
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
      startDate : startDate,
      endDate : endDate,
      cycle : cycle,
      price : price,
      payment : payment,
      installment : payment==="카드" ? installment : null,
      category : selectedCategory,
      memo : memo
    });
    // 입력 모달창을 닫기 위한 handleSubmit 함수를 호출
    handleSubmit();
  };


  return (
    <div>
      <form action="" onSubmit={inputExpenseRepeat}>

        <label>지출예정일</label>
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

        <label>기간</label>
        <div>
          <span>{startDate && changeDate(startDate)} ~ {endDate ? changeDate(endDate) : "0000-00-00"} {cycle}</span>
          <button onClick={ onClickPeriod }>아이콘</button>
        </div>
        {
          showPeriod && (
            <div>
              <button type='button' onClick={()=>{setShowPeriod(false)}}>X</button>
              <div>
                <button type='button' onClick={ onClickStartBtn }>시작일</button>
                <button type='button' onClick={ onClickEndBtn }>종료일</button>
                {
                  showStartCal && (<Calendar onChange={ onClickStartDate } value={startDate} required/>)
                }
                {
                  showEndCal && (<Calendar onChange={ onClickEndDate } value={endDate}/>)
                }
              </div>
              <div>
                <label>반복주기</label><br />
                <select name="cycle" id="" onChange={(e)=>{setCycle(e.target.value)}}>
                  <option value="매일">매일</option>
                  <option value="매주">매주</option>
                  <option value="매월">매월</option>
                  <option value="매년">매년</option>
                </select>
              </div>
              <button type='button' onClick={()=>{setShowPeriod(false)}}>
                입력
              </button>
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

        <label htmlFor="">결제수단</label>
        <div>
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
          {
            payment && payment === "카드" && (
              <div>
                <label>할부</label>
                <input type="number" min="1" onChange={ onInputInstallment }/>
                <span>개월</span>
              </div>
            )
          }
        </div>

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="반복지출"
            value="관리비"
            checked={selectedCategory === "관리비"} 
            onChange={onClickCategory}
          >
            관리비
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="통신"
            checked={selectedCategory === "통신"} 
            onChange={onClickCategory}
          >
            통신
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="교통"
            checked={selectedCategory === "교통"} 
            onChange={onClickCategory}
          >
            교통
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="교육"
            checked={selectedCategory === "교육"} 
            onChange={onClickCategory}
          >
            교육
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
            value="보험"
            checked={selectedCategory === "보험"} 
            onChange={onClickCategory}
          >
            보험
          </CategoryBtn>
          <CategoryBtn
            name="반복지출"
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
          disabled={!date || !startDate || !cycle || !price || !selectedCategory}
        />
      </form>
    </div>
  )
}
