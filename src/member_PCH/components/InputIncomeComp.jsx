import React, { useState } from 'react'
import Calendar from 'react-calendar';

import CategoryBtn from '../features/CategoryBtn';


export default function InputIncomeComp() {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState();
  const [IncomeList, setIncomeList] = useState([]);

  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  }

  const onClickDate = (newDate) => {
    setDate(newDate);
    // console.log(newDate)
    setShowCal(false);
  }

  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
  }

  const changeDate = (newDate) => {
    const YYYY = String(newDate.getFullYear())
    const MM = String(newDate.getMonth()+1).padStart(2,"0")
    const DD = String(newDate.getDate()).padStart(2,"0")
    const valueDate = `${YYYY}-${MM}-${DD}`
    return valueDate;
  }

  /** form 에 모든 값을 입력하고 submit할 때 해당 user의 문서 값을 수입,지출 컬렉션의 userid 필드로 전달해준 후 값을 그 외 필드에 전달해줌 */

  const addIncome = (e) => {
    e.preventDefault();
    const newIncome = {
      date : date,
      price : price,
      category : selectedCategory,
      memo: memo
    }
    setIncomeList(newIncome);
    console.log(newIncome);
  }

  return (
    <div>
      <form action="" onSubmit={addIncome}>

        <label>날짜</label>
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
          <textarea name="" id="" cols="30" rows="10" onChange={(e)=>{setMemo(e.target.value)}}/>
        </div>

        <input type="submit" value="입력" disabled={!date || !price || !selectedCategory}/>
      </form>
    </div>
  )
}
