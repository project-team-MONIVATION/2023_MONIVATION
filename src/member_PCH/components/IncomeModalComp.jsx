import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import CategoryBtn from '../features/CategoryBtn';

export default function IncomeModalComp() {
  const [showIncome, setShowIncome] = useState(true);
  const [showRepeatIncome, setShowRepeatIncome] = useState(false);
  const [showCal, setShowCal] = useState(false);
  const [value, onChange] = useState(new Date());

  const onShowIncome = () => {
    setShowIncome(true);
    setShowRepeatIncome(false);
  }

  const onShowRepeatIncome = () => {
    setShowIncome(false);
    setShowRepeatIncome(true);
  }

  const onClickCal = (e) => {
    e.preventDefault();
    setShowCal(true);
  }

  const onClickDate = (newDate) => {
    onChange(newDate)
    setShowCal(false);
  }

  const YYYY = String(value.getFullYear())
  const MM = String(value.getMonth()+1).padStart(2,"0")
  const DD = String(value.getDate()).padStart(2,"0")
  const valueDate = `${YYYY}-${MM}-${DD}`

  /** form 에 모든 값을 입력하고 submit할 때 해당 user의 문서 값을 수입,지출 컬렉션의 userid 필드로 전달해준 후 값을 그 외 필드에 전달해줌 */

  return (
    <div>
      <button onClick={ onShowIncome }>일반수입</button>
      <button onClick={ onShowRepeatIncome }>반복수입</button>
      {/** 일반수입 입력 */}
      {
        showIncome && (
          <div>
            <form action="">

              <label htmlFor="">날짜</label>
              <div>
                <span>{value && valueDate}</span>
                <button onClick={ onClickCal }>아이콘</button>
              </div>
              <div>
                {
                  showCal && (<Calendar onChange={ onClickDate } value={value}/>)
                }
              </div>

              <label htmlFor="">금액</label>
              <div>
                <input type="text" />
                <span>₩</span>
              </div>

              <label htmlFor="">카테고리</label>
              <div>
                <CategoryBtn>보너스</CategoryBtn>
                <CategoryBtn>용돈</CategoryBtn>
                <CategoryBtn>재테크</CategoryBtn>
                <CategoryBtn>기타</CategoryBtn>
              </div>

              <label htmlFor="">메모</label>
              <div>
                <textarea name="" id="" cols="30" rows="10"></textarea>
              </div>
            </form>
          </div>
        )
      }
      {/** 반복수입 입력 */}
    </div>
  )
}
