import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputExpenseComp from './InputExpenseComp';
import InputExpenseRepeatComp from './InputExpenseRepeatComp';


export default function ExpenseModalComp({ setModalIsOpen }) {
  const [showExpense, setShowExpense] = useState(true);
  const [showExpenseRepeat, setShowExpenseRepeat] = useState(false);

  const onShowExpense = () => {
    setShowExpense(true);
    setShowExpenseRepeat(false);
  }

  const onShowExpenseRepeat = () => {
    setShowExpense(false);
    setShowExpenseRepeat(true);
  }

  const handleSubmit = () => {
    // submit 후 모달을 닫기 위함
    setModalIsOpen(false);
  };

  return (
    <div>
      <button onClick={ onShowExpense }>일반지출</button>
      <button onClick={ onShowExpenseRepeat }>반복지출</button>
      {
        showExpense && <InputExpenseComp handleSubmit={handleSubmit}/>
      }
      {
        showExpenseRepeat && <InputExpenseRepeatComp handleSubmit={handleSubmit}/>
      }
    </div>
  )
}
