import React, { useState } from 'react'
import Calendar from 'react-calendar'

import CategoryBtn from '../features/CategoryBtn'

export default function IncomeRepeatComp() {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [showPeriod, setShowPeriod] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("");

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

  return (
    <div>
      <form action="">

        <label>수입예정일</label>
        <div>
          <span>{date && changeDate(date)}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        <div>
          {
            showCal && (<Calendar onChange={ onClickDate } value={date}/>)
          }
        </div>

        <label>기간</label>
        <div>
          <span>{startDate && changeDate(startDate)}</span>
          <button onClick={ onClickPeriod }>아이콘</button>
        </div>
        <div>
          {
            showPeriod && (
              <div>
                <button type='button'>시작일</button>
                <button type='button'>종료일</button>
                <Calendar onChange={ onClickDate } /*value={value}*//>
              </div>
            )
          }
        </div>

        <label>금액</label>
        <div>
          <input type="text" required/>
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
          <textarea name="" id="" cols="30" rows="10"/>
        </div>

        <input type="submit" value="입력"/>
      </form>
    </div>
  )
}
