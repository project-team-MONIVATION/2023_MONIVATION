import React, { useState } from 'react';
import Calendar from 'react-calendar';
import CategoryBtn from '../features/CategoryBtn';

export default function InputExpenseRepeatComp() {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPeriod, setShowPeriod] = useState(false);
  const [showStartCal, setShowStartCal] = useState(true);
  const [showEndCal, setShowEndCal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState("매일");
  const [price, setPrice] = useState("");
  const [payment, setPayment] = useState("현금");
  const [installment, setInstallment] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState();
  const [IncomeRepeatList, setIncomeRepeatList] = useState([]);

  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  }

  const onClickDate = (newDate) => {
    setDate(newDate);
    // console.log(newDate)
    setShowCal(false);
  }

  const onInputInstallment = (e) => {
    if(payment === "카드") {
      setInstallment(e.target.value)
    } else {
      return setInstallment(1);
    }
  }

  const onClickPeriod = (e) => {
    e.preventDefault();
    setShowPeriod(true);
  }

  const onClickStartBtn = (e) => {
    e.preventDefault();
    setShowStartCal(true);
    setShowEndCal(false);
  }

  const onClickStartDate = (newDate) => {
    setStartDate(newDate);
  }

  const onClickEndBtn = (e) => {
    e.preventDefault();
    setShowEndCal(true);
    setShowStartCal(false);
  }

  const onClickEndDate = (newDate) => {
    setEndDate(newDate);
  }

  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value)
  }

  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`
    return valueDate;
  }

  const addExpenseRepeat = (e) => {
    e.preventDefault();
    const newExpenseRepeat = {
      date : date,
      startDate : startDate,
      endDate : endDate,
      cycle : cycle,
      price : price,
      payment : payment,
      installment : payment==="카드" ? installment : null,
      category : selectedCategory,
      memo : memo
    }
    setIncomeRepeatList(newExpenseRepeat);
    console.log(newExpenseRepeat);
  }

  return (
    <div>
      <form action="" onSubmit={addExpenseRepeat}>

        <label>지출예정일</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        <div>
          {
            showCal && (
              <div>
                <button type='button' onClick={()=>{setShowCal(false)}}>X</button>
                <Calendar onChange={ onClickDate } value={date}/>
              </div>
            )
          }
        </div>

        <label>기간</label>
        <div>
          <span>{startDate && changeDate(startDate)} ~ {endDate ? changeDate(endDate) : "0000-00-00"}</span>
          <button onClick={ onClickPeriod }>아이콘</button>
        </div>
        <div>
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
        </div>

        <label>금액</label>
        <div>
          <input 
            type="number" 
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
                <input type="number" min='1' onChange={ onInputInstallment }/>
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
          <textarea name="" id="" cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}}/>
        </div>

        <input type="submit" value="입력" disabled={!date || !startDate || !cycle || !price || !selectedCategory}/>
      </form>
    </div>
  )
}
