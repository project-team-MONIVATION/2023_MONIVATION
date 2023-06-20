import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputExpenseComp from './InputExpenseComp';
import InputExpenseRepeatComp from './InputExpenseRepeatComp';


export default function ExpenseModalComp({ setModalIsOpen }) {
  // 일반지출 모달 state
  const [showExpense, setShowExpense] = useState(true);
  // 반복지출 모달 state
  const [showExpenseRepeat, setShowExpenseRepeat] = useState(false);

  // 일반지출 모달 on
  const onShowExpense = () => {
    setShowExpense(true);
    setShowExpenseRepeat(false);
  };

  // 반복지출 모달 on
  const onShowExpenseRepeat = () => {
    setShowExpense(false);
    setShowExpenseRepeat(true);
  };

  // 일반지출 또는 반복지출 모달의 form에서 submit 후 모달을 닫기 위함
  const handleSubmit = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={ onShowExpense }>일반지출</button>
      <button onClick={ onShowExpenseRepeat }>고정지출</button>

      { // 일반지출 입력 form
        showExpense && <InputExpenseComp handleSubmit={handleSubmit}/>
      }

      { // 반복지출 입력 form
        showExpenseRepeat && <InputExpenseRepeatComp handleSubmit={handleSubmit}/>
      }
    </div>
  )
}
