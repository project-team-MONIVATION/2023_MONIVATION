import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputExpenseComp from './InputExpenseComp';
import InputExpenseRepeatComp from './InputExpenseRepeatComp';


export default function ExpenseModalComp() {
  const [showModal, setShowModal] = useState(false);
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

  return (
    <div>
      <button onClick={()=>{setShowModal(true)}}>지출</button>
      {
        showModal && (
          <div>
            <button onClick={()=>{setShowModal(false)}}>X</button><br />
            <button onClick={ onShowExpense }>일반지출</button>
            <button onClick={ onShowExpenseRepeat }>반복지출</button>
            {
              showExpense && <InputExpenseComp/>
            }
            {
              showExpenseRepeat && <InputExpenseRepeatComp/>
            }
          </div>
        )
      }
    </div>
  )
}
