import React, { useState } from 'react';
import Calendar from 'react-calendar';
import CategoryBtn from '../features/CategoryBtn';

export default function InputExpenseComp({ handleSubmit }) {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState("");
  const [payment, setPayment] =useState("현금");
  const [installment, setInstallment] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState("");
  const [expenseList, setExpenseeList] = useState([]);

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

  const onClickCategory = (e) => {
    setSelectedCategory(e.target.value);
  }

  const YYYY = String(date.getFullYear())
  const MM = String(date.getMonth()+1).padStart(2,"0")
  const DD = String(date.getDate()).padStart(2,"0")
  const valueDate = `${YYYY}-${MM}-${DD}`

  const addExpense = (e) => {
    e.preventDefault();
    const newExpense = {
      date : date,
      price : price,
      payment : payment,
      installment : payment==="카드" ? installment : null,
      category : selectedCategory,
      memo: memo
    }
    setExpenseeList(newExpense);
    console.log(newExpense);
  }
  return (
    <div>
      <form action="" onSubmit={addExpense}>

        <label>날짜</label>
        <div>
          <span>{date && valueDate}</span>
          <button onClick={ onClickCal }>아이콘</button>
        </div>
        <div>
          {
            showCal && (<Calendar onChange={ onClickDate } value={date}/>)
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
            name="일반지출"
            value="카페"
            checked={selectedCategory === "카페"}
            onChange={onClickCategory}
          >
            카페
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="외식"
            checked={selectedCategory === "외식"} 
            onChange={onClickCategory}
          >
            외식
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="음주"
            checked={selectedCategory === "음주"} 
            onChange={onClickCategory}
          >
            음주
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="식료/잡화"
            checked={selectedCategory === "식료/잡화"} 
            onChange={onClickCategory}
          >
            식료/잡화
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="교통"
            checked={selectedCategory === "교통"} 
            onChange={onClickCategory}
          >
            교통
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="차량"
            checked={selectedCategory === "차량"} 
            onChange={onClickCategory}
          >
            차량
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="쇼핑"
            checked={selectedCategory === "쇼핑"} 
            onChange={onClickCategory}
          >
            쇼핑
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="문화생활"
            checked={selectedCategory === "문화생활"} 
            onChange={onClickCategory}
          >
            문화생활
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="경조사"
            checked={selectedCategory === "경조사"} 
            onChange={onClickCategory}
          >
            경조사
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="의료"
            checked={selectedCategory === "의료"} 
            onChange={onClickCategory}
          >
            의료
          </CategoryBtn>
          <CategoryBtn
            name="일반지출"
            value="기타"
            checked={selectedCategory === "기타"} 
            onChange={onClickCategory}
          >
            기타
          </CategoryBtn>
        </div>

        <label>메모</label>
        <div>
          <textarea name="" id="" cols="30" rows="10" onChange={(e)=>setMemo(e.target.value)}/>
        </div>

        <input type="submit" value="입력" disabled={!date || !price || !selectedCategory}/>
      </form>
    </div>
  )
}
