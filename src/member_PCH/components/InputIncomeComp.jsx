import React, { useState } from 'react'
import Calendar from 'react-calendar';

import CategoryBtn from '../features/CategoryBtn';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../database/firebase';
import { useDispatch, useSelector } from 'react-redux';



export default function InputIncomeComp({ handleSubmit }) {
  const [showCal, setShowCal] = useState(false);
  const [date, setDate] = useState(new Date());
  const [price, setPrice] = useState();
  const [selectedCategory, setSelectedCategory] = useState("");
  const [memo, setMemo] = useState();
  const [IncomeList, setIncomeList] = useState([]);

  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

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

  const addIncome = async(e) => {
    e.preventDefault();
    // 작성된 값을 firestore의 money_income 컬렉션에 추가
    const docRec = await addDoc(collection(db, "money_income"), {
      uid : user.uid,
      date : date,
      price : price,
      category : selectedCategory,
      memo : memo
    });
    // submit 이벤트 처리 완료 후 handleSubmit 함수를 호출합니다.
    handleSubmit();
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

        <input 
          type="submit" 
          value="입력" 
          disabled={!date || !price || !selectedCategory}
          onClick={()=>{
            dispatch(addIncome({
              uid : user.uid,
              date : date,
              price : price,
              category : selectedCategory,
              memo : memo
            }))
          }}
        />
      </form>
    </div>
  )
}
