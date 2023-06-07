import React, { useState } from 'react';
import 'react-calendar/dist/Calendar.css';
import InputIncomeComp from './InputIncomeComp';
import InputIncomeRepeatComp from './InputIncomeRepeatComp';

export default function IncomeModalComp() {
  const [showModal, setShowModal] = useState(false);
  const [showIncome, setShowIncome] = useState(true);
  const [showIncomeRepeat, setShowIncomeRepeat] = useState(false);

  const onShowIncome = () => {
    setShowIncome(true); 
    setShowIncomeRepeat(false);
  }

  const onShowRepeatIncome = () => {
    setShowIncome(false);
    setShowIncomeRepeat(true);
  }

  return (
    <div>
      <button onClick={()=>{setShowModal(true)}}>수입</button>
      {
        showModal && (
          <div>
            <button onClick={() => {setShowModal(false)}}>X</button><br />
            <button onClick={ onShowIncome }>일반수입</button>
            <button onClick={ onShowRepeatIncome }>반복수입</button>

            {/** 일반수입 입력 */}
            {
              showIncome && <InputIncomeComp/>
            }

            {/** 반복수입 입력 */}
            {
              showIncomeRepeat && <InputIncomeRepeatComp/>
            }
          </div>
        )
      }
      
    </div>
  )
}
