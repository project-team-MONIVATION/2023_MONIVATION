import React, { useState } from 'react'
import Calendar from 'react-calendar'

import CategoryBtn from '../features/CategoryBtn'

export default function InputIncomeRepeatComp() {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPeriod, setShowPeriod] = useState(false);
  const [showStartCal, setShowStartCal] = useState(true);
  const [showEndCal, setShowEndCal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(null);
  const [cycle, setCycle] = useState("매일");
  const [price, setPrice] = useState("");
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

  /** form 에 모든 값을 입력하고 submit할 때 해당 user의 문서 값을 수입,지출 컬렉션의 userid 필드로 전달해준 후 값을 그 외 필드에 전달해줌 */

  const addIncomeRepeat = (e) => {
    e.preventDefault();
    const newIncomeRepeat = {
      date : date,
      startDate : startDate,
      endDate : endDate,
      cycle : cycle,
      price : price,
      category : selectedCategory,
      memo : memo
    }
    setIncomeRepeatList(newIncomeRepeat);
    console.log(newIncomeRepeat);
  }

  return (
    <div>
      <form action="" onSubmit={addIncomeRepeat}>

        <label>수입예정일</label>
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

        <label>카테고리</label>
        <div>
          <CategoryBtn
            name="반복수입"
            value="월급"
            checked={selectedCategory === "월급"} 
            onChange={onClickCategory}
          >
            월급
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
            value="용돈"
            checked={selectedCategory === "용돈"} 
            onChange={onClickCategory}
          >
            용돈
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
            value="지원금"
            checked={selectedCategory === "지원금"} 
            onChange={onClickCategory}
          >
            지원금
          </CategoryBtn>
          <CategoryBtn
            name="반복수입"
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
